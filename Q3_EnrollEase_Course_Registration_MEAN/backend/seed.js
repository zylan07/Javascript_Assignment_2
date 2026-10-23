// Run: npm run seed   -> resets courses, students and registrations
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Course = require('./models/Course');
const Student = require('./models/Student');
const Registration = require('./models/Registration');

(async () => {
  await connectDB();
  await Promise.all([Course.deleteMany({}), Student.deleteMany({}), Registration.deleteMany({})]);
  await Course.insertMany(require('./seedData'));
  console.log('Courses seeded');
  await mongoose.disconnect();
  process.exit(0);
})();
