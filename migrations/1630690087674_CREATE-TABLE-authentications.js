/* eslint-disable camelcase */

exports.shorthands = undefined;

const table = {
  name: 'authentications',
  columns: {
    token: { type: 'TEXT', notNull: true },
  },
};

exports.up = (pgm) => {
  pgm.createTable(table.name, table.columns);
};

exports.down = (pgm) => {
  pgm.dropTable(table.name);
};
