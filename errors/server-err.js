const { SERVER_ERROR_CODE } = require('./err-codes');

class ServerError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = SERVER_ERROR_CODE;
  }
}

module.exports = ServerError;
