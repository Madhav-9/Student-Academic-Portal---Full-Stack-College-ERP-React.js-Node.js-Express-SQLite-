const express = require('express');
const router = express.Router({ mergeParams: true });
const { dbPromise } = require('../db');

// Create a new semester for a student
router.post('/', async (req, res) => {
  try {
    const db = await dbPromise;
    const { studentId } = req.params;
    const { semester_number, gpa, cgpa, remarks } = req.body;
    
    if (!semester_number) {
      return res.status(400).json({ error: 'Semester number is required' });
    }

    const result = await db.run(
      `INSERT INTO semesters (student_id, semester_number, gpa, cgpa, remarks) 
       VALUES (?, ?, ?, ?, ?)`,
      [studentId, semester_number, gpa, cgpa, remarks]
    );
    
    res.status(201).json({ id: result.lastID, message: 'Semester added successfully' });
  } catch (error) {
    console.error(error);
    if (error.code === 'SQLITE_CONSTRAINT') {
      return res.status(400).json({ error: 'This semester number already exists for this student' });
    }
    res.status(500).json({ error: 'Failed to add semester' });
  }
});

// Update a semester
router.put('/:semId', async (req, res) => {
  try {
    const db = await dbPromise;
    const { studentId, semId } = req.params;
    const { semester_number, gpa, cgpa, remarks } = req.body;
    
    if (!semester_number) {
      return res.status(400).json({ error: 'Semester number is required' });
    }

    const result = await db.run(
      `UPDATE semesters 
       SET semester_number = ?, gpa = ?, cgpa = ?, remarks = ? 
       WHERE id = ? AND student_id = ?`,
      [semester_number, gpa, cgpa, remarks, semId, studentId]
    );
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Semester not found' });
    }
    
    res.json({ message: 'Semester updated successfully' });
  } catch (error) {
    console.error(error);
    if (error.code === 'SQLITE_CONSTRAINT') {
      return res.status(400).json({ error: 'This semester number already exists for this student' });
    }
    res.status(500).json({ error: 'Failed to update semester' });
  }
});

// Delete a semester
router.delete('/:semId', async (req, res) => {
  try {
    const db = await dbPromise;
    const { studentId, semId } = req.params;
    
    const result = await db.run('DELETE FROM semesters WHERE id = ? AND student_id = ?', [semId, studentId]);
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Semester not found' });
    }
    
    res.json({ message: 'Semester deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete semester' });
  }
});

module.exports = router;
