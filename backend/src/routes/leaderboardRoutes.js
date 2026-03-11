const router = require('express').Router();
const auth = require('../middleware/auth');
const { weekly } = require('../controllers/leaderboardController');

router.get('/weekly', auth, weekly);
module.exports = router;
