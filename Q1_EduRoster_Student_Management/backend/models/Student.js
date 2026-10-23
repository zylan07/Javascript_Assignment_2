const mongoose = require('mongoose');

const DEPARTMENTS = ['CSE', 'IT', 'ECE', 'EEE', 'MECH', 'AIDS', 'CSBS'];

const studentSchema = new mongoose.Schema(
  {
    rollNo: {
      type: String,
      required: [true, 'Roll number is required'],
      unique: true,
      uppercase: true,
      trim: true,
      match: [/^\d{2}[A-Z]{2,4}\d{3}$/, 'Roll number must look like 24CS192'],
    },
    name: { type: String, required: [true, 'Name is required'], trim: true, minlength: 3 },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Invalid email'],
    },
    phone: { type: String, trim: true, match: [/^[6-9]\d{9}$/, 'Phone must be a 10-digit mobile number'] },
    department: { type: String, enum: DEPARTMENTS, required: true },
    year: { type: Number, min: 1, max: 4, required: true },
    cgpa: { type: Number, min: 0, max: 10, default: 0 },
  },
  { timestamps: true }
);

studentSchema.statics.DEPARTMENTS = DEPARTMENTS;

module.exports = mongoose.model('Student', studentSchema);
