require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const { errorHandler } = require('./middlewares/errorHandler');
const userRouter = require('./routes/userRoutes');
const todoRouter = require('./routes/todoRoutes');


const app = express();

// Middlewares
app.use(cookieParser());
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }, // Important for cross-origin requests
  contentSecurityPolicy: false // Disable CSP for development
}));
app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true,            
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));


app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use('/api/users', userRouter);
app.use('/api/todos', todoRouter);

// Error handling middleware
app.use(errorHandler);

app.use((req, res) => {
    res.status(404).json({ 
      success: false, 
      message: 'Route not found' 
    });
  });

module.exports = app;