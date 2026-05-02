const mongoose = require('mongoose');

let cached = null;

const connectDB = async () => {
  if (cached && mongoose.connection.readyState === 1) {
    return cached;
  }

  try {
    cached = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
    console.log(`✅ MongoDB Connected: ${mongoose.connection.host}`);
    return cached;
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
    // Don't exit — allow in-memory fallback
  }
};

module.exports = connectDB;
