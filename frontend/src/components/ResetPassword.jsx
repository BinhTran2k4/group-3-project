// frontend/src/components/ResetPassword.jsx
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance'; 

const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const { token } = useParams();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password.length < 6) {
            return setMessage('Mật khẩu phải có ít nhất 6 ký tự.');
        }
        if (password !== confirmPassword) {
            return setMessage('Mật khẩu không khớp.');
        }
        
        setLoading(true);
        setMessage('Đang cập nhật...');
        try {
            const res = await axiosInstance.put(`/auth/reset-password/${token}`, { password });
            setMessage(res.data.message + ' Bạn sẽ được chuyển về trang đăng nhập sau 3 giây.');
            setTimeout(() => navigate('/login'), 3000);
        } catch (err) {
            setMessage(err.response?.data?.message || 'Có lỗi xảy ra.');
            setLoading(false);
        }
    };

    return (
        <div>
            <h2>Đặt lại Mật khẩu</h2>
            <form onSubmit={handleSubmit}>
                <input 
                    type="password" 
                    placeholder="Mật khẩu mới (ít nhất 6 ký tự)" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                />
                <input 
                    type="password" 
                    placeholder="Xác nhận mật khẩu" 
                    value={confirmPassword} 
                    onChange={(e) => setConfirmPassword(e.target.value)} 
                    required 
                />
                <button type="submit" disabled={loading}>
                    {loading ? 'Đang lưu...' : 'Cập nhật Mật khẩu'}
                </button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default ResetPassword;