const ClientError = require('../../exceptions/ClientError');

class CollaborationsHandler {
  constructor(service) {
    this.service = service;

    this.postCollaborationHandler = this.postCollaborationHandler.bind(this);
    this.deleteCollaborationHandler = this.deleteCollaborationHandler.bind(this);
  }

  async postCollaborationHandler(request, h) {
    try {
      const { playlistId, userId } = request.payload;
      const { id: credentialId } = request.auth.credentials;
      await this.service.verifyPlaylistOwner(playlistId, credentialId);

      const collaborationId = await this.service.addCollaboration({ playlistId, userId });

      const response = h.response({
        status: 'success',
        message: 'Kolaborasi berhasil ditambahkan',
        data: {
          collaborationId,
        },
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

  async deleteCollaborationHandler(request, h) {
    try {
      const { playlistId, userId } = request.payload;
      const { id: credentialId } = request.auth.credentials;
      await this.service.verifyPlaylistOwner(playlistId, credentialId);

      await this.service.deleteCollaboration(playlistId, userId);
      return {
        status: 'success',
        message: 'Kolaborasi berhasil dihapus',
      };
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

module.exports = CollaborationsHandler;
