/* eslint-disable camelcase */

exports.shorthands = undefined;

const table = {
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
