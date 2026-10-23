const router = require('express').Router();
const r = require('../controllers/registrationController');

router.get('/', r.listAll);
router.post('/', r.register);
router.get('/student/:rollNo', r.byStudent);
router.patch('/:id/cancel', r.cancel);

module.exports = router;
