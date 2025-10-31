// frontend/src/components/Navbar.jsx

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance'; // Import axiosInstance để gọi API logout

const Navbar = () => {
    const navigate = useNavigate();

    const isLoggedIn = !!localStorage.getItem('accessToken');

    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null; // Chuyển chuỗi JSON thành object


    const handleLogout = async () => {
        const refreshToken = localStorage.getItem('refreshToken');
        try {
            // Gọi API để server xóa refresh token (tăng cường bảo mật)
            if (refreshToken) {
                await axiosInstance.post('/auth/logout', { token: refreshToken });
            }
        } catch (error) {
            console.error('Lỗi khi gọi API logout:', error);
        } finally {
            // Dù API có lỗi hay không, vẫn xóa thông tin ở client
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');

            alert('Bạn đã đăng xuất thành công!');
            
            // Tải lại trang để đảm bảo mọi state được reset sạch sẽ
            window.location.href = '/login';
        }
    };

    return (
        <nav style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '1rem 2rem',
            backgroundColor: '#333',
            color: 'white'
        }}>
            <Link to="/" style={{ color: 'white', textDecoration: 'none', fontSize: '1.5rem' }}>
                MyApp
            </Link>

            <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                {isLoggedIn && user ? (
                    // Nếu đã đăng nhập và có thông tin user
                    <>
                        {/* Chào mừng người dùng */}
                        <span style={{ color: '#ddd' }}>Chào, {user.name}</span>

                        <Link to="/profile" style={{ color: 'white', textDecoration: 'none' }}>
                            Hồ sơ
                        </Link>

                        {/*  Kiểm tra vai trò từ object user */}
                        {user.role === 'admin' && (
                            <Link to="/admin" style={{ color: 'yellow', textDecoration: 'none' }}>
                                Quản lý Users
                            </Link>
                        )}

                        <button onClick={handleLogout} style={{ cursor: 'pointer' }}>
                            Đăng xuất
                        </button>
                    </>
                ) : (
                    // Nếu chưa đăng nhập
                    <>
                        <Link to="/login" style={{ color: 'white', textDecoration: 'none' }}>
                            Đăng nhập
                        </Link>
                        <Link to="/signup" style={{ color: 'white', textDecoration: 'none' }}>
                            Đăng ký
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;