// frontend/src/components/ForgotPassword.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance'; 

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('Đang xử lý...');
        try {
            const res = await axiosInstance.post('/auth/forgot-password', { email });
            setMessage(res.data.message);
        } catch (err) {
            setMessage(err.response?.data?.message || 'Có lỗi xảy ra.');
        } finally {
            setLoading(false);
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
                <button type="submit" disabled={loading}>
                    {loading ? 'Đang gửi...' : 'Gửi yêu cầu'}
                </button>
            </form>
            {message && <p>{message}</p>}
            <div style={{ marginTop: '20px' }}>
                <Link to="/login">Quay lại trang Đăng nhập</Link>
            </div>
        </div>
    );
};

export default ForgotPassword;