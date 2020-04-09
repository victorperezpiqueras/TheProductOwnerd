/* sets status code and message passed */
class ErrorHandler extends Error {
  constructor(statusCode, message) {
    super();
    this.statusCode = statusCode;
    this.message = message;
  }
}
/* handles the error sending it as json */
const handleError = (err, res) => {
  const { statusCode, message } = err;
  res.status(statusCode).json({
    status: 'error',
    statusCode,
    message
  });
};

module.exports = {
  ErrorHandler,
  handleError
};
