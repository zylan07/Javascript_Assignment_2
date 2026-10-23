const Course = require('../models/Course');
const Student = require('../models/Student');
const Registration = require('../models/Registration');

const MAX_CREDITS = 24;

// POST /api/registrations
// body: { student: {rollNo,name,email,department,year}, courseIds: [..] }
exports.register = async (req, res) => {
  try {
    const { student: s, courseIds } = req.body;
    if (!s || !Array.isArray(courseIds) || !courseIds.length) {
      return res.status(400).json({ message: 'Student details and at least one course are required' });
    }

    // Server-side validation (Angular also validates on the client)
    const errors = [];
    if (!/^\d{2}[A-Za-z]{2,4}\d{3}$/.test(s.rollNo || '')) errors.push('Invalid roll number');
    if (!s.name || s.name.trim().length < 3) errors.push('Name must have at least 3 characters');
    if (!/^\S+@\S+\.\S+$/.test(s.email || '')) errors.push('Invalid email');
    if (!(s.year >= 1 && s.year <= 4)) errors.push('Year must be 1 to 4');
    if (!s.department) errors.push('Department is required');
    if (errors.length) return res.status(400).json({ message: errors.join(', ') });

    // Create the student the first time, update details afterwards
    const rollNo = s.rollNo.toUpperCase();
    let student = await Student.findOne({ rollNo });
    if (student) {
      Object.assign(student, { name: s.name, email: s.email, department: s.department, year: s.year });
      await student.save();
    } else {
      student = await Student.create({ ...s, rollNo });
    }

    const existing = await Registration.find({ student: student._id, status: 'Registered' }).populate('course');
    let credits = existing.reduce((sum, r) => sum + (r.course ? r.course.credits : 0), 0);

    const results = [];
    for (const id of courseIds) {
      const course = await Course.findById(id);
      if (!course) {
        results.push({ courseId: id, ok: false, reason: 'Course not found' });
        continue;
      }
      if (existing.some((r) => String(r.course?._id) === String(course._id))) {
        results.push({ code: course.code, ok: false, reason: 'Already registered' });
        continue;
      }
      const taken = await Registration.countDocuments({ course: course._id, status: 'Registered' });
      if (taken >= course.capacity) {
        results.push({ code: course.code, ok: false, reason: 'Course is full' });
        continue;
      }
      if (credits + course.credits > MAX_CREDITS) {
        results.push({ code: course.code, ok: false, reason: `Exceeds ${MAX_CREDITS} credit limit` });
        continue;
      }
      await Registration.create({ student: student._id, course: course._id });
      credits += course.credits;
      results.push({ code: course.code, ok: true });
    }

    const okCount = results.filter((r) => r.ok).length;
    res.status(okCount ? 201 : 400).json({
      message: okCount ? `${okCount} course(s) registered for ${student.name}` : 'No course could be registered',
      results,
      totalCredits: credits,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/registrations/student/:rollNo
exports.byStudent = async (req, res) => {
  try {
    const student = await Student.findOne({ rollNo: req.params.rollNo.toUpperCase() });
    if (!student) return res.status(404).json({ message: 'No registrations found for this roll number' });
    const regs = await Registration.find({ student: student._id }).populate('course').sort({ createdAt: -1 });
    const totalCredits = regs.filter((r) => r.status === 'Registered').reduce((a, r) => a + (r.course?.credits || 0), 0);
    res.json({ student, registrations: regs, totalCredits });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/registrations  (all, for admin view)
exports.listAll = async (req, res) => {
  try {
    const regs = await Registration.find().populate('student').populate('course').sort({ createdAt: -1 });
    res.json(regs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PATCH /api/registrations/:id/cancel
exports.cancel = async (req, res) => {
  try {
    const reg = await Registration.findById(req.params.id).populate('course');
    if (!reg) return res.status(404).json({ message: 'Registration not found' });
    if (reg.status === 'Cancelled') return res.status(400).json({ message: 'Already cancelled' });
    reg.status = 'Cancelled';
    reg.cancelledAt = new Date();
    await reg.save();
    res.json({ message: `${reg.course.code} cancelled`, registration: reg });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
