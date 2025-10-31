import React, { useState, useEffect } from 'react';
// ✅ 1. Import axiosInstance
import axiosInstance from '../api/axiosInstance';

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchUsers = async () => {
        try {
            // ✅ 2. Dùng axiosInstance, không cần header
            const res = await axiosInstance.get('/users');
            setUsers(res.data);
        } catch (err) {
            alert(err.response?.data?.message || 'Không thể tải danh sách người dùng.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleDelete = async (userId) => {
        if (window.confirm('Bạn có chắc chắn muốn XÓA người dùng này không?')) {
            try {
                // ✅ 3. Dùng axiosInstance để xóa
                await axiosInstance.delete(`/users/${userId}`);
                alert('Xóa thành công!');
                fetchUsers(); // Tải lại danh sách
            } catch (err) {
                alert(err.response?.data?.message || 'Xóa thất bại.');
            }
        }
    };

    const handleResetPassword = async (email) => {
        if (window.confirm(`Bạn có chắc chắn muốn gửi email RESET MẬT KHẨU đến ${email} không?`)) {
            try {
                // ✅ 4. Dùng axiosInstance cho cả các API không cần xác thực để code được nhất quán
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
                    {users.map(user => (
                        <tr key={user._id}>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.role}</td>
                            <td>
                                <button onClick={() => handleDelete(user._id)} style={{marginRight: '5px', backgroundColor: '#dc3545'}}>Xóa</button>
                                <button onClick={() => handleResetPassword(user.email)} style={{backgroundColor: '#ffc107'}}>Reset Mật khẩu</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminDashboard;