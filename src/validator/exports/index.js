const { ExportPlaylistSongsPayloadSchema } = require('./schema');
const InvariantError = require('../../exceptions/InvariantError');

class ExportValidator {
  static validateExportPlaylistSongsPayload(payload) {
    const validationResult = ExportPlaylistSongsPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  }
}

module.exports = ExportValidator;
