const express = require('express');
const cors = require('cors');
const { initializeDb } = require('./db');

const studentRoutes = require('./routes/students');
const semesterRoutes = require('./routes/semesters');
const attendanceRoutes = require('./routes/attendance');
const quizzesRoutes = require('./routes/quizzes');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/students/:studentId/semesters', semesterRoutes);
app.use('/api/students/:studentId/attendance', attendanceRoutes);
app.use('/api/students/:studentId/quizzes', quizzesRoutes);

// Initialize DB and start server
initializeDb().then(() => {
  console.log('Database initialized successfully.');
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Failed to initialize database:', err);
});
