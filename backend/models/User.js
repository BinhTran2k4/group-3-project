// backend/models/User.js

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // Bắt buộc phải import thư viện này

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Vui lòng nhập tên'],
    },
    email: {
        type: String,
        required: [true, 'Vui lòng nhập email'],
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Vui lòng nhập một địa chỉ email hợp lệ'
        ]
    },
    password: {
        type: String,
        required: [true, 'Vui lòng nhập mật khẩu'],
        minlength: 6,
        select: false // Không trả về trường password trong các câu truy vấn mặc định
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    avatar: {
        type: String,
        default: 'no-photo.jpg'
    },
    
    resetPasswordToken: String,
    resetPasswordExpire: Date,
}, {
    timestamps: true // Tự động thêm createdAt và updatedAt
});



UserSchema.pre('save', async function (next) {
  
    if (!this.isModified('password')) {
        return next();
    }
    // Mã hóa mật khẩu
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});


module.exports = mongoose.model('User', UserSchema);