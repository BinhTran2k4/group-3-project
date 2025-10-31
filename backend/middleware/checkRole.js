// backend/middleware/checkRole.js

/**
 * Middleware để kiểm tra xem người dùng có một trong các vai trò được phép hay không.
 * @param {string[]} roles - Mảng các vai trò được phép (ví dụ: ['admin', 'moderator']).
 */
const checkRole = (roles) => (req, res, next) => {
    // Middleware này phải được dùng SAU middleware `auth`
    console.log(`Kiểm tra vai trò. Yêu cầu: [${roles.join(', ')}]. User có: ${req.user.role}`);

    if (req.user && roles.includes(req.user.role)) {
        // Nếu vai trò của user nằm trong danh sách được phép, cho đi tiếp
        next();
    } else {
        return res.status(403).json({ message: 'Truy cập bị từ chối. Bạn không có quyền thực hiện hành động này.' });
    }
};

module.exports = checkRole;