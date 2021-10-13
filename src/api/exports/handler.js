const ClientError = require('../../exceptions/ClientError');

class ExportPlaylistSongHandler {
  constructor(service, validator) {
    this.service = service;
    this.validator = validator;
    this.postExportPlaylistSongsHandler = this.postExportPlaylistSongsHandler.bind(this);
  }

  async postExportPlaylistSongsHandler(request, h) {
    try {
      this.validator.validateExportPlaylistSongsPayload(request.payload);
      const { playlistId } = request.params;
      const { id: credentialId } = request.auth.credentials;
      await this.service.verifyPlaylistOwner(playlistId, credentialId);

      const message = {
        userId: credentialId,
        targetEmail: request.payload.targetEmail,
        playlistId,
      };

      await this.service.sendMessage('export:songs', JSON.stringify(message));

      const response = h.response({
        status: 'success',
        message: 'Permintaan anda dalam Antrian',
      });
      response.code(201);
      return response;
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      // Internal Server Error
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });

      response.code(500);
      return response;
    }
  }
}

module.exports = ExportPlaylistSongHandler;
