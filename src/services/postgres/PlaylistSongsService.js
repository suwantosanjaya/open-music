const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const ForbiddenError = require('../../exceptions/ForbiddenError');
const { mapDBToModel } = require('../../utils/playlistsongMap');

class PlaylistSongsService {
  constructor(cacheService) {
    this.pool = new Pool();

    this.cacheService = cacheService;
  }

  async addPlaylistSong({ playlistId, songId, owner }) {
    const id = `playlistsong-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO playlistsongs VALUES($1, $2, $3) RETURNING song_id',
      values: [id, playlistId, songId],
    };

    const result = await this.pool.query(query);
    if (!result.rows[0].song_id) {
      throw new InvariantError('Lagu gagal ditambahkan ke Playlist');
    }

    // Lagu akan dihapus dari cache sebelum fungsi addPlaylistSong dikembalikan
    await this.cacheService.delete(`songs:${owner}-${playlistId}`);
    return result.rows[0].song_id;
  }

  async getPlaylistSongs(playlistId, owner) {
    try {
      const result = await this.cacheService.get(`songs:${owner}-${playlistId}`);
      return JSON.parse(result);
    } catch (error) {
      const query = {
        text: `SELECT s.id, s.title, s.performer 
                FROM  playlistsongs ps 
                      INNER JOIN songs s ON (ps.song_id = s.id) 
                      INNER JOIN playlists p ON (ps.playlist_id = p.id) 
                      INNER JOIN users u ON (p.owner = u.id) 
                      LEFT JOIN collaborations c ON (p.id = c.playlist_id)
                WHERE p.id = $1 AND (p.owner = $2 OR c.user_id = $2)`,
        values: [playlistId, owner],
      };
      const result = await this.pool.query(query);

      const mappedResult = result.rows.map(mapDBToModel);

      // Lagu akan disimpan pada cache sebelum fungsi getPlaylistSongs dikembalikan
      await this.cacheService.set(`songs:${owner}-${playlistId}`, JSON.stringify(mappedResult));

      return mappedResult;
    }
  }

  async deletePlaylistSongs(playlistId, songId, owner) {
    const query = {
      text: 'DELETE FROM playlistsongs WHERE playlist_id = $1 AND song_id = $2 RETURNING id',
      values: [playlistId, songId],
    };

    const result = await this.pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Playlist gagal dihapus. Id tidak ditemukan');
    }

    // Lagu akan dihapus dari cache ketika fungsi deletePlaylistSongs berhasil
    await this.cacheService.delete(`songs:${owner}-${playlistId}`);
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

module.exports = PlaylistSongsService;
