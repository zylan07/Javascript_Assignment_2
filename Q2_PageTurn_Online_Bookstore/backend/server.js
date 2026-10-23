require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const Book = require('./models/Book');

const app = express();
app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  console.log(`[PageTurn] ${req.method} ${req.originalUrl}`);
  next();
});

app.get('/api/health', (req, res) => res.json({ status: 'ok', app: 'PageTurn Books API' }));
app.use('/api/books', require('./routes/bookRoutes'));
app.use((req, res) => res.status(404).json({ message: 'Not found' }));

const PORT = process.env.PORT || 5002;
connectDB().then(async () => {
  if ((await Book.countDocuments()) === 0) {
    await Book.insertMany(require('./seedData'));
    console.log('Empty database -> sample books inserted');
  }
  app.listen(PORT, () => console.log(`PageTurn API running at http://localhost:${PORT}`));
});
