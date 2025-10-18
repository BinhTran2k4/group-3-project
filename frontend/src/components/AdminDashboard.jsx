// frontend/src/components/AdminDashboard.jsx
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
            alert(err.response.data.message);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleDelete = async (userId) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`http://localhost:3000/api/users/${userId}`, {
                    headers: { 'x-auth-token': token }
                });
                alert('Xóa thành công!');
                // Tải lại danh sách người dùng
                fetchUsers();
            } catch (err) {
                alert(err.response.data.message);
            }
        }
    };

    return (
        <div>
            <h2>Quản lý người dùng</h2>
            <table>
                <thead>
                    <tr><th>Tên</th><th>Email</th><th>Vai trò</th><th>Hành động</th></tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user._id}>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.role}</td>
                            <td><button onClick={() => handleDelete(user._id)}>Xóa</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminDashboard;