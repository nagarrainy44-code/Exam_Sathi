const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: process.env.FRONTEND_URL || 'http://localhost:5173', methods: ['GET', 'POST'] }
});

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/materials', require('./routes/materialRoutes'));
app.use('/api/progress', require('./routes/progressRoutes'));
app.use('/api/quizzes', require('./routes/quizRoutes'));
app.use('/api/exams', require('./routes/examRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));

app.get('/api', (req, res) => {
  res.json({ message: 'Exam Saathi API is running' });
});

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  socket.on('disconnect', () => console.log('User disconnected'));
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
