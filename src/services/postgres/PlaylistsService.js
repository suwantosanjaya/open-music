const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const ForbiddenError = require('../../exceptions/ForbiddenError');
const { mapDBToModel } = require('../../utils/playlistMap');

class PlaylistsService {
  constructor() {
    this.pool = new Pool();
  }

  async addPlaylist({ name, owner }) {
    const id = `playlist-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO playlists VALUES($1, $2, $3) RETURNING id',
      values: [id, name, owner],
    };

    const result = await this.pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Playlist gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getPlaylists(owner) {
    const query = {
      text: `SELECT p.id, p.name, u.username 
              FROM playlists p INNER JOIN users u ON (p.owner = u.id)
              LEFT JOIN collaborations c ON (p.id = c.playlist_id)
              WHERE (p.owner = $1 OR c.user_id = $1)`,
      values: [owner],
    };
    const result = await this.pool.query(query);

    return result.rows.map(mapDBToModel);
  }

  async deletePlaylistById(id, owner) {
    const query = {
      text: 'DELETE FROM playlists WHERE id = $1 AND owner = $2 RETURNING id',
      values: [id, owner],
    };

    const result = await this.pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Playlist gagal dihapus. Id tidak ditemukan');
    }
  }

  async verifyPlaylistOwner(id, ownerOrCollab) {
    const query = {
      text: 'SELECT owner FROM playlists WHERE id = $1 and owner = $2',
      values: [id, ownerOrCollab],
    };
    const result = await this.pool.query(query);
    if (!result.rows.length) {
      throw new ForbiddenError('Anda tidak berhak mengakses resource ini');
    }
  }
}

module.exports = PlaylistsService;
