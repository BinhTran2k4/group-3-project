// components/Profile.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [name, setName] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                // Xử lý khi không có token (ví dụ: chuyển hướng về trang login)
                return;
            }

            try {
                const res = await axios.get('http://localhost:3000/api/users/profile', {
                    headers: { 'x-auth-token': token } // Gửi token trong header
                });
                setUser(res.data);
                setName(res.data.name);
            } catch (err) {
                console.error('Lỗi lấy profile:', err);
            }
        };
        fetchProfile();
    }, []);

    const onSubmit = async e => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            const res = await axios.put('http://localhost:3000/api/users/profile', { name }, {
                headers: { 'x-auth-token': token }
            });
            setUser(res.data);
            alert('Cập nhật thành công!');
        } catch (err) {
            console.error('Lỗi cập nhật:', err);
        }
    };

    if (!user) return <div>Đang tải...</div>;

    return (
        <div>
            <h2>Trang cá nhân</h2>
            <p><strong>Email:</strong> {user.email}</p>
            <form onSubmit={onSubmit}>
                <label><strong>Tên:</strong></label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} />
                <button type="submit">Cập nhật</button>
            </form>
        </div>
    );
};

export default Profile;