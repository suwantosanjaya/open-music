/* eslint-disable camelcase */

exports.shorthands = undefined;

const songsTable = {
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
};

exports.up = (pgm) => {
  pgm.createTable(songsTable.name, songsTable.columns);
};

exports.down = (pgm) => {
  pgm.dropTable(songsTable.name);
};
