const ExportPlaylistSongHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'exports',
  version: '2.0.0',
  register: async (server, { service, validator }) => {
    const exportsHandler = new ExportPlaylistSongHandler(service, validator);
    server.route(routes(exportsHandler));
  },
};
