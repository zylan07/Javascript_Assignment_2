const router = require('express').Router();
const c = require('../controllers/bookController');

router.get('/meta/summary', c.summary);
router.get('/', c.listBooks);
router.post('/', c.addBook);
router.get('/:id', c.getBook);
router.put('/:id', c.updateBook);
router.patch('/:id/availability', c.toggleAvailability);
router.delete('/:id', c.deleteBook);

module.exports = router;
