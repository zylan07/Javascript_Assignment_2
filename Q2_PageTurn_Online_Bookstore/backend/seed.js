// Run: npm run seed   -> resets the books collection with sample books
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Book = require('./models/Book');
const data = require('./seedData');

(async () => {
  await connectDB();
  await Book.deleteMany({});
  await Book.insertMany(data);
  console.log(`Seeded ${data.length} books`);
  await mongoose.disconnect();
  process.exit(0);
})();
