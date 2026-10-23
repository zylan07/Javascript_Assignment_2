const router = require('express').Router();
const c = require('../controllers/courseController');

router.get('/', c.listCourses);
router.post('/', c.createCourse);
router.delete('/:id', c.deleteCourse);

module.exports = router;
