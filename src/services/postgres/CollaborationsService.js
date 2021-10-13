const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const ForbiddenError = require('../../exceptions/ForbiddenError');

class CollaborationService {
  constructor(cacheService) {
    this.pool = new Pool();
    this.cacheService = cacheService;
  }

  async addCollaboration({ playlistId, userId }) {
    const id = `collab-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO collaborations VALUES($1, $2, $3) RETURNING id',
      values: [id, playlistId, userId],
    };

    const result = await this.pool.query(query);
    if (!result.rows[0].id) {
      throw new InvariantError('Kolaborasi gagal ditambahkan');
    }

    await this.cacheService.delete(`songs:${userId}-${playlistId}`);
    return result.rows[0].id;
  }

  async deleteCollaboration(playlistId, userId) {
    const query = {
      text: 'DELETE FROM collaborations WHERE playlist_id = $1 AND user_id = $2 RETURNING id',
      values: [playlistId, userId],
    };

    const result = await this.pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Kolaborasi gagal dihapus. Id tidak ditemukan');
    }

    await this.cacheService.delete(`songs:${userId}-${playlistId}`);
  }

  async verifyPlaylistOwner(id, ownerOrCollab) {
    const query = {
      text: `SELECT owner 
              FROM playlists p LEFT JOIN collaborations c 
                ON (p.id = c.playlist_id) 
              WHERE p.id = $1 and (p.owner = $2 OR c.user_id = $2)`,
      values: [id, ownerOrCollab],
    };
    const result = await this.pool.query(query);
    if (!result.rows.length) {
      throw new ForbiddenError('Anda tidak berhak mengakses resource ini');
    }
  }
}

module.exports = CollaborationService;
