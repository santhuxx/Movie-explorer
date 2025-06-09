const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String }, // Made optional for Google users
  googleId: { type: String, unique: true }, // For Google authentication
  email: { type: String, required: true, unique: true }, // Store Google email
  favorites: [{ type: Number }], // Store movie IDs
}, { timestamps: true }); // Optional: Adds createdAt and updatedAt fields

module.exports = mongoose.model('User', userSchema);