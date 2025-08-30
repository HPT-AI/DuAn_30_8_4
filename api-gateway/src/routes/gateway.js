const express = require('express');
const rateLimit = require('express-rate-limit');
const { body, param, query, validationResult } = require('express-validator');
const authentication = require('../middleware/authentication');
const { asyncHandler, ValidationError } = require('../middleware/errorHandler');
const proxyService = require('../services/proxyService');
const { serviceDiscovery } = require('../services/serviceDiscovery');
const logger = require('../utils/logger');
const config = require('../../config/default');

const router = express.Router();

// Validation middleware
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ValidationError('Validation failed', errors.array());
  }
  next();
};

// Service-specific rate limiting
const createServiceRateLimit = (serviceName, maxRequests = 100, windowMs = 15 * 60 * 1000) => {
  return rateLimit({
    windowMs,
    max: maxRequests,
    message: {
      error: 'Rate limit exceeded',
      message: `Too many requests to ${serviceName}. Please try again later.`,
      service: serviceName,
      retryAfter: Math.ceil(windowMs / 1000)
    },
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => `${req.ip}:${serviceName}`,
    skip: (req) => {
      // Skip rate limiting for authenticated admin users
      return req.user && req.user.roles && req.user.roles.includes('admin');
    }
  });
};

// Generic proxy route for all services
router.all('/:service/*', 
  // Validation
  param('service').isAlphanumeric().withMessage('Service name must be alphanumeric'),
  validateRequest,
  
  // Service-specific rate limiting
  (req, res, next) => {
    const serviceName = req.params.service;
    const serviceConfig = serviceDiscovery.getServiceConfig(serviceName);
    
    if (!serviceConfig) {
      return res.status(404).json({
        error: 'Service not found',
        message: `Service '${serviceName}' is not registered`,
        availableServices: Array.from(serviceDiscovery.services.keys()),
        requestId: req.requestId
      });
    }
    
    // Apply service-specific rate limiting
    const rateLimiter = createServiceRateLimit(serviceName);
    rateLimiter(req, res, next);
  },
  
  // Authentication (optional by default, can be overridden per service)
  authentication.optional,
  
  // Proxy the request
  asyncHandler(async (req, res) => {
    const serviceName = req.params.service;
    const path = req.path.replace(`/${serviceName}`, '');
    
    logger.info(`Proxying request to ${serviceName}: ${req.method} ${path}`);
    
    try {
      // Transform request
      const transformedRequest = proxyService.transformRequest(req, serviceName);
      
      // Make request to service
      const response = await proxyService.makeRequest(serviceName, path, {
        method: req.method,
        data: transformedRequest.data,
        headers: transformedRequest.headers,
        params: transformedRequest.params,
        timeout: 30000,
        retries: 3,
        cache: req.method === 'GET' && req.query.cache !== 'false',
        cacheTTL: parseInt(req.query.cacheTTL) || 300
      });
      
      // Transform response
      const transformedResponse = proxyService.transformResponse(response, serviceName);
      
      // Set response headers
      Object.entries(transformedResponse.headers).forEach(([key, value]) => {
        if (!key.toLowerCase().startsWith('x-')) {
          res.setHeader(key, value);
        }
      });
      
      // Add custom headers
      res.setHeader('X-Response-Time', `${response.responseTime}ms`);
      res.setHeader('X-Cache-Status', response.fromCache ? 'HIT' : 'MISS');
      
      // Send response
      res.status(response.status).json(transformedResponse.data);
      
    } catch (error) {
      logger.error(`Proxy error for ${serviceName}:`, error);
      throw error;
    }
  })
);

// User service routes with authentication
router.use('/users', 
  authentication.required,
  proxyService.createProxy('userService', {
    pathRewrite: { '^/api/users': '' }
  })
);

// Order service routes with authentication and authorization
router.use('/orders',
  authentication.required,
  authentication.authorize(['user', 'admin']),
  proxyService.createProxy('orderService', {
    pathRewrite: { '^/api/orders': '' }
  })
);

// Payment service routes with strict authentication
router.use('/payments',
  authentication.required,
  authentication.authorize(['user', 'admin']),
  createServiceRateLimit('paymentService', 50, 15 * 60 * 1000), // Stricter rate limiting
  proxyService.createProxy('paymentService', {
    pathRewrite: { '^/api/payments': '' }
  })
);

