// frontend/src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        // (Trong tương lai có thể thêm các reducer khác ở đây, ví dụ: post: postReducer)
    },
});