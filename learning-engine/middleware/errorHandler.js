module.exports = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.statusCode ? err.message : 'Internal server error.';

  if (!err.statusCode) {
    console.error(err.stack);
  }

  res.status(statusCode).json({ error: message });
};