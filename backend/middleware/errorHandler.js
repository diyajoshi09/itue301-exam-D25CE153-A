const errorHandler = (err, req, res, next) => {
  console.error('[Error Handler]:', err.message);

  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors: errors
    });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: `Invalid ID format: ${err.value}`
    });
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue);
    return res.status(400).json({
      success: false,
      message: `Duplicate value entered for ${field}`
    });
  }

  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
};

module.exports = errorHandler;
