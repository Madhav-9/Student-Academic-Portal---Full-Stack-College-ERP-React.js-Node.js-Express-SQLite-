const express = require('express');
const router = express.Router();
const { dbPromise } = require('../db');

// Get all students (with optional search)
router.get('/', async (req, res) => {
  try {
    const db = await dbPromise;
    const { search } = req.query;
    
    let query = 'SELECT * FROM students';
    const params = [];

    if (search) {
      query += ` WHERE enroll_no LIKE ? OR name LIKE ? OR branch LIKE ? OR CAST(enroll_year AS TEXT) LIKE ?`;
      const searchParam = `%${search}%`;
      params.push(searchParam, searchParam, searchParam, searchParam);
    }
    
    query += ' ORDER BY created_at DESC';
    const students = await db.all(query, params);
    res.json(students);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch students' });
  }
});

// Get a single student by ID
router.get('/:id', async (req, res) => {
  try {
    const db = await dbPromise;
    const student = await db.get('SELECT * FROM students WHERE id = ?', [req.params.id]);
    
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }
    
    const semesters = await db.all('SELECT * FROM semesters WHERE student_id = ? ORDER BY semester_number ASC', [req.params.id]);
    student.semesters = semesters;
    
    const attendance = await db.all('SELECT * FROM attendance WHERE student_id = ? ORDER BY date DESC', [req.params.id]);
    student.attendance = attendance;
    
    const quizzes = await db.all('SELECT * FROM quizzes WHERE student_id = ? ORDER BY date ASC', [req.params.id]);
    student.quizzes = quizzes;
    
    res.json(student);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch student' });
  }
});

// Create a new student
router.post('/', async (req, res) => {
  try {
    const db = await dbPromise;
    const { enroll_no, name, email, mobile_no, father_name, mother_name, enroll_year, branch, address } = req.body;
    
    if (!enroll_no || !name) {
      return res.status(400).json({ error: 'Enrollment number and name are required' });
    }

    const result = await db.run(
      `INSERT INTO students (enroll_no, name, email, mobile_no, father_name, mother_name, enroll_year, branch, address) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [enroll_no, name, email, mobile_no, father_name, mother_name, enroll_year, branch, address]
    );
    
    res.status(201).json({ id: result.lastID, message: 'Student created successfully' });
  } catch (error) {
    console.error(error);
    if (error.code === 'SQLITE_CONSTRAINT') {
      return res.status(400).json({ error: 'Enrollment number must be unique' });
    }
    res.status(500).json({ error: 'Failed to create student' });
  }
});

// Update a student
router.put('/:id', async (req, res) => {
  try {
    const db = await dbPromise;
    const { enroll_no, name, email, mobile_no, father_name, mother_name, enroll_year, branch, address } = req.body;
    
    if (!enroll_no || !name) {
      return res.status(400).json({ error: 'Enrollment number and name are required' });
    }

    const result = await db.run(
      `UPDATE students 
       SET enroll_no = ?, name = ?, email = ?, mobile_no = ?, father_name = ?, mother_name = ?, enroll_year = ?, branch = ?, address = ? 
       WHERE id = ?`,
      [enroll_no, name, email, mobile_no, father_name, mother_name, enroll_year, branch, address, req.params.id]
    );
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }
    
    res.json({ message: 'Student updated successfully' });
  } catch (error) {
    console.error(error);
    if (error.code === 'SQLITE_CONSTRAINT') {
      return res.status(400).json({ error: 'Enrollment number must be unique' });
    }
    res.status(500).json({ error: 'Failed to update student' });
  }
});

// Delete a student
router.delete('/:id', async (req, res) => {
  try {
    const db = await dbPromise;
    const result = await db.run('DELETE FROM students WHERE id = ?', [req.params.id]);
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }
    
    res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete student' });
  }
});

module.exports = router;
