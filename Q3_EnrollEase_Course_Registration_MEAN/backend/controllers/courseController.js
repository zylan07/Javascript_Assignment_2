const Course = require('../models/Course');
const Registration = require('../models/Registration');

// Adds "enrolled" and "seatsLeft" to every course
async function withSeats(courses) {
  const active = await Registration.find({ status: 'Registered' }, 'course');
  const counts = {};
  active.forEach((r) => (counts[r.course] = (counts[r.course] || 0) + 1));
  return courses.map((c) => {
    const enrolled = counts[c._id] || 0;
    return { ...c.toObject(), enrolled, seatsLeft: c.capacity - enrolled };
  });
}

// GET /api/courses?category=
exports.listCourses = async (req, res) => {
  try {
    const filter = req.query.category ? { category: req.query.category } : {};
    const courses = await Course.find(filter).sort({ code: 1 });
    res.json(await withSeats(courses));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/courses
exports.createCourse = async (req, res) => {
  try {
    if (await Course.findOne({ code: String(req.body.code || '').toUpperCase() })) {
      return res.status(409).json({ message: 'Course code already exists' });
    }
    res.status(201).json(await Course.create(req.body));
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE /api/courses/:id  (only if nobody is registered)
exports.deleteCourse = async (req, res) => {
  try {
    const active = await Registration.countDocuments({ course: req.params.id, status: 'Registered' });
    if (active) return res.status(400).json({ message: `Cannot delete: ${active} student(s) registered` });
    await Course.findByIdAndDelete(req.params.id);
    res.json({ message: 'Course deleted' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
