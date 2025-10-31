// frontend/src/components/Navbar.jsx

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/authSlice';
import axiosInstance from '../api/axiosInstance'; 

const Navbar = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch(); 
    

    const { isAuthenticated, user } = useSelector((state) => state.auth);

    const handleLogout = async () => {
        const refreshToken = localStorage.getItem('refreshToken'); 
        try {
            if (refreshToken) {
                await axiosInstance.post('/auth/logout', { token: refreshToken });
            }
        } catch (error) {
            console.error('Lỗi khi gọi API logout:', error);
        } finally {

            dispatch(logout()); 

            navigate('/login');
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

                {isAuthenticated && user ? (
                    <>
                        <span style={{ color: '#ddd' }}>Chào, {user.name}</span>
                        <Link to="/profile" style={{ color: 'white', textDecoration: 'none' }}>Hồ sơ</Link>
                        
                        {['admin', 'moderator'].includes(user.role) && (
                            <Link to="/admin" style={{ color: 'yellow', textDecoration: 'none' }}>
                                Quản lý Users
                            </Link>
                        )}
                        
                        {user.role === 'admin' && (
                             <Link to="/admin/logs" style={{ color: 'cyan', textDecoration: 'none' }}>
                                Nhật ký
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