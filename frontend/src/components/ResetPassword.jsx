// frontend/src/components/ResetPassword.jsx
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const { token } = useParams(); // Lấy token từ URL
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setMessage('Mật khẩu không khớp.');
            return;
        }
        try {
            const res = await axios.put(`http://localhost:3000/api/auth/reset-password/${token}`, { password });
            setMessage(res.data.message + ' Bạn sẽ được chuyển về trang đăng nhập sau 3 giây.');
            setTimeout(() => navigate('/login'), 3000);
        } catch (err) {
            setMessage(err.response?.data?.message || 'Có lỗi xảy ra.');
        }
    };

    return (
        <div>
            <h2>Đặt lại Mật khẩu</h2>
            <form onSubmit={handleSubmit}>
                <input type="password" placeholder="Mật khẩu mới" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <input type="password" placeholder="Xác nhận mật khẩu" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                <button type="submit">Cập nhật</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default ResetPassword;