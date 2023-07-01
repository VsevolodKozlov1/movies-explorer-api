const { FORBIDDEN_CODE } = require('./err-codes');

class ForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = FORBIDDEN_CODE;
  }
}

module.exports = ForbiddenError;
