const mongoose = require('mongoose');

// Links one student to one course. Cancelling keeps the record with status "Cancelled".
const registrationSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    status: { type: String, enum: ['Registered', 'Cancelled'], default: 'Registered' },
    cancelledAt: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Registration', registrationSchema);
