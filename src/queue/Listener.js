class Listener {
  constructor(songsService, mailSender) {
    this.songsService = songsService;
    this.mailSender = mailSender;

    this.listen = this.listen.bind(this);
  }

  async listen(message) {
    try {
      const { userId, targetEmail, playlistId } = JSON.parse(message.content.toString());

      const songs = await this.songsService.getPlaylistSongs(playlistId, userId);
      const result = await this.mailSender.sendEmail(targetEmail, JSON.stringify(songs));
      console.log(result);
    } catch (error) {
      console.error('di Listener.js');
      console.error(error);
    }
  }
}

module.exports = Listener;
