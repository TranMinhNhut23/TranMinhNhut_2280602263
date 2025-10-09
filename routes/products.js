var express = require('express');
var router = express.Router();
let Product = require('../schemas/products');
let {Response} = require('../utils/responseHandler');
let {Authentication, Authorization} = require('../utils/authHandler');

// View products - USER, MOD, ADMIN
router.get('/', Authentication, Authorization("USER", "MOD", "ADMIN"), async function(req, res) {
    try {
        let products = await Product.find({isDeleted: false}).populate('category');
        Response(res, 200, true, products);
    } catch (error) {
        Response(res, 500, false, error);
    }
});

// Get single product - USER, MOD, ADMIN
router.get('/:id', Authentication, Authorization("USER", "MOD", "ADMIN"), async function(req, res) {
    try {
        let product = await Product.findOne({_id: req.params.id, isDeleted: false}).populate('category');
        if (!product) {
            return Response(res, 404, false, "Product not found");
        }
        Response(res, 200, true, product);
    } catch (error) {
        Response(res, 500, false, error);
    }
});

// Create product - MOD, ADMIN
router.post('/', Authentication, Authorization("MOD", "ADMIN"), async function(req, res) {
    try {
        let product = new Product({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            category: req.body.categoryId
        });
        await product.save();
        Response(res, 201, true, product);
    } catch (error) {
        Response(res, 500, false, error);
    }
});

// Update product - MOD, ADMIN
router.put('/:id', Authentication, Authorization("MOD", "ADMIN"), async function(req, res) {
    try {
        let product = await Product.findOneAndUpdate(
            {_id: req.params.id, isDeleted: false},
            {
                name: req.body.name,
                description: req.body.description,
                price: req.body.price,
                category: req.body.categoryId
            },
            {new: true}
        );
        if (!product) {
            return Response(res, 404, false, "Product not found");
        }
        Response(res, 200, true, product);
    } catch (error) {
        Response(res, 500, false, error);
    }
});

// Delete product - ADMIN only
router.delete('/:id', Authentication, Authorization("ADMIN"), async function(req, res) {
    try {
        let product = await Product.findOneAndUpdate(
            {_id: req.params.id, isDeleted: false},
            {isDeleted: true},
            {new: true}
        );
        if (!product) {
            return Response(res, 404, false, "Product not found");
        }
        Response(res, 200, true, "Product deleted successfully");
    } catch (error) {
        Response(res, 500, false, error);
    }
});

module.exports = router;