// backend/controllers/authController.js

const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const nodemailer = require('nodemailer');

const User = require('../models/User');
const RefreshToken = require('../models/RefreshToken');

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '15m';
const REFRESH_TOKEN_EXPIRY_DAYS = parseInt(process.env.REFRESH_TOKEN_EXPIRY_DAYS) || 7;

/**
 * @desc    Hàm trợ giúp để tạo Access Token, Refresh Token và thông tin người dùng.
 * @param   {object} user - Đối tượng người dùng từ MongoDB.
 * @returns {object} Chứa accessToken, refreshToken, và thông tin user trả về cho client.
 */
const createAndSendTokens = async (user) => {
    const accessToken = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    const refreshToken = uuidv4();
    const expiresAt = new Date(Date.now() + REFRESH_TOKEN_EXPIRY_DAYS * 24 * 60 * 60 * 1000);

    await RefreshToken.create({ token: refreshToken, user: user._id, expiresAt });

    const userResponse = { id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar };
    return { accessToken, refreshToken, user: userResponse };
};

/**
 * @desc    Đăng ký người dùng mới
 * @route   POST /api/auth/signup
 * @access  Public
 */
exports.signup = async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin.' });
    }
    if (password.length < 6) {
        return res.status(400).json({ message: 'Mật khẩu phải có ít nhất 6 ký tự.' });
    }
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email này đã được sử dụng.' });
        }
        const user = new User({ name, email, password });
        await user.save();
        const tokens = await createAndSendTokens(user);
        res.status(201).json(tokens);
    } catch (err) {
        console.error("Lỗi khi đăng ký:", err);
        res.status(500).json({ message: 'Lỗi máy chủ.' });
    }
};

/**
 * @desc    Đăng nhập người dùng
 * @route   POST /api/auth/login
 * @access  Public
 */
exports.login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Vui lòng nhập email và mật khẩu.' });
    }
    try {
        const user = await User.findOne({ email }).select('+password');
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Email hoặc mật khẩu không chính xác.' });
        }
        const tokens = await createAndSendTokens(user);
        res.status(200).json(tokens);
    } catch (err) {
        console.error("Lỗi khi đăng nhập:", err);
        res.status(500).json({ message: 'Lỗi máy chủ.' });
    }
};

/**
 * @desc    Làm mới Access Token
 * @route   POST /api/auth/refresh
 * @access  Public
 */
exports.refreshToken = async (req, res) => {
    const { token: requestToken } = req.body;
    if (!requestToken) {
        return res.status(401).json({ message: 'Refresh Token là bắt buộc.' });
    }
    try {
        const refreshTokenDoc = await RefreshToken.findOne({ token: requestToken });
        if (!refreshTokenDoc || refreshTokenDoc.expiresAt < new Date()) {
            return res.status(403).json({ message: 'Refresh Token không hợp lệ hoặc đã hết hạn.' });
        }
        const user = await User.findById(refreshTokenDoc.user);
        if (!user) {
            return res.status(403).json({ message: 'Không tìm thấy người dùng được liên kết với token này.' });
        }
        const newAccessToken = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
        res.json({ accessToken: newAccessToken });
    } catch (err) {
        console.error("Lỗi khi làm mới token:", err);
        res.status(500).json({ message: 'Lỗi máy chủ.' });
    }
};

/**
 * @desc    Đăng xuất người dùng
 * @route   POST /api/auth/logout
 * @access  Public
 */
exports.logout = async (req, res) => {
    const { token } = req.body;
    try {
        await RefreshToken.deleteOne({ token });
        res.status(200).json({ message: 'Đăng xuất thành công.' });
    } catch (err) {
        console.error("Lỗi khi đăng xuất:", err);
        res.status(500).json({ message: 'Lỗi máy chủ.' });
    }
};

/**
 * @desc    Xử lý yêu cầu quên mật khẩu
 * @route   POST /api/auth/forgot-password
 * @access  Public
 */
exports.forgotPassword = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(200).json({ message: 'Nếu email tồn tại, một liên kết đặt lại mật khẩu đã được gửi.' });
        }

        const resetToken = crypto.randomBytes(20).toString('hex');

        user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        
        user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 phút
        await user.save({ validateBeforeSave: false });

        const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        await transporter.sendMail({
            from: `MyApp <${process.env.EMAIL_USER}>`,
            to: user.email,
            subject: 'Yêu cầu đặt lại mật khẩu',
            text: `Bạn nhận được email này vì đã yêu cầu đặt lại mật khẩu. Vui lòng nhấn vào link sau (hiệu lực trong 10 phút):\n\n${resetUrl}`,
        });

        res.status(200).json({ message: 'Email hướng dẫn đã được gửi.' });
    } catch (err) {
        console.error("Lỗi quên mật khẩu:", err);
        res.status(500).json({ message: 'Lỗi khi gửi email, vui lòng thử lại.' });
    }
};

/**
 * @desc    Đặt lại mật khẩu người dùng
 * @route   PUT /api/auth/reset-password/:token
 * @access  Public
 */
exports.resetPassword = async (req, res) => {
    try {
        const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
        
        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpires: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ message: 'Token không hợp lệ hoặc đã hết hạn.' });
        }

        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.status(200).json({ message: 'Đặt lại mật khẩu thành công.' });
    } catch (err) {
        console.error("Lỗi đặt lại mật khẩu:", err);
        res.status(500).json({ message: 'Lỗi máy chủ.' });
    }
};