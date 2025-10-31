// backend/middleware/isAdmin.js

const isAdmin = (req, res, next) => {
    // Middleware này phải được dùng SAU middleware `auth`

    if (req.user && req.user.role === 'admin') {
        // Nếu đúng là admin, cho phép đi tiếp
        next();
    } else {
        // Nếu không phải admin, trả về lỗi 403 Forbidden
        return res.status(403).json({ message: 'Truy cập bị từ chối. Yêu cầu quyền Admin.' });
    }
};

module.exports = isAdmin;