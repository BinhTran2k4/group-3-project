//b6 hd1
// frontend/src/components/Login.jsx

import React, { useState } from 'react';
import axios from 'axios'; // Vẫn có thể dùng axios thường cho login/signup
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const { email, password } = formData;
    const navigate = useNavigate();

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        try {
            // ✅ SỬA ĐỔI: API trả về accessToken, refreshToken, và user
            const res = await axios.post('http://localhost:3000/api/auth/login', formData);
            
            // ✅ SỬA ĐỔI: Lưu đúng tên token
            localStorage.setItem('accessToken', res.data.accessToken);
            localStorage.setItem('refreshToken', res.data.refreshToken);

            // Lưu thông tin user để dễ sử dụng (tên, role, avatar...)
            // Thay vì decode JWT ở frontend, hãy dùng trực tiếp object user trả về từ API
            localStorage.setItem('user', JSON.stringify(res.data.user));

            alert('Đăng nhập thành công!');
            
            // Reload lại trang để Navbar cập nhật trạng thái login
            // Hoặc sử dụng Redux để quản lý state tốt hơn
            window.location.href = '/profile';
            
        } catch (err) {
            console.error("CHI TIẾT LỖI:", err);
            const errorMessage = err.response?.data?.message ?? "Có lỗi xảy ra từ máy chủ. Vui lòng thử lại.";
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