const httpStatus = require('../utils/errorstatus');

class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = httpStatus.Conflict;
  }
}

module.exports = ConflictError;
