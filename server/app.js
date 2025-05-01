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
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: false
}));

// CORS configuration - Simplified approach
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL
    : 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Apply CORS globally
app.use(cors(corsOptions));

// Request body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// API routes
app.use('/api/users', userRouter);
app.use('/api/todos', todoRouter);

// Error handling
app.use(errorHandler);

// 404 route handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'Route not found' 
  });
});

module.exports = app;