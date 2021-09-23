const { UsersPayloadSchema } = require('./schema');
const InvariantError = require('../../exceptions/InvariantError');

class UsersValidator {
  static validateUserPayload(payload) {
    const validationResult = UsersPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  }
}

module.exports = UsersValidator;
