const app = require('./app');
const connectDB = require('./config/db');

// Initialize database connection
connectDB();

// Set server port from environment or default
const PORT = process.env.PORT || 5000;

// Start Express server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});