const httpStatus = require('../utils/errorstatus');

class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = httpStatus.badRequest;
  }
}

module.exports = BadRequestError;
