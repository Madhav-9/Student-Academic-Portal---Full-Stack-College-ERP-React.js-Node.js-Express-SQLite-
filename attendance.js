const express = require('express');
const router = express.Router({ mergeParams: true });
const { dbPromise } = require('../db');

// Add or update attendance for a specific date
router.post('/', async (req, res) => {
  try {
    const db = await dbPromise;
    const { studentId } = req.params;
    const { date, status, remarks } = req.body;
    
    if (!date || !status) {
      return res.status(400).json({ error: 'Date and status are required' });
    }

    // Upsert logic using SQLite (INSERT OR REPLACE)
    const result = await db.run(
      `INSERT INTO attendance (student_id, date, status, remarks) 
       VALUES (?, ?, ?, ?)
       ON CONFLICT(student_id, date) 
       DO UPDATE SET status = excluded.status, remarks = excluded.remarks`,
      [studentId, date, status, remarks]
    );
    
    res.status(200).json({ message: 'Attendance recorded successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to record attendance' });
  }
});

// Delete an attendance record
router.delete('/:id', async (req, res) => {
  try {
    const db = await dbPromise;
    const { studentId, id } = req.params;
    
    const result = await db.run('DELETE FROM attendance WHERE id = ? AND student_id = ?', [id, studentId]);
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Attendance record not found' });
    }
    
    res.json({ message: 'Attendance record deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete attendance' });
  }
});

module.exports = router;
