const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const app = express();

app.use(cors());
app.use(express.json());

connectDB();

const userRoutes = require('./routes/user');

app.use('/api', userRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));