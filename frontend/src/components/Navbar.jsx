// frontend/src/components/Navbar.jsx

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';

const Navbar = () => {
    const navigate = useNavigate();
    const isLoggedIn = !!localStorage.getItem('accessToken');
    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;

    const handleLogout = async () => {
        const refreshToken = localStorage.getItem('refreshToken');
        try {
            if (refreshToken) {
                await axiosInstance.post('/auth/logout', { token: refreshToken });
            }
        } catch (error) {
            console.error('Lỗi khi gọi API logout:', error);
        } finally {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
            alert('Bạn đã đăng xuất thành công!');
            window.location.href = '/login';
        }
    };

    return (
        <nav style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '1rem 2rem', backgroundColor: '#333', color: 'white'
        }}>
            <Link to="/" style={{ color: 'white', textDecoration: 'none', fontSize: '1.5rem' }}>
                MyApp
            </Link>
            <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                {isLoggedIn && user ? (
                    <>
                        <span style={{ color: '#ddd' }}>Chào, {user.name}</span>
                        <Link to="/profile" style={{ color: 'white', textDecoration: 'none' }}>Hồ sơ</Link>
                        
                        {/* ✅ SỬA ĐIỀU KIỆN: Cả admin và moderator đều thấy link này */}
                        {['admin', 'moderator'].includes(user.role) && (
                            <Link to="/admin" style={{ color: 'yellow', textDecoration: 'none' }}>
                                Quản lý Users
                            </Link>
                        )}

                        <button onClick={handleLogout} style={{ cursor: 'pointer' }}>Đăng xuất</button>
                    </>
                ) : (
                    <>
                        <Link to="/login" style={{ color: 'white', textDecoration: 'none' }}>Đăng nhập</Link>
                        <Link to="/signup" style={{ color: 'white', textDecoration: 'none' }}>Đăng ký</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;