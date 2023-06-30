const userRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUser,
  updateProfile,
} = require('../controllers/user');

userRouter.get('/users/me', getUser);

userRouter.patch(
  '/users/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      email: Joi.string().email(),
    }),
  }),
  updateProfile,
);

module.exports = userRouter;
