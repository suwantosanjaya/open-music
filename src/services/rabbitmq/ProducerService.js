const amqp = require('amqplib');
const { Pool } = require('pg');
const ForbiddenError = require('../../exceptions/ForbiddenError');

const ProducerService = {
  sendMessage: async (queue, message) => {
    const connection = await amqp.connect(process.env.RABBITMQ_SERVER);
    const channel = await connection.createChannel();
    await channel.assertQueue(queue, {
      durable: true,
    });

    await channel.sendToQueue(queue, Buffer.from(message));

    setTimeout(() => {
      connection.close();
    }, 1000);
  },

  verifyPlaylistOwner: async (id, ownerOrCollab) => {
    const query = {
      text: `SELECT owner 
              FROM playlists p LEFT JOIN collaborations c 
                ON (p.id = c.playlist_id) 
              WHERE p.id = $1 and (p.owner = $2 OR c.user_id = $2)`,
      values: [id, ownerOrCollab],
    };
    const pool = new Pool();
    const result = await pool.query(query);
    if (!result.rows.length) {
      throw new ForbiddenError('Anda tidak berhak mengakses resource ini');
    }
  },
};

module.exports = ProducerService;
