const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { OAuth2Client } = require('google-auth-library');
const router = express.Router();

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Register
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Username, email, and password are required' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    let user = await User.findOne({ $or: [{ username }, { email }] });
    if (user) {
      return res.status(400).json({
        error: user.username === username ? 'Username already exists' : 'Email already exists'
      });
    }

    user = new User({ username, email, password });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, user: { username: user.username, email: user.email, id: user._id } });
  } catch (error) {
    console.error('Registration error:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message).join(', ');
      return res.status(400).json({ error: `Validation failed: ${messages}` });
    }
    res.status(500).json({ error: 'Registration failed. Please try again.' });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ error: 'Invalid username or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid username or password' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, user: { username: user.username, email: user.email, id: user._id } });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed. Please try again.' });
  }
});

// Validate Token
router.get('/validate', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    res.json({ user: { username: user.username, email: user.email, id: user._id } });
  } catch (error) {
    console.error('Token validation error:', error);
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }
    res.status(401).json({ error: 'Invalid token' });
  }
});

// Google Sign-In
router.post('/google', async (req, res) => {
  const { credential } = req.body;
  if (!credential) {
    return res.status(400).json({ error: 'ID token is required' });
  }

  try {
    console.log('Received credential:', credential.substring(0, 20) + '...');
    console.log('Verifying with audience:', process.env.GOOGLE_CLIENT_ID);
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    console.log('Verification successful, payload:', ticket.getPayload());

    const payload = ticket.getPayload();
    const googleId = payload.sub;
    const email = payload.email;
    const name = payload.name;

    // Derive username from email
    const username = email.split('@')[0];

    let user = await User.findOne({ googleId });
    if (!user) {
      user = new User({ googleId, email, name, username });
      await user.save();
    } else if (!user.username) {
      user.username = username;
      await user.save();
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, user: { username: user.username, email: user.email, id: user._id } });
  } catch (error) {
    console.error('Google authentication error details:', {
      message: error.message,
      stack: error.stack,
      credential: credential.substring(0, 20) + '...',
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    res.status(401).json({ error: 'Google authentication failed' });
  }
});

module.exports = router;