// Admin routes with admin authorization
router.use('/admin',
  authentication.required,
  authentication.authorize(['admin']),
  (req, res, next) => {
    // Additional admin-specific middleware
    logger.info(`Admin access: ${req.user.userId} accessing ${req.path}`);
    next();
  }
);

// Service management endpoints for admins
router.get('/admin/services',
  authentication.required,
  authentication.authorize(['admin']),
  asyncHandler(async (req, res) => {
    const services = serviceDiscovery.getAllServices();
    res.json({
      services,
      timestamp: new Date().toISOString()
    });
  })
);

router.post('/admin/services/:serviceName/instances',
  authentication.required,
  authentication.authorize(['admin']),
  body('url').isURL().withMessage('Valid URL is required'),
  body('id').optional().isString(),
  validateRequest,
  asyncHandler(async (req, res) => {
    const { serviceName } = req.params;
    const { url, id } = req.body;
    
    serviceDiscovery.addServiceInstance(serviceName, { url, id });
    
    res.json({
      message: `Instance added to service ${serviceName}`,
      instance: { url, id },
      timestamp: new Date().toISOString()
    });
  })
);

router.delete('/admin/services/:serviceName/instances/:instanceId',
  authentication.required,
  authentication.authorize(['admin']),
  param('serviceName').isAlphanumeric(),
  param('instanceId').isString(),
  validateRequest,
  asyncHandler(async (req, res) => {
    const { serviceName, instanceId } = req.params;
    
    serviceDiscovery.removeServiceInstance(serviceName, instanceId);
    
    res.json({
      message: `Instance ${instanceId} removed from service ${serviceName}`,
      timestamp: new Date().toISOString()
    });
  })
);

// Cache management endpoints
router.post('/admin/cache/invalidate',
  authentication.required,
  authentication.authorize(['admin']),
  body('pattern').isString().withMessage('Pattern is required'),
  validateRequest,
  asyncHandler(async (req, res) => {
    const { pattern } = req.body;
    
    await proxyService.invalidateCache(pattern);
    
    res.json({
      message: `Cache invalidated for pattern: ${pattern}`,
      timestamp: new Date().toISOString()
    });
  })
);

// Circuit breaker status
router.get('/admin/circuit-breakers',
  authentication.required,
  authentication.authorize(['admin']),
  asyncHandler(async (req, res) => {
    const status = proxyService.getCircuitBreakerStatus();
    res.json({
      circuitBreakers: status,
      timestamp: new Date().toISOString()
    });
  })
);

// Service statistics
router.get('/admin/services/:serviceName/stats',
  authentication.required,
  authentication.authorize(['admin']),
  param('serviceName').isAlphanumeric(),
  validateRequest,
  asyncHandler(async (req, res) => {
    const { serviceName } = req.params;
    const stats = serviceDiscovery.getServiceStats(serviceName);
    
    if (!stats) {
      return res.status(404).json({
        error: 'Service not found',
        message: `Service '${serviceName}' is not registered`
      });
    }
    
    res.json({
      stats,
      timestamp: new Date().toISOString()
    });
  })
);

// Batch request endpoint
router.post('/batch',
  authentication.optional,
  body('requests').isArray().withMessage('Requests must be an array'),
  body('requests.*.service').isString().withMessage('Service name is required'),
  body('requests.*.path').isString().withMessage('Path is required'),
  body('requests.*.method').optional().isIn(['GET', 'POST', 'PUT', 'DELETE', 'PATCH']),
  validateRequest,
  asyncHandler(async (req, res) => {
    const { requests } = req.body;
    
    if (requests.length > 10) {
      throw new ValidationError('Maximum 10 requests allowed in batch');
    }
    
    const results = await Promise.allSettled(
      requests.map(async (request, index) => {
        try {
          const response = await proxyService.makeRequest(
            request.service,
            request.path,
            {
              method: request.method || 'GET',
              data: request.data,
              headers: req.headers,
              timeout: 10000,
              retries: 1
            }
          );
          
          return {
            index,
            status: 'fulfilled',
            data: response.data,
            statusCode: response.status
          };
        } catch (error) {
          return {
            index,
            status: 'rejected',
            error: error.message,
            statusCode: error.status || 500
          };
        }
      })
    );
    
    res.json({
      results: results.map(result => result.value),
      timestamp: new Date().toISOString()
    });
  })
);

module.exports = router;