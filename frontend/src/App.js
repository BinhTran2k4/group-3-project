// frontend/src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Signup from './components/Signup';
import Profile from './components/Profile';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import AdminDashboard from './components/AdminDashboard';
import ActivityLogs from './components/ActivityLogs';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Navbar />
      <div className="container" style={{ padding: '20px' }}>
        <Routes>
          {/* --- CÁC ROUTE CÔNG KHAI --- */}
          {/* Mọi người đều có thể truy cập */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/" element={<h2>Chào mừng đến Trang Chủ</h2>} />

          {/* --- CÁC ROUTE ĐƯỢC BẢO VỆ --- */}
          {/* Chỉ người đã đăng nhập mới truy cập được */}
          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<Profile />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/logs" element={<ActivityLogs />} />
            {/* Nếu còn route nào cần đăng nhập, hãy đặt vào đây */}
          </Route>

          {/* Route cho trang không tìm thấy */}
          <Route path="*" element={<h2>404 - Không tìm thấy trang</h2>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;