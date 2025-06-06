const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  // Check if JWT_SECRET is defined
  if (!process.env.JWT_SECRET) {
    console.error('JWT_SECRET is not defined in environment variables');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  const token = req.header('Authorization')?.replace('Bearer ', '');
  console.log('Received Authorization header:', req.header('Authorization'));
  console.log('Extracted token:', token?.substring(0, 20) + '...');

  if (!token) return res.status(401).json({ error: 'Access denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token verified, userId:', decoded.userId);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Token verification error:', {
      message: error.message,
      name: error.name,
      token: token?.substring(0, 20) + '...',
    });
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }
    res.status(401).json({ error: 'Invalid token' });
  }
};