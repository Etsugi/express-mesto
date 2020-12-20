const router = require('express').Router();
const usersRouter = require('./users.js');
const cardsRouter = require('./cards.js');

router.use('/users', usersRouter);
router.use('/cards', cardsRouter);

module.exports = router;