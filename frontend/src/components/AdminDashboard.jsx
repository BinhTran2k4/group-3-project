// frontend/src/components/AdminDashboard.jsx

import React, { useState, useEffect, useCallback } from 'react';
import axiosInstance from '../api/axiosInstance';

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Lấy thông tin của người dùng đang đăng nhập để kiểm tra quyền
    const currentUserString = localStorage.getItem('user');
    const currentUser = currentUserString ? JSON.parse(currentUserString) : null;

    const fetchUsers = useCallback(async () => {
        try {
            const res = await axiosInstance.get('/users');
            setUsers(res.data);
        } catch (err) {
            alert(err.response?.data?.message || 'Không thể tải danh sách người dùng.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleDelete = async (userId) => {
        if (window.confirm('Bạn có chắc chắn muốn XÓA người dùng này không?')) {
            try {
                await axiosInstance.delete(`/users/${userId}`);
                alert('Xóa thành công!');
                fetchUsers(); // Tải lại danh sách sau khi xóa
            } catch (err) {
                alert(err.response?.data?.message || 'Xóa thất bại.');
            }
        }
    };

    const handleResetPassword = async (email) => {
        if (window.confirm(`Bạn có chắc muốn gửi email RESET MẬT KHẨU đến ${email} không?`)) {
            try {
                const res = await axiosInstance.post('/auth/forgot-password', { email });
                alert(res.data.message);
            } catch (err) {
                alert(err.response?.data?.message || 'Gửi email thất bại.');
            }
        }
    };
    
    if (loading) return <div>Đang tải danh sách người dùng...</div>;

    return (
        <div>
            <h2>Quản lý người dùng</h2>
            <table>
                <thead>
                    <tr>
                        <th>Tên</th>
                        <th>Email</th>
                        <th>Vai trò</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => {
                        const isDeleteDisabled = 
                            (user.role === 'admin' && currentUser?.role === 'moderator') || 
                            (user._id === currentUser?.id);

                        return (
                            <tr key={user._id}>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user.role}</td>
                                <td>
                                    <button 
                                        onClick={() => handleDelete(user._id)} 
                                        style={{ 
                                            marginRight: '5px', 
                                            backgroundColor: isDeleteDisabled ? '#6c757d' : '#dc3545',
                                            cursor: isDeleteDisabled ? 'not-allowed' : 'pointer'
                                        }}
                                        disabled={isDeleteDisabled}
                                    >
                                        Xóa
                                    </button>
                                    <button onClick={() => handleResetPassword(user.email)} style={{backgroundColor: '#ffc107'}}>Reset Mật khẩu</button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default AdminDashboard;