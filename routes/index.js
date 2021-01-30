const router = require('express').Router();
const auth = require('../middlewares/auth');
const usersRouter = require('./users.js');
const cardsRouter = require('./cards.js');

router.use('/users', auth, usersRouter);
router.use('/cards', auth, cardsRouter);

module.exports = router;
