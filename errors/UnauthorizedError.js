const httpStatus = require('../utils/errorstatus');

class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = httpStatus.Unauthorized;
  }
}

module.exports = UnauthorizedError;
