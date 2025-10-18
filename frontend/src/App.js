// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;



import React from "react";
import AddUser from "./components/AddUser";
import UserList from "./components/UserList";

function App() {
  return (
    <div
      style={{
        padding: "40px",
        fontFamily: "Segoe UI, sans-serif",
        background: "#f8fafc",
        minHeight: "100vh",
      }}
    >
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
        <AddUser />

        <hr style={{ margin: "30px 0" }} />

        {/* 👥 Danh sách người dùng */}
        <UserList />
      </div>
    </div>
  );
}

export default App;