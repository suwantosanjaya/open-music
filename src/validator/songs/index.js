const { SongPayloadSchema } = require('./schema');
const ClientError = require('../../exceptions/ClientError');

const SongsValidator = {
  validateSongPayload: (payload) => {
    const validationResult = SongPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new ClientError(validationResult.error.message);
    }
  },
};

module.exports = SongsValidator;
