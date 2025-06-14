require('dotenv').config();

const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
app.use(express.json());

// CORS for frontend origins
app.use(cors({
  origin: [
    'http://127.0.0.1:5502',
    'http://127.0.0.1:5503',
    'https://whopainted.com',
  ],
  credentials: true
}));

// PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Supabase server-side client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Middleware: Validate token and attach user
const authenticateUser = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'No token provided.' });

  const token = authHeader.split(' ')[1];
  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) return res.status(401).json({ message: 'Invalid token.' });

  req.user = user;
  next();
};

// Routes

app.get('/', (req, res) => {
  res.send('🎨 Art Guessing Backend is live!');
});

// Sign up
app.post('/signup', async (req, res) => {
  const { email, password, username } = req.body;
  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) return res.status(400).json({ message: error.message });

  if (username && data.user) {
    await supabase.from('users').insert([{ user_id: data.user.id, username }]);
  }

  res.status(200).json({ message: 'Signup successful. Confirm email to continue.' });
});

// Login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) return res.status(401).json({ message: error.message });

  res.status(200).json({ session: data.session });
});

app.get('/profile', authenticateUser, async (req, res) => {
  res.status(200).json({ user: req.user });
});


// Save score
app.post('/scores', authenticateUser, async (req, res) => {
  const { score, movement } = req.body;
  const userId = req.user.id;

  if (!score || !movement) return res.status(400).json({ message: 'Missing data.' });

  try {
    const { data: existing, error } = await supabase
      .from('scores')
      .select('*')
      .eq('user_id', userId)
      .eq('movement', movement)
      .maybeSingle();

    if (existing) {
      return res.status(200).json({ message: 'Score already exists for this movement.' });
    }

    await supabase.from('scores').insert([{ user_id: userId, score, movement }]);
    res.status(201).json({ message: 'Score saved.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error saving score.' });
  }
});

// Get scores
app.get('/scores', authenticateUser, async (req, res) => {
  const userId = req.user.id;
  const { data, error } = await supabase
    .from('scores')
    .select('*')
    .eq('user_id', userId);

  if (error) return res.status(500).json({ message: error.message });

  res.status(200).json({ scores: data });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
