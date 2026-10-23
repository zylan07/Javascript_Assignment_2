const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    title: { type: String, required: true, trim: true },
    instructor: { type: String, required: true, trim: true },
    credits: { type: Number, required: true, min: 1, max: 5 },
    category: { type: String, enum: ['Core', 'Professional Elective', 'Open Elective', 'Lab'], default: 'Core' },
    schedule: { type: String, default: '' }, // e.g. "Mon, Wed · 10:00"
    capacity: { type: Number, required: true, min: 1 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Course', courseSchema);
