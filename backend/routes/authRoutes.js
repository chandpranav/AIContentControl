const express = require('express');
const router = express.Router();
const pool = require('../db');
const bcrypt = require('bcrypt');

// authRoutes.js
router.post('/signup', async (req, res) => {
  /* always store / compare lowercase */
  const businessEmail = req.body.businessEmail.trim().toLowerCase();
  const { username, password } = req.body;

  try {
    /* extra safety: fast existence check (case-insensitive) */
    const exists = await pool.query(
      'SELECT 1 FROM users WHERE LOWER(business_email) = LOWER($1)',
      [businessEmail]
    );
    if (exists.rows.length) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    const hashed = await bcrypt.hash(password, 10);
    const result = await pool.query(
      `INSERT INTO users (business_email, username, password)
       VALUES ($1, $2, $3)
       RETURNING id, business_email, username`,
      [businessEmail, username, hashed]
    );
    return res.status(201).json({ user: result.rows[0] });

  } catch (err) {
    /* duplicates caught by UNIQUE / INDEX come here with code 23505 */
    if (err.code === '23505') {
      return res.status(409).json({ error: 'Email already registered' });
    }
    console.error('Signup error:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});


router.post('/signin', async (req, res) => {
  const { email, password } = req.body; // from SignInPage.js

  try {
    // 1. Find user by email
    const userQuery = await pool.query(
      'SELECT * FROM users WHERE business_email = $1',
      [email]
    );

    if (userQuery.rows.length === 0) {
      // No user with this email
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = userQuery.rows[0];

    // 2. Compare hashed password with provided password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      // Password doesn’t match
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // 3. If match, authentication successful
    return res.status(200).json({
      message: 'Sign in successful',
      user: {
        id: user.id,
        email: user.business_email,
        username: user.username,
      },
    });
  } catch (error) {
    console.error('SignIn Error:', error.message);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});



  router.put('/change-password', async (req, res) => {
    const { userId, currentPassword, newPassword } = req.body;
  
    if (!userId || !currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
  
    try {
      // Fetch the user from the database
      const userQuery = await pool.query(
        'SELECT * FROM users WHERE id = $1',
        [userId]
      );
      if (userQuery.rows.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      const user = userQuery.rows[0];
      
      // Compare the current password with the stored hash
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(401).json({ error: 'Current password is incorrect' });
      }
      
      // Hash the new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await pool.query(
        'UPDATE users SET password = $1 WHERE id = $2',
        [hashedPassword, userId]
      );
      
      return res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
      console.error("Password Change Error: ", error.message);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
module.exports = router;
