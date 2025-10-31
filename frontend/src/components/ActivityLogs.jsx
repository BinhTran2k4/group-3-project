// frontend/src/components/ActivityLogs.jsx

import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';

const ActivityLogs = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                // Gọi đến API mà SV1 đã tạo
                const res = await axiosInstance.get('/users/logs');
                setLogs(res.data);
            } catch (err) {
                alert(err.response?.data?.message || 'Không thể tải nhật ký hoạt động.');
            } finally {
                setLoading(false);
            }
        };
        fetchLogs();
    }, []);

    if (loading) return <div>Đang tải nhật ký...</div>;

    return (
        <div>
            <h2>Nhật ký hoạt động người dùng</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ borderBottom: '2px solid #ddd' }}>
                        <th style={{ textAlign: 'left', padding: '8px' }}>Thời gian</th>
                        <th style={{ textAlign: 'left', padding: '8px' }}>Người dùng</th>
                        <th style={{ textAlign: 'left', padding: '8px' }}>Hành động</th>
                        <th style={{ textAlign: 'left', padding: '8px' }}>Chi tiết</th>
                    </tr>
                </thead>
                <tbody>
                    {logs.map(log => (
                        <tr key={log._id} style={{ borderBottom: '1px solid #ddd' }}>
                            <td style={{ padding: '8px' }}>{new Date(log.timestamp).toLocaleString('vi-VN')}</td>
                            <td style={{ padding: '8px' }}>{log.user ? `${log.user.name} (${log.user.email})` : 'Không rõ'}</td>
                            <td style={{ padding: '8px' }}>{log.action}</td>
                            <td style={{ padding: '8px' }}>{log.details || 'N/A'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ActivityLogs;