//frontend/src/components/Login.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom'; 
import { jwtDecode } from 'jwt-decode';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const { email, password } = formData;
    const navigate = useNavigate();

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:3000/api/auth/login', formData);
            
            const token = res.data.token;
            localStorage.setItem('token', token);

            const decodedUser = jwtDecode(token).user;
            localStorage.setItem('userRole', decodedUser.role);

            alert('Đăng nhập thành công!');
            
            navigate('/profile'); 
            
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