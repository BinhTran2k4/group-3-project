// controllers/userController.js

// Mảng tạm người dùng
let users = [
  { id: 1, name: "Nguyen Van A", email: "a@example.com" },
  { id: 2, name: "Tran Thi B", email: "b@example.com" }
];

// GET /users - Lấy danh sách người dùng
exports.getUsers = (req, res) => {
  res.status(200).json(users);
};

// POST /users - Thêm người dùng mới
exports.createUser = (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ message: "Thiếu thông tin name hoặc email" });
  }

  const newUser = {
    id: users.length + 1,
    name,
    email
  };

  users.push(newUser);
  res.status(201).json(newUser);
};
