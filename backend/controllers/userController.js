
const User = require('../models/User');
const cloudinary = require('cloudinary').v2;

exports.getProfile = async (req, res) => {
    try {
       
        const user = await User.findById(req.user.id).select('-password'); // Bỏ qua trường password
        if (!user) {
            return res.status(404).json({ message: 'Không tìm thấy người dùng.' });
        }
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Lỗi máy chủ' });
    }
};


exports.updateProfile = async (req, res) => {
    const { name, avatar } = req.body;
    try {
        let user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'Không tìm thấy người dùng.' });
        }

        user.name = name || user.name;
        user.avatar = avatar || user.avatar;

        await user.save();
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Lỗi máy chủ' });
    }
};


exports.getUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Lỗi máy chủ' });
    }
};


exports.createUser = async (req, res) => {

    const { name, email } = req.body; // Cần thêm password và mã hóa nếu muốn dùng
    if (!name || !email) return res.status(400).json({ message: 'Name and email required' });
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email exists' });
    const newUser = await User.create({ name, email });
    res.status(201).json(newUser);
};


exports.updateUser = async (req, res) => {

    const { id } = req.params;
    const updates = req.body;
    const user = await User.findByIdAndUpdate(id, updates, { new: true });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
};


exports.deleteUser = async (req, res) => {

    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted" });
};


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});


exports.updateAvatar = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Vui lòng chọn một file ảnh.' });
        }


        const b64 = Buffer.from(req.file.buffer).toString("base64");
        let dataURI = "data:" + req.file.mimetype + ";base64," + b64;

        const result = await cloudinary.uploader.upload(dataURI, {
            folder: "avatars", // Tạo một thư mục tên là 'avatars' trên Cloudinary
            resource_type: "image",
        });

        const user = await User.findByIdAndUpdate(req.user.id, { avatar: result.secure_url }, { new: true });

        res.status(200).json({
            message: 'Upload avatar thành công!',
            avatarUrl: user.avatar,
        });
    } catch (err) {
        console.error("Lỗi upload avatar:", err);
        res.status(500).json({ message: 'Lỗi máy chủ' });
    }
};