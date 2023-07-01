const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unauthorized-err');

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;
  const { NODE_ENV, JWT_SECRET } = process.env;
  if (!token) {
    next(new UnauthorizedError('Вход в аккаунт не выполнен'));
    return;
  }

  let payload;
  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    next(new UnauthorizedError('Вход в аккаунт не выполнен'));
  }
  req.user = payload;
  next();
};
