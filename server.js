require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Database (in-memory for demo, replace with real DB in production)
let database = {
  votes: {
    stickers: 0,
    gifts: 0,
    none: 0,
    totalVoters: 0
  },
  voters: {} // key: voterId, value: true
};

// API Routes
app.get('/api/votes', (req, res) => {
  res.json({
    votes: database.votes,
    voters: Object.keys(database.voters).length
  });
});

app.post('/api/vote', (req, res) => {
  const { option, voterId } = req.body;
  
  // Validate input
  if (!['1', '2', '3'].includes(option)) {
    return res.status(400).json({ error: 'Invalid vote option' });
  }

  // Check if user already voted
  if (database.voters[voterId]) {
    return res.status(400).json({ error: 'You have already voted' });
  }

  // Record vote
  switch(option) {
    case '1': database.votes.stickers++; break;
    case '2': database.votes.gifts++; break;
    case '3': database.votes.none++; break;
  }

  // Mark user as voted
  database.voters[voterId] = true;
  database.votes.totalVoters = Object.keys(database.voters).length;

  // Set cookie to prevent duplicate voting
  res.cookie('voterToken', voterId, { 
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  });

  res.json({ 
    success: true, 
    votes: database.votes
  });
});

// Serve frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
