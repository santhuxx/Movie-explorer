const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Path to your User model
const jwt = require('jsonwebtoken');
const axios = require('axios');
require('dotenv').config();

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

// Middleware to verify JWT token
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Get user's favorite movies
router.get('/favorites', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Fetch movie details from TMDb for each favorite
    const favorites = await Promise.all(
      user.favorites.map(async (movieId) => {
        const response = await axios.get(
          `${TMDB_BASE_URL}/movie/${movieId}?api_key=${TMDB_API_KEY}`
        );
        return response.data; // Returns full movie object
      })
    );

    res.json({ favorites });
  } catch (err) {
    console.error('Error fetching favorites:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// Add a movie to favorites
router.post('/favorites', authMiddleware, async (req, res) => {
  const { movie } = req.body; // Expect movie ID
  if (!movie || !movie.id) return res.status(400).json({ error: 'Movie ID is required' });

  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Add movie ID if not already in favorites
    if (!user.favorites.includes(movie.id)) {
      user.favorites.push(movie.id);
      await user.save();
    }

    // Fetch updated favorites with TMDb details
    const favorites = await Promise.all(
      user.favorites.map(async (movieId) => {
        const response = await axios.get(
          `${TMDB_BASE_URL}/movie/${movieId}?api_key=${TMDB_API_KEY}`
        );
        return response.data;
      })
    );

    res.json({ favorites });
  } catch (err) {
    console.error('Error adding favorite:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// Clear all favorites
router.delete('/favorites', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.favorites = [];
    await user.save();

    res.json({ favorites: [] });
  } catch (err) {
    console.error('Error clearing favorites:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;