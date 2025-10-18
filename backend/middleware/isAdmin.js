// backend/middleware/isAdmin.js
module.exports = function(req, res, next) {
    // req.user được tạo từ middleware 'auth' trước đó
    if (req.user && req.user.role === 'admin') {
        next(); // Nếu là admin, cho phép đi tiếp
    } else {
        // Nếu không phải admin, trả về lỗi 403 Forbidden
        res.status(403).json({ message: 'Truy cập bị từ chối. Yêu cầu quyền Admin.' });
    }
};