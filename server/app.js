require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const { errorHandler } = require('./middlewares/errorHandler');
const userRouter = require('./routes/userRoutes');
const todoRouter = require('./routes/todoRoutes');

const app = express();

// Security and parsing middlewares
app.use(cookieParser());
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }, // Allow cross-origin resources
  contentSecurityPolicy: false // Disable CSP for simplicity
}));

// CORS configuration for frontend access
app.use(cors({
  origin: 'http://localhost:5173', // Frontend origin
  credentials: true, // Allow credentials/cookies
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allowed methods
  allowedHeaders: ['Content-Type', 'Authorization'] // Allowed headers
}));

// Request body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// API routes
app.use('/api/users', userRouter); // User authentication routes
app.use('/api/todos', todoRouter); // Todo CRUD routes

// Error handling
app.use(errorHandler); // Custom error handler

// 404 route handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'Route not found' 
  });
});

module.exports = app;