const notFound = (req, res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const errorHandler = (err, _req, res, _next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: Object.values(err.errors).map((item) => item.message)[0],
    });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({ error: 'Invalid resource id' });
  }

  if (err.code === 11000) {
    return res.status(409).json({ error: 'Duplicate record already exists' });
  }

  res.status(statusCode).json({
    error: err.message || 'Server error',
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
  });
};

module.exports = { notFound, errorHandler };
