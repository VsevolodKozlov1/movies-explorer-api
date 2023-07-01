const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const User = require('../models/user');
const BadRequestError = require('../errors/bad-request-err');
const NotFoundError = require('../errors/not-found-err');
const ConflictError = require('../errors/conflict-err');

const SALT_ROUNDS = 10;
const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, SALT_ROUNDS)
    .then((hash) => User.create({
      email: req.body.email,
      password: hash,
      name: req.body.name,
    }))
    .then((user) => {
      const userWOPassword = {
        name: user.name,
        email: user.email,
      };
      return res.status(201).send(userWOPassword);
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError('Пользователь с такой почтой уже существует'));
      } else if (err.name === 'ValidationError') {
        next(new BadRequestError('Некорректные данные при регистрации'));
      } else {
        next(err);
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );
      res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        sameSite: true,
      })
        .send({ message: 'Вход выполнен!' });
    })
    .catch(next);
};

module.exports.getUser = (req, res, next) => User.findById(req.user._id)
  .then((user) => {
    if (!user) throw new NotFoundError('Пользователь не найден');
    const currentUser = {
      name: user.name,
      email: user.email,
    };
    return res.send(currentUser);
  })
  .catch(next);

module.exports.updateProfile = (req, res, next) => User.findByIdAndUpdate(
  req.user._id,
  {
    name: req.body.name,
    email: req.body.email,
  },
  {
    new: true,
    runValidators: true,
  },
)
  .then((user) => {
    if (!user) throw new NotFoundError('Пользователь не найден');
    const currentUser = {
      name: user.name,
      email: user.email,
    };
    return res.send(currentUser);
  })
  .catch((err) => {
    if (err.code === 11000) {
      next(new ConflictError('Пользователь с такой почтой уже существует'));
    } else if (err.name === 'ValidationError') {
      next(new BadRequestError('Введены некорректные данные'));
    } else {
      next(err);
    }
  });
