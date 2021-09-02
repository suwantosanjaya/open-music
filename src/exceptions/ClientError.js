class ClientError extends Error {
  constructor(message, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'Bad Request Error';
  }
}

module.exports = ClientError;
