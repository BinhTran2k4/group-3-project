
const express = require('express');
const cors = require('cors');
require('dotenv').config(); 

const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');


const app = express();


app.use(cors()); 
app.use(express.json()); 


connectDB();

app.use('/api/auth', authRoutes);

app.use('/api/users', userRoutes);


// --- Khởi động Server ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server đang chạy trên cổng ${PORT}`));
