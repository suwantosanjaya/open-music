/* eslint-disable camelcase */

exports.shorthands = undefined;

const table = {
  name: 'playlistsongs',
  columns: {
    id: { type: 'VARCHAR(32)', primaryKey: true },
    playlist_id: { type: 'VARCHAR(32)', notNull: true },
    song_id: { type: 'VARCHAR(32)', notNull: true },
  },
  constraints: [
    {
      name: 'fk_playlistsongs_playlists',
      key: 'FOREIGN KEY(playlist_id) REFERENCES playlists(id) ON DELETE CASCADE',
    },
    {
      name: 'fk_playlistsongs_songs',
      key: 'FOREIGN KEY(song_id) REFERENCES songs(id) ON DELETE CASCADE',
    },
  ],
};

exports.up = (pgm) => {
  pgm.createTable(table.name, table.columns);
  for (let i = 0; i < Object.keys(table.constraints).length; i += 1) {
    pgm.addConstraint(
      table.name,
      table.constraints[i].name,
      table.constraints[i].key,
    );
  }
};

exports.down = (pgm) => {
  for (let i = 0; i < Object.keys(table.constraints).length; i += 1) {
    pgm.dropConstraint(table.name, table.constraints[i].name);
  }

  pgm.dropTable(table.name);
};
