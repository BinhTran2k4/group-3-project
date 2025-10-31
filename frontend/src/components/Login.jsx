// frontend/src/components/Login.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../redux/authSlice'; 

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const navigate = useNavigate();
    const dispatch = useDispatch(); 
    
    const { status, error, isAuthenticated } = useSelector((state) => state.auth);

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = (e) => {
        e.preventDefault();
        dispatch(loginUser(formData));
    };

    useEffect(() => {
        if (isAuthenticated) {
            // Không cần reload, chỉ cần điều hướng
            navigate('/profile'); 
        }
    }, [isAuthenticated, navigate]);

    return (
        <form onSubmit={onSubmit}>
            <h2>Đăng Nhập</h2>
            <input type="email" name="email" value={formData.email} onChange={onChange} placeholder="Email" required />
            <input type_password="password" name="password" value={formData.password} onChange={onChange} placeholder="Mật khẩu" required />
            
            {/*  Hiển thị lỗi từ Redux state */}
            {status === 'failed' && <p style={{ color: 'red' }}>{error}</p>}
            
            <button type="submit" disabled={status === 'loading'}>
                {status === 'loading' ? 'Đang đăng nhập...' : 'Đăng Nhập'}
            </button>
            <div style={{ marginTop: '15px', textAlign: 'center' }}>
                <Link to="/forgot-password">Quên mật khẩu?</Link>
            </div>
        </form>
    );
};

export default Login;