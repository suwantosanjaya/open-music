require('dotenv').config();
const amqp = require('amqplib');
const PlaylistSongsService = require('../services/postgres/PlaylistSongsService');
const MailSender = require('./MailSender');
const Listener = require('./Listener');
const CacheService = require('../services/redis/CacheService');

const init = async () => {
  const cacheService = new CacheService();
  const playlistSongsService = new PlaylistSongsService(cacheService);
  const mailSender = new MailSender();
  const listener = new Listener(playlistSongsService, mailSender);

  const connection = await amqp.connect(process.env.RABBITMQ_SERVER);
  const channel = await connection.createChannel();

  await channel.assertQueue('export:songs', {
    durable: true,
  });

  channel.consume('export:songs', listener.listen, { noAck: true });
};

init();
