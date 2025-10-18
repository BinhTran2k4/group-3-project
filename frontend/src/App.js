// frontend/src/App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import AddUser from "./components/AddUser";
import UserList from "./components/UserList";
import Login from "./components/Login";
import Signup from "./components/Signup";

function App() {
  return (
    <Router>
      {/* Thanh điều hướng luôn hiển thị */}
      <Navbar />

      <div
        style={{
          padding: "40px",
          fontFamily: "Segoe UI, sans-serif",
          background: "#f8fafc",
          minHeight: "100vh",
        }}
      >
        <Routes>
          {/* Trang chính: Quản lý người dùng */}
          <Route
            path="/"
            element={
              <div>
                <h1
                  style={{
                    textAlign: "center",
                    color: "#028241",
                    marginBottom: "40px",
                    fontSize: "2.5rem",
                    fontWeight: "bold",
                  }}
                >
                  🌿 Quản lý người dùng
                </h1>

                <div
                  style={{
                    maxWidth: "800px",
                    margin: "0 auto",
                    background: "white",
                    borderRadius: "16px",
                    padding: "30px",
                    boxShadow: "0 6px 15px rgba(0,0,0,0.1)",
                  }}
                >
                  {/* 🧩 Form thêm người dùng */}
                  {/* <AddUser /> */}

                  <hr style={{ margin: "30px 0" }} />

                  {/* 👥 Danh sách người dùng */}
                  {/* <UserList /> */}
                </div>
              </div>
            }
          />

          {/* Trang đăng nhập */}
          <Route path="/login" element={<Login />} />

          {/* Trang đăng ký */}
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
