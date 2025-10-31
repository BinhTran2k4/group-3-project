// frontend/src/api/axiosInstance.js
import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:3000/api', // URL backend của bạn
});

// Interceptor để thêm Access Token vào header mỗi request
axiosInstance.interceptors.request.use(config => {
    const token = localStorage.getItem('accessToken');
    if (token) {
        config.headers['x-auth-token'] = token;
    }
    return config;
}, error => Promise.reject(error));

// Interceptor để xử lý khi Access Token hết hạn (lỗi 401)
axiosInstance.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const refreshToken = localStorage.getItem('refreshToken');
                const res = await axios.post('http://localhost:3000/api/auth/refresh', { token: refreshToken });
                const { accessToken } = res.data;
                localStorage.setItem('accessToken', accessToken);
                axiosInstance.defaults.headers.common['x-auth-token'] = accessToken;
                originalRequest.headers['x-auth-token'] = accessToken;
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                // Xử lý khi refresh token cũng thất bại (hết hạn, không hợp lệ)
                // -> Đăng xuất người dùng
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                localStorage.removeItem('user');
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;