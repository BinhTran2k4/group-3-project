// frontend/src/components/AddUser.jsx
import React, { useState } from "react";
import axios from "axios";

export default function AddUser({ onAdded }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Validation
    if (!name.trim()) {
    //   alert("Name không được để trống");
        alert("Name không được để trống");
        return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
    //   alert("Email không hợp lệ");
        alert("Email không hợp lệ");
        return;
    }

    try {
      await axios.post("http://localhost:3000/api/users", { name, email });
      alert("Thêm người dùng thành công ✅");
      setName("");
      setEmail("");

      // Gọi lại hàm load danh sách người dùng (nếu có)
      if (onAdded) onAdded();
    } catch (err) {
      console.error(err);
      alert("Lỗi khi thêm người dùng ❌");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        margin: "20px auto",
        width: "300px",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
      }}
    >
      <h3>Thêm người dùng</h3>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Tên người dùng"
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <button type="submit">Thêm</button>
    </form>
  );
}
