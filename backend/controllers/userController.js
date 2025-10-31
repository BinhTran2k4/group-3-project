// backend/controllers/userController.js
const User = require('../models/User');
const cloudinary = require('cloudinary').v2;

// [GET] /api/users/profile - Lấy thông tin của người dùng đang đăng nhập
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

// [PUT] /api/users/profile - Cập nhật thông tin của người dùng đang đăng nhập
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

// [GET] /api/users - Lấy danh sách tất cả người dùng
exports.getUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Lỗi máy chủ' });
    }
};

// ✅ SỬA LẠI HOÀN TOÀN HÀM NÀY
// [DELETE] /api/users/:id - Xóa một người dùng bất kỳ theo ID
exports.deleteUser = async (req, res) => {
    try {
        // Tìm người dùng mục tiêu (người sắp bị xóa)
        const userToDelete = await User.findById(req.params.id);

        if (!userToDelete) {
            return res.status(404).json({ message: "Không tìm thấy người dùng để xóa." });
        }

        // Lấy thông tin người thực hiện yêu cầu (từ token đã giải mã)
        const requestingUser = req.user;

        // --- QUY TẮC PHÂN QUYỀN ---
        // 1. Moderator không được phép xóa Admin
        if (userToDelete.role === 'admin' && requestingUser.role === 'moderator') {
            return res.status(403).json({ message: 'Bạn không có quyền xóa tài khoản Admin.' });
        }
        
        // 2. Không ai được tự xóa chính mình qua API này
        if (userToDelete.id === requestingUser.id) {
            return res.status(400).json({ message: 'Bạn không thể tự xóa chính mình.' });
        }
        
        // Nếu vượt qua các kiểm tra, tiến hành xóa
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
        const b64 = Buffer.from(req.file.buffer).toString("base64");
        let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
        const result = await cloudinary.uploader.upload(dataURI, {
            folder: "avatars",
            resource_type: "image",
        });
        const user = await User.findByIdAndUpdate(req.user.id, { avatar: result.secure_url }, { new: true });
        res.status(200).json({
            message: 'Upload avatar thành công!',
            avatar: user.avatar, // Trả về key `avatar` để khớp với frontend
        });
    } catch (err) {
        console.error("Lỗi upload avatar:", err);
        res.status(500).json({ message: 'Lỗi máy chủ' });
    }
};