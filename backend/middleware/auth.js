const jwt = require('jsonwebtoken');

const protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies?.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Try DB first, fall back to in-memory store via the controller's findMemById
    let user = null;
    try {
      const User = require('../models/User');
      user = await User.findById(decoded.id).select('-password');
    } catch (_) {
      // DB not available — build a minimal user object from the token payload
      // The real user data is carried in the token's id; controllers will look it up
      user = { _id: decoded.id, id: decoded.id };
    }

    if (!user) {
      return res.status(401).json({ success: false, message: 'Token invalid or user not found.' });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ success: false, message: 'Invalid token.' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Token expired.' });
    }
    next(error);
  }
};

module.exports = { protect };
