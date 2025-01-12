const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const rateLimiter = require('./config/rateLimiter');
const schoolRoutes = require('./routes/schoolRoutes');
const classroomRoutes = require('./routes/classroomRoutes');
const studentRoutes = require('./routes/studentRoutes');
const authRoutes = require('./routes/authRoutes');

dotenv.config();
connectDB();

// Initialize app
const app = express();

const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(rateLimiter);

// Routes
app.use('/api/schools', schoolRoutes);
app.use('/api/classrooms', classroomRoutes);
app.use('/api/students', studentRoutes);
app.use('/api', authRoutes);


if (process.env.NODE_ENV === "test") {
  module.exports = app;
} else {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}
