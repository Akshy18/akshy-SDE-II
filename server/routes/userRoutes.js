const express = require('express');
const {
  register,
  getCurrentUser,
  login,
  protected,
  refreshAccessToken,
  logout
} = require('../controllers/userController');
const authMiddleware = require("../middlewares/authMiddleware");
const userRoute = express.Router();

// Authentication routes
userRoute.post('/register', register); // User registration
userRoute.post('/login', login); // User login
userRoute.post('/logout', logout); // User logout with token invalidation
userRoute.post('/refresh-token', refreshAccessToken); // Refresh access token

// Protected routes (require valid JWT)
userRoute.get('/getCurrentUser/:id', getCurrentUser); // Get current user data
userRoute.get('/protected', authMiddleware, protected); // Test protected route

module.exports = userRoute;