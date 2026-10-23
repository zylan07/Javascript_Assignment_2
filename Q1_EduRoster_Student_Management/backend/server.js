require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const Student = require('./models/Student');
const studentRoutes = require('./routes/studentRoutes');

const app = express();
app.use(cors());
app.use(express.json());

// simple request logger
app.use((req, res, next) => {
  console.log(`${new Date().toLocaleTimeString()}  ${req.method} ${req.originalUrl}`);
  next();
});

app.get('/api/health', (req, res) => res.json({ status: 'ok', app: 'EduRoster API' }));
app.use('/api/students', studentRoutes);

app.use((req, res) => res.status(404).json({ message: `Route ${req.originalUrl} not found` }));

const PORT = process.env.PORT || 5001;

connectDB().then(async () => {
  // Insert sample data the first time so the UI is not empty
  if ((await Student.countDocuments()) === 0) {
    await Student.insertMany(require('./seedData'));
    console.log('Empty database -> sample students inserted');
  }
  app.listen(PORT, () => console.log(`EduRoster API running at http://localhost:${PORT}`));
});
