const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const auth = require('../middlewares/auth');
const { createUser, login } = require('../controllers/user');
const userRouter = require('./user');
const movieRouter = require('./movie');
const NotFoundError = require('../errors/not-found-err');

router.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
      name: Joi.string().min(2).max(30).required(),
    }),
  }),
  createUser,
);

router.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),
  login,
);

router.post('/signout', (req, res) => {
  res.clearCookie('jwt').send({ message: 'Выход' });
});

router.use(auth);

router.use(userRouter);
router.use(movieRouter);
router.all('/*', (req, res, next) => {
  next(new NotFoundError('По данному адресу ничего не найдено!'));
});

module.exports = router;
