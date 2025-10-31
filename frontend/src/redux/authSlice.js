// frontend/src/redux/authSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../api/axiosInstance';

// --- ASYNC THUNK ĐỂ GỌI API LOGIN ---
// createAsyncThunk sẽ tự động xử lý các trạng thái pending, fulfilled, rejected
export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post('/auth/login', credentials);
            // Lưu token và user vào localStorage ngay sau khi đăng nhập thành công
            localStorage.setItem('accessToken', response.data.accessToken);
            localStorage.setItem('refreshToken', response.data.refreshToken);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            return response.data; // Dữ liệu này sẽ được đưa vào action.payload
        } catch (error) {
            // Trả về lỗi để `rejected` case có thể xử lý
            return rejectWithValue(error.response.data);
        }
    }
);

// --- TRẠNG THÁI BAN ĐẦU ---
// Lấy dữ liệu từ localStorage để duy trì trạng thái đăng nhập khi tải lại trang
const initialState = {
    user: JSON.parse(localStorage.getItem('user')) || null,
    accessToken: localStorage.getItem('accessToken') || null,
    isAuthenticated: !!localStorage.getItem('accessToken'),
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
};

// --- TẠO SLICE ---
const authSlice = createSlice({
    name: 'auth',
    initialState,
    // Reducers để xử lý các hành động đồng bộ (synchronous)
    reducers: {
        logout: (state) => {
            // Xóa dữ liệu ở client
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
            // Reset state trong Redux
            state.user = null;
            state.accessToken = null;
            state.isAuthenticated = false;
            state.status = 'idle';
            state.error = null;
        },
    },
    // ExtraReducers để xử lý các hành động bất đồng bộ từ createAsyncThunk
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.isAuthenticated = true;
                state.user = action.payload.user;
                state.accessToken = action.payload.accessToken;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload.message || 'Đăng nhập thất bại';
            });
    },
});

// Export các actions
export const { logout } = authSlice.actions;

// Export reducer
export default authSlice.reducer;