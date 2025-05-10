const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const movieRoutes = require('./routes/movies');
const authRoutes = require('./routes/auth');

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
let cachedConnection = null;

async function connectToMongo() {
  if (cachedConnection && cachedConnection.connection.readyState === 1) {
    console.log('Reusing existing MongoDB connection');
    return cachedConnection;
  }

  try {
    cachedConnection = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000,
      connectTimeoutMS: 30000,
    });
    console.log('MongoDB connected');
    return cachedConnection;
  } catch (err) {
    console.error('MongoDB connection error:', err);
    throw err;
  }
}

// Connect to MongoDB before handling requests
app.use(async (req, res, next) => {
  try {
    await connectToMongo();
    next();
  } catch (err) {
    res.status(500).json({ error: 'Database connection failed' });
  }
});

// Routes
app.use('/api/movies', movieRoutes);
app.use('/api/auth', authRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app; // Export for Vercel