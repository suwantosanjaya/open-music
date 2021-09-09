const ClientError = require('./ClientError');

class ForbiddenError extends ClientError {
  constructor(message) {
    super(message, 403);
    this.name = 'Forbidden Error';
  }
}

module.exports = ForbiddenError;
