//frontend/src/components/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:3000/api/users', {
                headers: { 'x-auth-token': token }
            });
            setUsers(res.data);
        } catch (err) {
            alert(err.response?.data?.message || 'Không thể tải danh sách người dùng.');
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleDelete = async (userId) => {
        if (window.confirm('Bạn có chắc chắn muốn XÓA người dùng này không?')) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`http://localhost:3000/api/users/${userId}`, {
                    headers: { 'x-auth-token': token }
                });
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

                const res = await axios.post('http://localhost:3000/api/auth/forgot-password', { email });
                alert(res.data.message); // Hiển thị thông báo thành công từ server
            } catch (err) {
                alert(err.response?.data?.message || 'Gửi email thất bại.');
            }
        }
    };

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
                                <button onClick={() => handleDelete(user._id)} style={{marginRight: '5px', backgroundColor: '#8c2982ff'}}>Xóa</button>

                                <button onClick={() => handleResetPassword(user.email)} style={{backgroundColor: '#198837ff'}}>Reset Mật khẩu</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminDashboard;