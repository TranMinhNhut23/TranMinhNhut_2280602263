var express = require('express');
var router = express.Router();
let Message = require('../schemas/messages');
let { Response } = require('../utils/responseHandler');
let { Authentication } = require('../utils/authHandler');
const { body, validationResult } = require('express-validator');

// Validator cho tin nhắn mới
const messageValidator = [
    body('to').notEmpty().withMessage('Người nhận không được để trống'),
    body('text').notEmpty().withMessage('Nội dung tin nhắn không được để trống')
];

// GET /message/:userId - Lấy danh sách tin nhắn giữa 2 người
router.get('/:userId', Authentication, async function(req, res) {
    try {
        const messages = await Message.find({
            $or: [
                { from: req.userId, to: req.params.userId },
                { from: req.params.userId, to: req.userId }
            ]
        })
        .sort({ createdAt: 1 }) // Sắp xếp theo thời gian tăng dần
        .populate('from', 'username')
        .populate('to', 'username');

        Response(res, 200, true, messages);
    } catch (error) {
        Response(res, 500, false, error.message);
    }
});

// POST /message - Gửi tin nhắn mới
router.post('/', Authentication, messageValidator, async function(req, res) {
    try {
        // Kiểm tra lỗi validation
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return Response(res, 400, false, errors.array());
        }

        const newMessage = new Message({
            from: req.userId, // Lấy từ token authentication
            to: req.body.to,
            text: req.body.text
        });

        await newMessage.save();
        
        // Populate thông tin người gửi/nhận trước khi trả về
        const populatedMessage = await Message.findById(newMessage._id)
            .populate('from', 'username')
            .populate('to', 'username');

        Response(res, 200, true, populatedMessage);
    } catch (error) {
        Response(res, 500, false, error.message);
    }
});

module.exports = router;