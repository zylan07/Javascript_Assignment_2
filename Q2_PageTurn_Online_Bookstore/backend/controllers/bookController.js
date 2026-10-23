const Book = require('../models/Book');

function fail(res, err) {
  if (err.name === 'ValidationError') {
    return res.status(400).json({ message: Object.values(err.errors).map((e) => e.message).join(', ') });
  }
  if (err.name === 'CastError') return res.status(400).json({ message: 'Invalid book id' });
  res.status(500).json({ message: err.message });
}

// escape user text so it is safe inside a RegExp
const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// GET /api/books?q=&searchBy=title|author|all&genre=&available=true&sort=price_asc|price_desc|title
exports.listBooks = async (req, res) => {
  try {
    const { q, searchBy = 'all', genre, available, sort } = req.query;
    const filter = {};
    if (q && q.trim()) {
      const rx = new RegExp(escape(q.trim()), 'i');
      if (searchBy === 'title') filter.title = rx;
      else if (searchBy === 'author') filter.author = rx;
      else filter.$or = [{ title: rx }, { author: rx }];
    }
    if (genre) filter.genre = genre;
    if (available === 'true') filter.available = true;
    const sorts = { price_asc: { price: 1 }, price_desc: { price: -1 }, title: { title: 1 } };
    const books = await Book.find(filter).sort(sorts[sort] || { createdAt: -1 });
    res.json(books);
  } catch (err) {
    fail(res, err);
  }
};

// GET /api/books/:id
exports.getBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.json(book);
  } catch (err) {
    fail(res, err);
  }
};

// POST /api/books
exports.addBook = async (req, res) => {
  try {
    const book = await Book.create(req.body);
    res.status(201).json(book);
  } catch (err) {
    fail(res, err);
  }
};

// PUT /api/books/:id
exports.updateBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.json(book);
  } catch (err) {
    fail(res, err);
  }
};

// PATCH /api/books/:id/availability  -> flips In stock / Out of stock
exports.toggleAvailability = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    book.available = !book.available;
    if (book.available && book.stock === 0) book.stock = 1;
    await book.save();
    res.json(book);
  } catch (err) {
    fail(res, err);
  }
};

// DELETE /api/books/:id
exports.deleteBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.json({ message: `"${book.title}" removed from catalogue` });
  } catch (err) {
    fail(res, err);
  }
};

// GET /api/books/meta/summary -> numbers for the header
exports.summary = async (req, res) => {
  try {
    const books = await Book.find({}, 'price available genre');
    const inStock = books.filter((b) => b.available).length;
    res.json({
      total: books.length,
      inStock,
      outOfStock: books.length - inStock,
      genres: Book.GENRES,
    });
  } catch (err) {
    fail(res, err);
  }
};
