const jwt = require('jsonwebtoken');
const { ErrorResponse } = require('./errorHandler');
const Token = require('../models/tokenModel');

const authMiddleware = async (req, res, next) => {
  // Extract JWT from Authorization header
  const token = req.header('Authorization')?.split(' ')[1];

  if (!token) {
    return next(new ErrorResponse('Access denied. Authentication required', 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if token is blacklisted
    const isBlacklisted = await Token.exists({ token, blacklisted: true });

    if (isBlacklisted) {
      return next(new ErrorResponse('Token blacklisted', 401));
    }
    
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return next(new ErrorResponse('Invalid token', 401));
    }

    if (error.name === 'TokenExpiredError') {
      return next(new ErrorResponse('Token expired', 401));
    }
    
    return next(new ErrorResponse('Authentication failed', 401));
  }
};

module.exports = authMiddleware;