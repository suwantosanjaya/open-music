/* eslint-disable camelcase */

exports.shorthands = undefined;

const table = [
  {
    name: 'songs',
    columns: {
      id: { type: 'VARCHAR(32)', primaryKey: true },
      title: { type: 'TEXT', notNull: true },
      year: { type: 'INTEGER', notNull: true },
      performer: { type: 'VARCHAR(50)', notNull: true },
      genre: { type: 'VARCHAR(20)', notNull: true },
      duration: { type: 'INTEGER', notNull: true },
      inserted_at: { type: 'VARCHAR(32)', notNull: true },
      updated_at: { type: 'VARCHAR(32)', notNull: true },
    },
  },
  {
    name: 'users',
    columns: {
      id: { type: 'VARCHAR(50)', primaryKey: true },
      username: { type: 'VARCHAR(50)', unique: true, notNull: true },
      password: { type: 'TEXT', notNull: true },
      fullname: { type: 'TEXT', notNull: true },
    },
  },
  {
    name: 'authentications',
    columns: {
      token: { type: 'TEXT', notNull: true },
    },
  },
  {
    name: 'playlists',
    columns: {
      id: { type: 'VARCHAR(32)', primaryKey: true },
      name: { type: 'TEXT', notNull: true },
      owner: { type: 'VARCHAR(50)', notNull: true },
    },
    constraints: [
      {
        name: 'fk_playlists_users',
        key: 'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE',
      },
    ],
  },
  {
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
  },
  {
    name: 'collaborations',
    columns: {
      id: { type: 'VARCHAR(32)', primaryKey: true },
      playlist_id: { type: 'VARCHAR(32)', notNull: true },
      user_id: { type: 'VARCHAR(32)', notNull: true },
    },
    constraints: [
      {
        name: 'fk_collaborations_playlists',
        key: 'FOREIGN KEY(playlist_id) REFERENCES playlists(id) ON DELETE CASCADE',
      },
      {
        name: 'fk_collaborations_users',
        key: 'FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE',
      },
    ],
  },
];

exports.up = (pgm) => {
  table.forEach((element) => {
    pgm.createTable(element.name, element.columns);
  });

  table.forEach((element) => {
    if (element.constraints !== undefined) {
      element.constraints.forEach((elementConstraint) => {
        pgm.addConstraint(
          element.name,
          elementConstraint.name,
          elementConstraint.key,
        );
      });
    }
  });
};

exports.down = (pgm) => {
  table.forEach((element) => {
    if (element.constraints !== undefined) {
      element.constraints.forEach((elementConstraint) => {
        pgm.dropConstraint(element.name, elementConstraint.name);
      });
    }
  });

  table.forEach((element) => {
    pgm.dropTable(element.name);
  });
};
