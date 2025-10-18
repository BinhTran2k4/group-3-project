// frontend/src/components/Profile.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem('token');
            
            if (!token) {
                alert('Vui lòng đăng nhập để truy cập trang này.');
                navigate('/login');
                return;
            }

            try {
                const res = await axios.get('http://localhost:3000/api/users/profile', {
                    headers: { 'x-auth-token': token }
                });
                setUser(res.data);
                setName(res.data.name);
            } catch (err) {
                console.error('Lỗi lấy profile:', err);
                setError('Không thể tải thông tin. Vui lòng đăng nhập lại.');
                localStorage.removeItem('token');
                localStorage.removeItem('userRole');
                navigate('/login');
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [navigate]);

    // Hàm xử lý cập nhật tên
    const handleNameUpdate = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            const res = await axios.put('http://localhost:3000/api/users/profile', { name }, {
                headers: { 'x-auth-token': token }
            });
            setUser(res.data);
            alert('Cập nhật tên thành công!');
        } catch (err) {
            console.error('Lỗi cập nhật tên:', err);
            alert('Cập nhật tên thất bại.');
        }
    };

    // Hàm xử lý upload avatar
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
            const token = localStorage.getItem('token');
            const res = await axios.put('http://localhost:3000/api/users/profile/avatar', formData, {
                headers: {
                    'x-auth-token': token,
                    'Content-Type': 'multipart/form-data',
                },
            });
            alert(res.data.message);
            // Cập nhật lại state user để hiển thị avatar mới
            setUser(prevUser => ({ ...prevUser, avatar: res.data.avatarUrl }));
        } catch (err) {
            alert(err.response?.data?.message || 'Upload thất bại.');
        } finally {
            setUploading(false);
            setFile(null); // Reset file input
        }
    };


    if (loading) return <div>Đang tải...</div>;
    if (error) return <div style={{ color: 'red' }}>{error}</div>;
    if (!user) return <div>Không có thông tin người dùng.</div>;

    return (
        <div>
            <h2>Trang cá nhân</h2>
            
            {/* Phần hiển thị và upload avatar */}
            <div style={{ marginBottom: '20px', textAlign: 'center' }}>
                <img 
                    src={user.avatar} 
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

            {/* Phần thông tin và cập nhật tên */}
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