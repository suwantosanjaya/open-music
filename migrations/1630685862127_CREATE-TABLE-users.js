/* eslint-disable camelcase */

exports.shorthands = undefined;

const table = {
  name: 'users',
  columns: {
    id: { type: 'VARCHAR(50)', primaryKey: true },
    username: { type: 'VARCHAR(50)', unique: true, notNull: true },
    password: { type: 'TEXT', notNull: true },
    fullname: { type: 'TEXT', notNull: true },
  },
};

exports.up = (pgm) => {
  pgm.createTable(table.name, table.columns);
};

exports.down = (pgm) => {
  pgm.dropTable(table.name);
};
