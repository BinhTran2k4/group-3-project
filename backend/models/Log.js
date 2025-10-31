// backend/models/Log.js

const mongoose = require('mongoose');

const LogSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Liên kết đến model User
        required: true,
    },
    action: {
        type: String,
        required: true,
        // Liệt kê các hành động bạn muốn ghi lại
        enum: ['LOGIN_SUCCESS', 'LOGIN_FAIL', 'LOGOUT', 'UPDATE_PROFILE', 'DELETE_USER'],
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
    details: {
        type: String, // (Tùy chọn) Thêm chi tiết nếu cần
    },
});

module.exports = mongoose.model('Log', LogSchema);