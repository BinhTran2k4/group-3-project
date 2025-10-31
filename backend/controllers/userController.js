// backend/controllers/userController.js
const User = require('../models/User');
const cloudinary = require('cloudinary').v2;
const sharp = require('sharp'); 

// --- CÁC HÀM MỚI CHO PROFILE CÁ NHÂN ---

// [GET] /api/users/profile
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'Không tìm thấy người dùng.' });
        }
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Lỗi máy chủ' });
    }
};

// [PUT] /api/users/profile
exports.updateProfile = async (req, res) => {
    const { name } = req.body; // Chỉ cho phép cập nhật tên ở đây
    try {
        const user = await User.findByIdAndUpdate(req.user.id, { name }, { new: true, runValidators: true }).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'Không tìm thấy người dùng.' });
        }
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Lỗi máy chủ' });
    }
};

// --- CÁC HÀM DÀNH CHO ADMIN ---

// [GET] /api/users
exports.getUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Lỗi máy chủ' });
    }
};

// [DELETE] /api/users/:id
exports.deleteUser = async (req, res) => {
    try {
        const userToDelete = await User.findById(req.params.id);
        if (!userToDelete) {
            return res.status(404).json({ message: "Không tìm thấy người dùng để xóa." });
        }
        const requestingUser = req.user;
        if (userToDelete.role === 'admin' && requestingUser.role === 'moderator') {
            return res.status(403).json({ message: 'Bạn không có quyền xóa tài khoản Admin.' });
        }
        if (userToDelete.id === requestingUser.id) {
            return res.status(400).json({ message: 'Bạn không thể tự xóa chính mình.' });
        }
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: "Người dùng đã được xóa thành công." });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Lỗi máy chủ' });
    }
};

// Cấu hình Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});


// [POST] /api/users/avatar - Cập nhật ảnh đại diện
exports.updateAvatar = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Vui lòng chọn một file ảnh.' });
        }

        // Dùng sharp để xử lý ảnh: resize thành hình vuông 250x250 và chuyển sang PNG
        const processedImageBuffer = await sharp(req.file.buffer)
            .resize(250, 250)
            .png()
            .toBuffer();

        // Chuyển buffer đã xử lý thành dạng mà Cloudinary có thể đọc
        const base64Image = processedImageBuffer.toString('base64');
        const dataUri = `data:image/png;base64,${base64Image}`;

        // Tải ảnh đã xử lý lên Cloudinary
        const result = await cloudinary.uploader.upload(dataUri, {
            folder: 'avatars' // Lưu vào thư mục 'avatars' trên Cloudinary
        });

        // Cập nhật lại đường dẫn avatar cho user trong DB
        const user = await User.findByIdAndUpdate(
            req.user.id, 
            { avatar: result.secure_url }, 
            { new: true }
        ).select('-password');

        res.status(200).json({
            message: 'Upload avatar thành công!',
            avatar: user.avatar, 
        });
    } catch (err) {
        console.error("Lỗi upload avatar:", err);
        res.status(500).json({ message: 'Lỗi máy chủ khi upload ảnh.' });
    }
};