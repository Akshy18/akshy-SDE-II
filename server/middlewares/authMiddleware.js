const jwt = require('jsonwebtoken');
const { ErrorResponse } = require('./errorHandler');
const Token = require('../models/tokenModel');

const authMiddleware = async  (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];

  if (!token) {
    return next(new ErrorResponse('Access denied. Authentication required', 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const isBlacklisted = await Token.exists({
      token: token,
      blacklisted: true
    });

    if (isBlacklisted) {
      return next(new ErrorResponse('blacklisted', 401));
    }
    req.user = decoded;
    next();
  } catch (error) {
  
    if (error.name === 'JsonWebTokenError') {
      return next(new ErrorResponse('Invalid authentication token', 401));
  }

  if (error.name === 'TokenExpiredError') {
      return next(new ErrorResponse('RefreshToken expired', 401));
   }
     
    // Handle any other unexpected errors
    return next(new ErrorResponse('Authentication failed', 401));
  }
};

module.exports = authMiddleware;
