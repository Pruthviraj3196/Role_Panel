const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Authentication Middleware
const authenticate = async (req, res, next) => {
  // Check if Authorization header exists
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: Token missing' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token
    req.user = await User.findById(decoded.id); // Find user by decoded ID

    if (!req.user) {
      return res.status(404).json({ message: 'User not found' });
    }

    next(); // Proceed to the next middleware/route handler
  } catch (err) {
    // Handle error for invalid token or any other errors
    console.error('Authentication error:', err); // Optional logging
    res.status(401).json({ message: 'Invalid token', error: err.message });
  }
};

// Authorization Middleware (Role-based access control)
const authorizeRoles = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Forbidden: Insufficient role permissions' });
  }
  next(); // Proceed to the next middleware/route handler
};

module.exports = { authenticate, authorizeRoles };
