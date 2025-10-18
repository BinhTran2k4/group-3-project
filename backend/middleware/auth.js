// backend/middleware/auth.js
const jwt = require('jsonwebtoken');

// Biến cho JWT
const JWT_SECRET = "DayLaMotChuoiBiMatSieuDaiVaKhongTheDoanDuoc123!@#";

module.exports = function(req, res, next) {
    const token = req.header('x-auth-token');

    if (!token) {
        return res.status(401).json({ message: 'Không có token, truy cập bị từ chối.' });
    }

    // 2. Xác thực token
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        
        req.user = decoded.user; 
        
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token không hợp lệ.' });
    }
};