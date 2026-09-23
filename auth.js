const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const { dbPromise } = require('../db');

// Helper to hash passwords simply using built-in crypto
const hashPassword = (password) => {
  return crypto.createHash('sha256').update(password).digest('hex');
};

router.post('/signup', async (req, res) => {
  try {
    const db = await dbPromise;
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const hashed = hashPassword(password);
    
    const result = await db.run(
      'INSERT INTO users (email, password) VALUES (?, ?)',
      [email, hashed]
    );
    
    res.status(201).json({ user: { id: result.lastID, email } });
  } catch (error) {
    console.error(error);
    if (error.code === 'SQLITE_CONSTRAINT') {
      return res.status(400).json({ error: 'Email already exists' });
    }
    res.status(500).json({ error: 'Failed to create user' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const db = await dbPromise;
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const hashed = hashPassword(password);
    
    const user = await db.get(
      'SELECT id, email FROM users WHERE email = ? AND password = ?',
      [email, hashed]
    );
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    
    res.json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Login failed' });
  }
});

module.exports = router;
