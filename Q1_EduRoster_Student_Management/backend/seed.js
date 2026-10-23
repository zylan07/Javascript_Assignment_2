// Run: npm run seed   -> clears the students collection and inserts sample records
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Student = require('./models/Student');
const data = require('./seedData');

(async () => {
  await connectDB();
  await Student.deleteMany({});
  await Student.insertMany(data);
  console.log(`Seeded ${data.length} students`);
  await mongoose.disconnect();
  process.exit(0);
})();
