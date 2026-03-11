const router = require('express').Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const c = require('../controllers/missionsController');

router.get('/', auth, c.list);
router.post('/', auth, admin, c.create);
router.post('/complete', auth, c.complete);

module.exports = router;
