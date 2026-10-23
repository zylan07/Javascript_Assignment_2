const Student = require('../models/Student');

// Turns Mongoose errors into readable messages for the React form
function handleError(res, err) {
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map((e) => e.message).join(', ');
    return res.status(400).json({ message });
  }
  if (err.code === 11000) return res.status(409).json({ message: 'A student with this roll number already exists' });
  if (err.name === 'CastError') return res.status(400).json({ message: 'Invalid student id' });
  return res.status(500).json({ message: err.message });
}

// GET /api/students?search=&department=&year=&sort=
exports.getStudents = async (req, res) => {
  try {
    const { search, department, year, sort } = req.query;
    const filter = {};
    if (department) filter.department = department;
    if (year) filter.year = Number(year);
    if (search) {
      const rx = new RegExp(search.trim(), 'i');
      filter.$or = [{ name: rx }, { rollNo: rx }, { email: rx }];
    }
    const sortMap = { cgpa: { cgpa: -1 }, name: { name: 1 }, roll: { rollNo: 1 } };
    const students = await Student.find(filter).sort(sortMap[sort] || { createdAt: -1 });
    res.json(students);
  } catch (err) {
    handleError(res, err);
  }
};

// GET /api/students/:id
exports.getStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json(student);
  } catch (err) {
    handleError(res, err);
  }
};

// POST /api/students
exports.createStudent = async (req, res) => {
  try {
    const exists = await Student.findOne({ rollNo: String(req.body.rollNo || '').toUpperCase() });
    if (exists) return res.status(409).json({ message: 'A student with this roll number already exists' });
    const student = await Student.create(req.body);
    res.status(201).json(student);
  } catch (err) {
    handleError(res, err);
  }
};

// PUT /api/students/:id
exports.updateStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json(student);
  } catch (err) {
    handleError(res, err);
  }
};

// DELETE /api/students/:id
exports.deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json({ message: `Deleted ${student.name} (${student.rollNo})` });
  } catch (err) {
    handleError(res, err);
  }
};

// GET /api/students/meta/departments
exports.getDepartments = (req, res) => res.json(Student.DEPARTMENTS);
