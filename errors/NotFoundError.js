const httpStatus = require('../utils/errorstatus');

class NorFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = httpStatus.notFound;
  }
}

module.exports = NorFoundError;
