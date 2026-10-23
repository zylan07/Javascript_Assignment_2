const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema(
  {
    rollNo: { type: String, required: true, unique: true, uppercase: true, trim: true, match: /^\d{2}[A-Z]{2,4}\d{3}$/ },
    name: { type: String, required: true, trim: true, minlength: 3 },
    email: { type: String, required: true, lowercase: true, trim: true, match: /^\S+@\S+\.\S+$/ },
    department: { type: String, required: true },
    year: { type: Number, required: true, min: 1, max: 4 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Student', studentSchema);
