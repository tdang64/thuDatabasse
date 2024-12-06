const jwt = require('jsonwebtoken');
const User = require('../models/user');

const SECRET_KEY = process.env.SECRET_KEY || 'my_secret_key';

// Middleware to authenticate user (common to both regular users and admins)
const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Expecting 'Bearer <token>'

  if (!token) {
    return res.status(403).json({ message: 'Access denied, no token provided' });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    console.log('Decoded token:', decoded); // Log the decoded payload
  
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
  
    req.user = user;
    next();
  } catch (err) {
    console.error('JWT Verification Error:', err); // Log the error
    res.status(401).json({ message: 'Invalid token or not authorized' });
  }
};

// Middleware to check if the user is an admin
const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admins only.' });
  }
  next();  // Proceed to the next middleware or route handler
};

// Export both middleware functions
module.exports = { authMiddleware, isAdmin };
