const httpStatus = require('../utils/errorstatus');

class ForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = httpStatus.Forbidden;
  }
}

module.exports = ForbiddenError;
