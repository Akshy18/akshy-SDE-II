const mongoose = require('mongoose');

// Connect to MongoDB database
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: "assignment",
    });
    console.log(`MongoDB Connected to database: assignment`);
  } catch (err) {
    // Log connection error for debugging
    console.error('MongoDB connection error:', err);
  }
};

module.exports = connectDB;