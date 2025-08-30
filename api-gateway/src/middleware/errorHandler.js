const logger = require('../utils/logger');
const { metrics } = require('./monitoring');

const errorHandler = (error, req, res, next) => {
  // Log the error
  logger.logError(error, req);
  
  // Record error metric
  const service = req.route?.path?.split('/')[2] || 'unknown';
  metrics.recordError('application', service, error.code || 'UNKNOWN');
  
  // Default error response
  let statusCode = 500;
  let errorResponse = {
    error: 'Internal Server Error',
    message: 'An unexpected error occurred',
    requestId: req.requestId,
    timestamp: new Date().toISOString()
  };
  
  // Handle specific error types
  if (error.name === 'ValidationError') {
    statusCode = 400;
    errorResponse = {
      error: 'Validation Error',
      message: error.message,
      details: error.details || [],
      requestId: req.requestId,
      timestamp: new Date().toISOString()
    };
  } else if (error.name === 'UnauthorizedError' || error.status === 401) {
    statusCode = 401;
    errorResponse = {
      error: 'Unauthorized',
      message: error.message || 'Authentication required',
      requestId: req.requestId,
      timestamp: new Date().toISOString()
    };
  } else if (error.name === 'ForbiddenError' || error.status === 403) {
    statusCode = 403;
    errorResponse = {
      error: 'Forbidden',
      message: error.message || 'Insufficient permissions',
      requestId: req.requestId,
      timestamp: new Date().toISOString()
    };
  } else if (error.name === 'NotFoundError' || error.status === 404) {
    statusCode = 404;
    errorResponse = {
      error: 'Not Found',
      message: error.message || 'Resource not found',
      requestId: req.requestId,
      timestamp: new Date().toISOString()
    };
  } else if (error.name === 'TimeoutError' || error.code === 'ETIMEDOUT') {
    statusCode = 504;
    errorResponse = {
      error: 'Gateway Timeout',
      message: 'The request timed out',
      requestId: req.requestId,
      timestamp: new Date().toISOString()
    };
  } else if (error.name === 'ServiceUnavailableError' || error.status === 503) {
    statusCode = 503;
    errorResponse = {
      error: 'Service Unavailable',
      message: error.message || 'Service temporarily unavailable',
      requestId: req.requestId,
      timestamp: new Date().toISOString()
    };
  } else if (error.status) {
    statusCode = error.status;
    errorResponse.error = error.name || 'Error';
    errorResponse.message = error.message || 'An error occurred';
  }
  
  // Add error code if available
  if (error.code) {
    errorResponse.code = error.code;
  }
  
  // Add stack trace in development
  if (process.env.NODE_ENV === 'development') {
    errorResponse.stack = error.stack;
  }
  
  // Send error response
  res.status(statusCode).json(errorResponse);
};

// Async error handler wrapper
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Custom error classes
class APIError extends Error {
  constructor(message, statusCode = 500, code = null) {
    super(message);
    this.name = 'APIError';
    this.status = statusCode;
    this.code = code;
    Error.captureStackTrace(this, this.constructor);
  }
}

class ValidationError extends APIError {
  constructor(message, details = []) {
    super(message, 400, 'VALIDATION_ERROR');
    this.name = 'ValidationError';
    this.details = details;
  }
}

class UnauthorizedError extends APIError {
  constructor(message = 'Authentication required') {
    super(message, 401, 'UNAUTHORIZED');
    this.name = 'UnauthorizedError';
  }
}

class ForbiddenError extends APIError {
  constructor(message = 'Insufficient permissions') {
    super(message, 403, 'FORBIDDEN');
    this.name = 'ForbiddenError';
  }
}

class NotFoundError extends APIError {
  constructor(message = 'Resource not found') {
    super(message, 404, 'NOT_FOUND');
    this.name = 'NotFoundError';
  }
}

class TimeoutError extends APIError {
  constructor(message = 'Request timeout') {
    super(message, 504, 'TIMEOUT');
    this.name = 'TimeoutError';
  }
}

class ServiceUnavailableError extends APIError {
  constructor(message = 'Service unavailable') {
    super(message, 503, 'SERVICE_UNAVAILABLE');
    this.name = 'ServiceUnavailableError';
  }
}

class RateLimitError extends APIError {
  constructor(message = 'Rate limit exceeded') {
    super(message, 429, 'RATE_LIMIT_EXCEEDED');
    this.name = 'RateLimitError';
  }
}

module.exports = {
  errorHandler,
  asyncHandler,
  APIError,
  ValidationError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  TimeoutError,
  ServiceUnavailableError,
  RateLimitError
};