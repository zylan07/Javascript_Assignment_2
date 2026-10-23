const mongoose = require('mongoose');

const GENRES = ['Fiction', 'Technology', 'Self-Help', 'Biography', 'Science', 'Tamil Literature', 'Kids'];

const bookSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, 'Title is required'], trim: true },
    author: { type: String, required: [true, 'Author is required'], trim: true },
    price: { type: Number, required: [true, 'Price is required'], min: [0, 'Price cannot be negative'] },
    available: { type: Boolean, default: true }, // availability flag shown as In stock / Out of stock
    stock: { type: Number, default: 0, min: 0 },
    genre: { type: String, enum: GENRES, default: 'Fiction' },
    publishedYear: { type: Number, min: 1500, max: 2100 },
    coverColor: { type: String, default: '#7c2d12' }, // used to draw a cover in the UI
  },
  { timestamps: true }
);

// Keep "available" in sync with stock when stock is set
bookSchema.pre('save', function (next) {
  if (this.isModified('stock') && this.stock === 0) this.available = false;
  next();
});

bookSchema.statics.GENRES = GENRES;

module.exports = mongoose.model('Book', bookSchema);
