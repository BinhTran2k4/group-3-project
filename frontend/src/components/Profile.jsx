// frontend/src/components/Profile.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';

const Profile = () => {
    const initialUser = JSON.parse(localStorage.getItem('user'));
    
    const [user, setUser] = useState(initialUser);
    const [name, setName] = useState(initialUser?.name || '');
    const [loading, setLoading] = useState(!initialUser); 
    const [error, setError] = useState('');
    
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        if (!initialUser) {
            alert('Vui lòng đăng nhập để truy cập trang này.');
            navigate('/login');
            return;
        }

        const fetchProfile = async () => {
            try {
                const res = await axiosInstance.get('/users/profile');
                setUser(res.data);
                setName(res.data.name);
                localStorage.setItem('user', JSON.stringify(res.data));
            } catch (err) {
                console.error('Lỗi lấy profile:', err);
                setError('Không thể tải thông tin mới nhất.');
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [navigate, initialUser]);

    const handleNameUpdate = async (e) => {
        e.preventDefault();
        try {
            const res = await axiosInstance.put('/users/profile', { name });
            const updatedUser = { ...user, name: res.data.name };
            setUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));
            alert('Cập nhật tên thành công!');
        } catch (err) {
            console.error('Lỗi cập nhật tên:', err);
            alert('Cập nhật tên thất bại.');
        }
    };

    const handleAvatarUpload = async (e) => {
        e.preventDefault();
        if (!file) {
            alert('Vui lòng chọn một file ảnh!');
            return;
        }
        setUploading(true);

        const formData = new FormData();
        formData.append('avatar', file);

        try {
            const res = await axiosInstance.post('/users/avatar', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            alert('Upload avatar thành công!');
            
            const updatedUser = { ...user, avatar: res.data.avatar };
            setUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));
            
        } catch (err) {
            alert(err.response?.data?.message || 'Upload thất bại.');
        } finally {
            setUploading(false);
            setFile(null);
        }
    };

    if (loading) return <div>Đang tải...</div>;
    if (error) return <div style={{ color: 'red' }}>{error}</div>;
    if (!user) return <div>Không có thông tin người dùng. Vui lòng đăng nhập.</div>;

    return (
        <div>
            <h2>Trang cá nhân</h2>
            
            <div style={{ marginBottom: '20px', textAlign: 'center' }}>
                {/* Hiển thị ảnh placeholder nếu avatar là 'no-photo.jpg' */}
                <img 
                    src={user.avatar === 'no-photo.jpg' ? `https://ui-avatars.com/api/?name=${user.name}&background=random` : user.avatar} 
                    alt="Avatar" 
                    width="150" 
                    height="150"
                    style={{ borderRadius: '50%', objectFit: 'cover', border: '2px solid #ddd' }} 
                />
                <form onSubmit={handleAvatarUpload} style={{ marginTop: '10px' }}>
                    <label>Thay đổi ảnh đại diện:</label>
                    <input type="file" onChange={(e) => setFile(e.target.files[0])} accept="image/*" />
                    <button type="submit" disabled={uploading}>
                        {uploading ? 'Đang tải lên...' : 'Tải lên'}
                    </button>
                </form>
            </div>
            
            <hr />

            <p><strong>Email:</strong> {user.email}</p>
            <form onSubmit={handleNameUpdate}>
                <label><strong>Tên:</strong></label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} required />
                <button type="submit">Cập nhật tên</button>
            </form>
        </div>
    );
};

export default Profile;