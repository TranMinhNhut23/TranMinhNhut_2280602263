var express = require('express');
var router = express.Router();
let Category = require('../schemas/categories');
let {Response} = require('../utils/responseHandler');
let {Authentication, Authorization} = require('../utils/authHandler');

// View categories - USER, MOD, ADMIN
router.get('/', Authentication, Authorization("USER", "MOD", "ADMIN"), async function(req, res) {
    try {
        let categories = await Category.find({isDeleted: false});
        Response(res, 200, true, categories);
    } catch (error) {
        Response(res, 500, false, error);
    }
});

// Get single category - USER, MOD, ADMIN
router.get('/:id', Authentication, Authorization("USER", "MOD", "ADMIN"), async function(req, res) {
    try {
        let category = await Category.findOne({_id: req.params.id, isDeleted: false});
        if (!category) {
            return Response(res, 404, false, "Category not found");
        }
        Response(res, 200, true, category);
    } catch (error) {
        Response(res, 500, false, error);
    }
});

// Create category - MOD, ADMIN
router.post('/', Authentication, Authorization("MOD", "ADMIN"), async function(req, res) {
    try {
        let category = new Category({
            name: req.body.name,
            description: req.body.description
        });
        await category.save();
        Response(res, 201, true, category);
    } catch (error) {
        Response(res, 500, false, error);
    }
});

// Update category - MOD, ADMIN
router.put('/:id', Authentication, Authorization("MOD", "ADMIN"), async function(req, res) {
    try {
        let category = await Category.findOneAndUpdate(
            {_id: req.params.id, isDeleted: false},
            {
                name: req.body.name,
                description: req.body.description
            },
            {new: true}
        );
        if (!category) {
            return Response(res, 404, false, "Category not found");
        }
        Response(res, 200, true, category);
    } catch (error) {
        Response(res, 500, false, error);
    }
});

// Delete category - ADMIN only
router.delete('/:id', Authentication, Authorization("ADMIN"), async function(req, res) {
    try {
        let category = await Category.findOneAndUpdate(
            {_id: req.params.id, isDeleted: false},
            {isDeleted: true},
            {new: true}
        );
        if (!category) {
            return Response(res, 404, false, "Category not found");
        }
        Response(res, 200, true, "Category deleted successfully");
    } catch (error) {
        Response(res, 500, false, error);
    }
});

module.exports = router;