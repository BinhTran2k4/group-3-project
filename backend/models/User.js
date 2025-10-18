// backend/models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Vui lòng nhập tên'], // Thêm thông báo lỗi
    },
    email: {
        type: String,
        required: [true, 'Vui lòng nhập email'],
        unique: true, // Đảm bảo email là duy nhất
        match: [ // Kiểm tra định dạng email hợp lệ
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Vui lòng nhập một địa chỉ email hợp lệ'
        ]
    },
    password: {
        type: String,
        required: [true, 'Vui lòng nhập mật khẩu'],
        minlength: 6, // Mật khẩu cần có ít nhất 6 ký tự
        select: false // Không trả về trường password trong các câu truy vấn mặc định
    },
    role: {
        type: String,
        enum: ['user', 'admin'], // Vai trò chỉ có thể là 'user' hoặc 'admin'
        default: 'user' // Vai trò mặc định khi tạo mới là 'user'
    },
    avatar: {
        type: String, // Sẽ lưu URL của ảnh đại diện
        default: 'no-photo.jpg' // Một ảnh mặc định
    }
}, {
    timestamps: true // Tự động thêm 2 trường createdAt và updatedAt
});

module.exports = mongoose.model('User', UserSchema);