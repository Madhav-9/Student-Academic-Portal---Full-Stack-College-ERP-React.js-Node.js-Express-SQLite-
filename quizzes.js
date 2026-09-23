const express = require('express');
const router = express.Router({ mergeParams: true });
const { dbPromise } = require('../db');

// Add a new quiz record
router.post('/', async (req, res) => {
  try {
    const db = await dbPromise;
    const { studentId } = req.params;
    const { quiz_name, score, total_marks, date } = req.body;
    
    if (!quiz_name || score === undefined || total_marks === undefined || !date) {
      return res.status(400).json({ error: 'Quiz name, score, total marks, and date are required' });
    }

    const result = await db.run(
      `INSERT INTO quizzes (student_id, quiz_name, score, total_marks, date) 
       VALUES (?, ?, ?, ?, ?)`,
      [studentId, quiz_name, score, total_marks, date]
    );
    
    res.status(201).json({ id: result.lastID, message: 'Quiz performance recorded successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to record quiz performance' });
  }
});

// Update a quiz record
router.put('/:quizId', async (req, res) => {
  try {
    const db = await dbPromise;
    const { studentId, quizId } = req.params;
    const { quiz_name, score, total_marks, date } = req.body;
    
    const result = await db.run(
      `UPDATE quizzes 
       SET quiz_name = ?, score = ?, total_marks = ?, date = ? 
       WHERE id = ? AND student_id = ?`,
      [quiz_name, score, total_marks, date, quizId, studentId]
    );
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Quiz record not found' });
    }
    
    res.json({ message: 'Quiz record updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update quiz record' });
  }
});

// Delete a quiz record
router.delete('/:quizId', async (req, res) => {
  try {
    const db = await dbPromise;
    const { studentId, quizId } = req.params;
    
    const result = await db.run('DELETE FROM quizzes WHERE id = ? AND student_id = ?', [quizId, studentId]);
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Quiz record not found' });
    }
    
    res.json({ message: 'Quiz record deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete quiz record' });
  }
});

module.exports = router;
