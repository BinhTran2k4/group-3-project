//npm install nodemailer
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

// --- Đăng ký tài khoản ---
exports.signup = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin.' });
    }
    // Thêm kiểm tra độ dài mật khẩu ở đây để phản hồi nhanh hơn
    if (password.length < 6) {
        return res.status(400).json({ message: 'Mật khẩu phải có ít nhất 6 ký tự.' });
    }

    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'Email này đã được sử dụng.' });
        }

        user = new User({ name, email, password });
        await user.save();

        // Tạo và trả về JWT token
        const payload = {
            user: {
                id: user.id,
                role: user.role
            }
        };

        jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
            if (err) throw err;
            res.status(201).json({ token });
        });

    } catch (err) {
        console.error("Lỗi khi đăng ký:", err);
        // Trả về lỗi validation nếu có
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map(val => val.message);
            return res.status(400).json({ message: messages.join(' ') });
        }
        res.status(500).json({ message: 'Lỗi máy chủ, vui lòng thử lại sau.' });
    }
};


exports.login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Vui lòng nhập email và mật khẩu.' });
    }

    try {
        // Tìm người dùng và yêu cầu lấy cả mật khẩu
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(400).json({ message: 'Email hoặc mật khẩu không chính xác.' });
        }

        // So sánh mật khẩu
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Email hoặc mật khẩu không chính xác.' });
        }

        // Tạo và gửi lại JWT token
        const payload = {
            user: {
                id: user.id,
                role: user.role
            }
        };

        jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
            if (err) throw err;
            res.json({ token });
        });

    } catch (err) {
        console.error("Lỗi khi đăng nhập:", err);
        res.status(500).json({ message: 'Lỗi máy chủ, vui lòng thử lại sau.' });
    }
};


exports.forgotPassword = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });

        if (!user) {
            return res.status(200).json({ message: 'Email hướng dẫn đã được gửi (nếu email tồn tại trong hệ thống).' });
        }

        const resetToken = crypto.randomBytes(20).toString('hex');

        user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 phút

        await user.save({ validateBeforeSave: false });

        const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;
        
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        await transporter.sendMail({
            to: user.email,
            subject: 'Yêu cầu đặt lại mật khẩu',
            html: `Chào bạn, <br><br> Vui lòng nhấn vào liên kết sau để đặt lại mật khẩu (link có hiệu lực trong 10 phút): <a href="${resetUrl}">${resetUrl}</a>`
        });

        res.status(200).json({ message: 'Email hướng dẫn đã được gửi.' });
    } catch (err) {
        if (req.body.email) {
            const userWithError = await User.findOne({ email: req.body.email });
            if (userWithError) {
                userWithError.resetPasswordToken = undefined;
                userWithError.resetPasswordExpire = undefined;
                await userWithError.save({ validateBeforeSave: false });
            }
        }
        console.error("Lỗi quên mật khẩu:", err);
        res.status(500).json({ message: 'Lỗi máy chủ' });
    }
};


exports.resetPassword = async (req, res) => {
    try {
        const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ message: 'Token không hợp lệ hoặc đã hết hạn.' });
        }

        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();
        
        res.status(200).json({ message: 'Đặt lại mật khẩu thành công.' });
    } catch (err) {
        console.error("Lỗi đặt lại mật khẩu:", err);
        res.status(500).json({ message: 'Lỗi máy chủ' });
    }
};