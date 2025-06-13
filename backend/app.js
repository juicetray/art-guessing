require('dotenv').config(); // Load .env

const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
app.use(express.json());

// CORS configuration
app.use(cors({
  origin: [
    'http://127.0.0.1:5502', // Local dev
    'https://whopainted.com/' // GitHub Pages
  ],
  credentials: true
}));

// PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // Use service role key for server-side verification
);

// Middleware to protect routes using Supabase Auth
const authenticateUser = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'No token provided.' });

  const token = authHeader.split(' ')[1];
  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) {
      return res.status(401).json({ message: 'Invalid token.' });
    }
    req.user = user;
    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
};

// Example protected route
app.get('/profile', authenticateUser, async (req, res) => {
  res.json({ user: req.user });
});

// Add additional routes below (e.g. score submission, leaderboard)
app.post('/scores', authenticateUser, async (req, res) => {
  const { score } = req.body;
  const userId = req.user.id; // Supabase UUID

  if (!score) {
    return res.status(400).json({ message: 'Score is required.' });
  }

  try {
    await pool.query(
      'INSERT INTO scores (user_id, score) VALUES ($1, $2)',
      [userId, score]
    );
    res.status(201).json({ message: 'Score submitted successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// Server start
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
