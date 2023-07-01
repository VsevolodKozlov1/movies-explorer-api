const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const UnauthorizedError = require('../errors/unauthorized-err');

function validateEmail(input) {
  return validator.isEmail(input);
}

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
    validate: validateEmail,
  },

  password: {
    type: String,
    required: true,
    select: false,
  },
});

userSchema.statics.findUserByCredentials = function findUserByCredentials(email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new UnauthorizedError('Неправильные почта и/или пароль'));
      }
      return bcrypt.compare(password, user.password)
        .then((matches) => {
          if (!matches) {
            return Promise.reject(new UnauthorizedError('Неправильные почта и/или пароль'));
          }
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
