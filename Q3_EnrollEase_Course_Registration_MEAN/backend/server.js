require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const Course = require('./models/Course');

const app = express();
app.use(cors({ origin: ['http://localhost:4200'] }));
app.use(express.json());
app.use((req, _res, next) => {
  console.log(`[EnrollEase] ${req.method} ${req.originalUrl}`);
  next();
});

app.get('/api/health', (_req, res) => res.json({ status: 'ok', app: 'EnrollEase API' }));
app.use('/api/courses', require('./routes/courseRoutes'));
app.use('/api/registrations', require('./routes/registrationRoutes'));
app.use((req, res) => res.status(404).json({ message: 'Not found' }));

const PORT = process.env.PORT || 5003;
connectDB().then(async () => {
  if ((await Course.countDocuments()) === 0) {
    await Course.insertMany(require('./seedData'));
    console.log('Empty database -> sample courses inserted');
  }
  app.listen(PORT, () => console.log(`EnrollEase API running at http://localhost:${PORT}`));
});
