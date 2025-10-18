const express = require('express');
const app = express();
app.use(express.json());

// Import route
const userRoutes = require('./routes/user');

// Sử dụng route có tiền tố /api
app.use('/api', userRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));