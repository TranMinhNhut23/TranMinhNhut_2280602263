var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');

// Schema
const categorySchema = new mongoose.Schema({
    name: { type: String, required: true }
});
const Category = mongoose.model('Category', categorySchema);

// Lấy tất cả categories
router.get('/', async (req, res) => {
    try {
        const categories = await Category.find();
        res.json(categories);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Tạo mới
router.post('/', async (req, res) => {
    try {
        const newCategory = new Category({ name: req.body.name });
        const saved = await newCategory.save();
        res.json(saved);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Lấy 1 category theo id
router.get('/:id', async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) return res.status(404).json({ message: 'Not found' });
        res.json(category);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Cập nhật
router.put('/:id', async (req, res) => {
    try {
        const updated = await Category.findByIdAndUpdate(
            req.params.id,
            { name: req.body.name },
            { new: true }
        );
        res.json(updated);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Xoá
router.delete('/:id', async (req, res) => {
    try {
        await Category.findByIdAndDelete(req.params.id);
        res.json({ message: 'Deleted' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;
