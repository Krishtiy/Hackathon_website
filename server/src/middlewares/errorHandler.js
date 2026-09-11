// Simple global error handler
const errorHandler = (err, req, res, next) => {
  console.error(err.stack || err);
  const status = err.statusCode || 500;
  res.status(status).json({
    message: err.message || 'Server Error'
  });
};

module.exports = errorHandler;
