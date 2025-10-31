// frontend/src/components/ProtectedRoute.jsx
import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
    // Lấy trạng thái `isAuthenticated` từ Redux store
    const { isAuthenticated } = useSelector((state) => state.auth);
    
    // Nếu đã xác thực, cho phép hiển thị các component con (`<Outlet />`)
    // Nếu không, chuyển hướng về trang đăng nhập
    return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;