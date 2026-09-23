const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const path = require('path');

const dbPromise = open({
  filename: path.join(__dirname, 'app.db'),
  driver: sqlite3.Database
});

async function initializeDb() {
  const db = await dbPromise;
  
  await db.exec(`
    CREATE TABLE IF NOT EXISTS students (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      enroll_no TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      email TEXT,
      mobile_no TEXT,
      father_name TEXT,
      mother_name TEXT,
      enroll_year INTEGER,
      branch TEXT,
      address TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS semesters (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id INTEGER NOT NULL,
      semester_number INTEGER NOT NULL,
      gpa REAL,
      cgpa REAL,
      remarks TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (student_id) REFERENCES students (id) ON DELETE CASCADE,
      UNIQUE(student_id, semester_number)
    );

    CREATE TABLE IF NOT EXISTS attendance (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id INTEGER NOT NULL,
      date TEXT NOT NULL,
      status TEXT NOT NULL, -- 'Present', 'Absent', 'Late'
      remarks TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (student_id) REFERENCES students (id) ON DELETE CASCADE,
      UNIQUE(student_id, date)
    );

    CREATE TABLE IF NOT EXISTS quizzes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id INTEGER NOT NULL,
      quiz_name TEXT NOT NULL,
      score REAL NOT NULL,
      total_marks REAL NOT NULL,
      date TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (student_id) REFERENCES students (id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
  
  return db;
}

module.exports = {
  dbPromise,
  initializeDb
};
