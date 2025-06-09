const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const movieRoutes = require('./routes/movies');
const authRoutes = require('./routes/auth');
const authMiddleware = require('./middleware/auth'); // Import your JWT middleware

dotenv.config();
const app = express();

// CORS configuration - must come BEFORE routes
const corsOptions = {
  origin: process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000'
    : process.env.FRONTEND_URL || 'https://movie-explorer-client-iota.vercel.app', // Update FRONTEND_URL in .env for production
  credentials: true, // Allow cookies/auth headers if needed
};
app.use(cors({
  origin: ['http://localhost:3000', 'https://movie-explorer-client-iota.vercel.app'],
  methods: ['GET', 'POST', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

// Parse JSON bodies
app.use(express.json());

// MongoDB connection with retry logic
const connectWithRetry = async (retries = 3, delay = 2000) => {
  for (let i = 0; i < retries; i++) {
    try {
      await mongoose.connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds
        useNewUrlParser: true,
        useUnifiedTopology: true, // Ensure compatibility
      });
      console.log('MongoDB connected');
      return;
    } catch (err) {
      console.error(`MongoDB connection attempt ${i + 1} failed:`, err.message);
      if (i === retries - 1) throw err;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};

connectWithRetry().catch(err => {
  console.error('Failed to connect to MongoDB after retries:', err);
  process.exit(1); // Exit if all retries fail
});

// Event listener for connection state changes
mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected. Attempting to reconnect...');
  connectWithRetry(); // Attempt to reconnect on disconnection
});

// Routes

app.use('/api/auth', authRoutes);

app.use('/api', require('./routes/favoritesRoutes')); // Import favorites routes

// Apply authentication middleware to protected routes
app.use('/api/movies', movieRoutes); // Example: Protect all movie routes

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', {
    message: err.message,
    stack: err.stack,
  });
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
const PORT = process.env.PORT || 5001;
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
} else {
  // For production (e.g., Vercel), export app for serverless
  module.exports = app;
}