// Connects to MongoDB.
// 1st choice : MONGO_URI from .env (local MongoDB or MongoDB Atlas)
// Fallback   : a temporary in-memory MongoDB, so the app still runs on a
//              machine where MongoDB is not installed (data resets on restart).
const mongoose = require('mongoose');

async function connectDB() {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/sathya_enrollease';
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 3000 });
    console.log(`MongoDB connected -> ${uri}`);
  } catch (err) {
    console.warn(`Could not reach MongoDB at ${uri} (${err.message}).`);
    console.warn('Starting a temporary in-memory MongoDB instead (data is NOT saved after restart)...');
    const { MongoMemoryServer } = require('mongodb-memory-server-core');
    const mem = await MongoMemoryServer.create();
    await mongoose.connect(mem.getUri('sathya_enrollease'));
    console.log('In-memory MongoDB connected.');
  }
}

module.exports = connectDB;
