import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const { email, password } = formData;
    const navigate = useNavigate();

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:3000/api/auth/login', formData);
            
            // Lưu các thông tin xác thực vào localStorage
            localStorage.setItem('accessToken', res.data.accessToken);
            localStorage.setItem('refreshToken', res.data.refreshToken);
            localStorage.setItem('user', JSON.stringify(res.data.user));

            alert('Đăng nhập thành công!');
            
            // Dùng window.location.href để buộc tải lại toàn bộ trang,
            // giúp Navbar và các component khác đọc lại dữ liệu mới từ localStorage.
            window.location.href = '/profile';
            
        } catch (err) {
            console.error("CHI TIẾT LỖI:", err);
            const errorMessage = err.response?.data?.message ?? "Có lỗi xảy ra, vui lòng thử lại.";
            alert(`Đăng nhập thất bại: ${errorMessage}`);
        }
    };

    return (
        <form onSubmit={onSubmit}>
            <h2>Đăng Nhập</h2>
            <input type="email" name="email" value={email} onChange={onChange} placeholder="Email" required />
            <input type="password" name="password" value={password} onChange={onChange} placeholder="Mật khẩu" required />
            <button type="submit">Đăng Nhập</button>
            <div style={{ marginTop: '15px', textAlign: 'center' }}>
                <Link to="/forgot-password">Quên mật khẩu?</Link>
            </div>
        </form>
    );
};

export default Login;