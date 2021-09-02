require('dotenv').config();

const Hapi = require('@hapi/hapi');
const songs = require('./api/songs'); // ---> ./src/api/songs/index.js
// const SongService = require('./services/inMemory/SongService');
const SongService = require('./services/postgres/SongService');
const SongsValidator = require('./validator/songs'); // ---> ./src/validator/songs/index.js

const init = async () => {
  const songService = new SongService();

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register({
    plugin: songs,
    options: {
      service: songService,
      validator: SongsValidator,
    },
  });

  await server.start();
  // eslint-disable-next-line no-console
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
