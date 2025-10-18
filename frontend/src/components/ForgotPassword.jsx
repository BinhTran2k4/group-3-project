// frontend/src/components/ForgotPassword.jsx
import React, { useState } from 'react';
import axios from 'axios';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('Đang xử lý...');
        try {
            const res = await axios.post('http://localhost:3000/api/auth/forgot-password', { email });
            setMessage(res.data.message);
        } catch (err) {
            setMessage(err.response?.data?.message || 'Có lỗi xảy ra.');
        }
    };

    return (
        <div>
            <h2>Quên Mật khẩu</h2>
            <p>Nhập email của bạn để nhận hướng dẫn đặt lại mật khẩu.</p>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Nhập email của bạn"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <button type="submit">Gửi yêu cầu</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default ForgotPassword;