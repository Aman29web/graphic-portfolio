export function notFound(req, res, next) {
  res.status(404).json({ success: false, message: `Route not found: ${req.originalUrl}` });
}

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  console.error('API error:', err.message);

  let status = err.statusCode || 500;
  let message = err.message || 'Something went wrong on the server';

  if (err.name === 'ValidationError') {
    status = 400;
    message = Object.values(err.errors).map((e) => e.message).join(', ');
  }
  if (err.name === 'CastError') {
    status = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  }
  if (err.code === 11000) {
    status = 409;
    message = `Duplicate value for: ${Object.keys(err.keyValue).join(', ')}`;
  }
  if (err.code === 'LIMIT_FILE_SIZE') {
    status = 413;
    message = 'File is too large (max 8MB)';
  }
  if (err.name === 'MulterError' && err.code !== 'LIMIT_FILE_SIZE') {
    status = 400;
  }

  res.status(status).json({ success: false, message });
}

export function asyncHandler(fn) {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
}
