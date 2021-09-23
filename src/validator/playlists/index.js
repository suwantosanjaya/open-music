const { PlaylistPayloadSchema } = require('./schema');
const InvariantError = require('../../exceptions/InvariantError');

class PlaylistsValidator {
  static validatePlaylistPayload(payload) {
    const validationResult = PlaylistPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  }
}

module.exports = PlaylistsValidator;
