const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const ForbiddenError = require('../../exceptions/ForbiddenError');
const { mapDBToModel } = require('../../utils/playlistsongMap');

class PlaylistSongsService {
  constructor() {
    this.pool = new Pool();
  }

  async addPlaylistSong({ playlistId, songId }) {
    const id = `playlistsong-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO playlistsongs VALUES($1, $2, $3) RETURNING song_id',
      values: [id, playlistId, songId],
    };

    const result = await this.pool.query(query);
    if (!result.rows[0].song_id) {
      throw new InvariantError('Lagu gagal ditambahkan ke Playlist');
    }

    return result.rows[0].song_id;
  }

  async getPlaylistSongs(playlistId, owner) {
    const query = {
      text: `SELECT s.id, s.title, s.performer 
              FROM  playlistsongs ps 
                    INNER JOIN songs s ON (ps.song_id = s.id) 
                    INNER JOIN playlists p ON (ps.playlist_id = p.id) 
                    INNER JOIN users u ON (p.owner = u.id) 
              WHERE p.id = $1 AND p.owner = $2`,
      values: [playlistId, owner],
    };
    const result = await this.pool.query(query);

    return result.rows.map(mapDBToModel);
  }

  async deletePlaylistSongs(playlistId, songId) {
    const query = {
      text: 'DELETE FROM playlistsongs WHERE playlist_id = $1 AND song_id = $2 RETURNING id',
      values: [playlistId, songId],
    };

    const result = await this.pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Playlist gagal dihapus. Id tidak ditemukan');
    }
  }

  async verifyPlaylistOwner(id, owner) {
    const query = {
      text: 'SELECT owner FROM playlists WHERE id = $1 and owner = $2',
      values: [id, owner],
    };
    const result = await this.pool.query(query);
    if (!result.rows.length) {
      throw new ForbiddenError('Anda tidak berhak mengakses resource ini');
    }
  }
}

module.exports = PlaylistSongsService;
