const router = require('express').Router();
const usersRouter = require('./users');
const cardsRouter = require('./cards');
const { createUser, login } = require('../controllers/users');
const { auth } = require('../middlewares/auth');
const { signupValidator, signinValidator } = require('../middlewares/validators');

router.use('/users', auth, usersRouter);
router.use('/cards', auth, cardsRouter);
router.post('/signup', signupValidator, createUser);
router.post('/signin', signinValidator, login);

module.exports = router;
