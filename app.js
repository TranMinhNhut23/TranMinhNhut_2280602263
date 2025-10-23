var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
let mongoose = require('mongoose');
let { Response } = require('./utils/responseHandler');

// =========================
// 🔹 Kết nối MongoDB
// =========================
mongoose.connect('mongodb://localhost:27017/NNPTUD-S5')
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.log('❌ MongoDB error:', err));

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var messagesRouter = require('./routes/messages');

var app = express();

// =========================
// 🔹 Cấu hình CORS (rất quan trọng)
// =========================
app.use(cors({
  origin: ['http://127.0.0.1:5500', 'http://localhost:5500'], // Cho phép từ frontend
  credentials: true, // Cho phép cookie & token
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// =========================
// 🔹 View engine setup
// =========================
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// =========================
// 🔹 Middleware cơ bản
// =========================
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// =========================
// 🔹 Các route chính
// =========================
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/roles', require('./routes/roles'));
app.use('/auth', require('./routes/auth'));
app.use('/files', require('./routes/files'));
app.use('/message', messagesRouter);

// =========================
// 🔹 Xử lý lỗi 404
// =========================
app.use(function (req, res, next) {
  next(createError(404));
});

// =========================
// 🔹 Xử lý lỗi tổng quát
// =========================
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  Response(res, err.status || 500, false, err);
});

module.exports = app;
