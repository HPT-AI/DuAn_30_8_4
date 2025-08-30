const axios = require('axios');
const { createProxyMiddleware } = require('http-proxy-middleware');
const config = require('../../config/default');
const logger = require('../utils/logger');
const redisClient = require('../utils/redis');
const { serviceDiscovery } = require('./serviceDiscovery');
const { metrics, performanceMonitor } = require('../middleware/monitoring');
const { TimeoutError, ServiceUnavailableError } = require('../middleware/errorHandler');

class ProxyService {
  constructor() {
    this.cache = new Map();
    this.circuitBreakers = new Map();
  }

  // Create proxy middleware for a service
  createProxy(serviceName, options = {}) {
    return createProxyMiddleware({
      target: '', // Will be set dynamically
      changeOrigin: true,
      pathRewrite: options.pathRewrite || {},
      timeout: options.timeout || 30000,
      
      // Dynamic target selection with load balancing
      router: (req) => {
        const instance = serviceDiscovery.getServiceInstance(serviceName);
        if (!instance) {
          throw new ServiceUnavailableError(`No healthy instances available for service: ${serviceName}`);
        }
        
        // Track connection for load balancing
        const loadBalancer = serviceDiscovery.loadBalancers.get(serviceName);
        if (loadBalancer) {
          loadBalancer.addConnection(instance.id);
          
          // Remove connection when request completes
          req.on('close', () => {
            loadBalancer.removeConnection(instance.id);
          });
        }
        
        logger.debug(`Routing request to ${serviceName}: ${instance.url}`);
        return instance.url;
      },
      
      // Handle proxy errors
      onError: (err, req, res) => {
        logger.error(`Proxy error for ${serviceName}:`, err);
        metrics.recordError('proxy', serviceName, err.code || 'PROXY_ERROR');
        
        if (!res.headersSent) {
          res.status(502).json({
            error: 'Bad Gateway',
            message: `Service ${serviceName} is currently unavailable`,
            requestId: req.requestId,
            timestamp: new Date().toISOString()
          });
        }
      },
      
      // Handle proxy response
      onProxyRes: (proxyRes, req, res) => {
        // Add service information to response headers
        res.setHeader('X-Proxied-By', 'API-Gateway');
        res.setHeader('X-Service-Name', serviceName);
        
        // Log successful proxy
        logger.debug(`Proxy response from ${serviceName}: ${proxyRes.statusCode}`);
      }
    });
  }

  // Make HTTP request with retry logic
  async makeRequest(serviceName, path, options = {}) {
    const {
      method = 'GET',
      data = null,
      headers = {},
      timeout = 30000,
      retries = 3,
      cache = false,
      cacheTTL = 300
    } = options;

    // Check circuit breaker
    if (this.isCircuitOpen(serviceName)) {
      throw new ServiceUnavailableError(`Circuit breaker is open for service: ${serviceName}`);
    }

    // Check cache first
    if (cache && method === 'GET') {
      const cacheKey = `${serviceName}:${path}:${JSON.stringify(options.params || {})}`;
      const cachedResponse = await this.getCachedResponse(cacheKey);
      if (cachedResponse) {
        metrics.recordCacheHit('response', cacheKey);
        return cachedResponse;
      }
      metrics.recordCacheMiss('response', cacheKey);
    }

    let lastError;
    let attempt = 0;

    while (attempt <= retries) {
      try {
        const instance = serviceDiscovery.getServiceInstance(serviceName);
        if (!instance) {
          throw new ServiceUnavailableError(`No healthy instances available for service: ${serviceName}`);
        }

        const url = `${instance.url}${path}`;
        const requestConfig = {
          method,
          url,
          data,
          headers: {
            'X-Request-ID': headers['X-Request-ID'] || 'unknown',
            'X-Forwarded-By': 'API-Gateway',
            ...headers
          },
          timeout,
          validateStatus: (status) => status < 500 // Don't throw on 4xx errors
        };

        logger.debug(`Making request to ${serviceName}: ${method} ${url}`);
        
        const startTime = Date.now();
        const response = await axios(requestConfig);
        const responseTime = Date.now() - startTime;

        // Update instance response time
        instance.responseTime = responseTime;

        // Record metrics
        metrics.observeHistogram('api_gateway_service_request_duration_seconds', responseTime / 1000, {
          service: serviceName,
          method,
          status_code: response.status
        });

        // Cache successful GET responses
        if (cache && method === 'GET' && response.status < 400) {
          const cacheKey = `${serviceName}:${path}:${JSON.stringify(options.params || {})}`;
          await this.setCachedResponse(cacheKey, response.data, cacheTTL);
        }

        // Reset circuit breaker on success
        this.resetCircuitBreaker(serviceName);

        return {
          data: response.data,
          status: response.status,
          headers: response.headers,
          responseTime
        };

      } catch (error) {
        lastError = error;
        attempt++;

        // Record error
        metrics.recordError('request', serviceName, error.code || 'REQUEST_ERROR');

        // Update circuit breaker
        this.recordFailure(serviceName);

        if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
          logger.warn(`Request timeout for ${serviceName}, attempt ${attempt}/${retries + 1}`);
        } else {
          logger.warn(`Request failed for ${serviceName}, attempt ${attempt}/${retries + 1}:`, error.message);
        }

        // Don't retry on 4xx errors (client errors)
        if (error.response && error.response.status >= 400 && error.response.status < 500) {
          break;
        }

        // Wait before retry (exponential backoff)
        if (attempt <= retries) {
          const delay = Math.min(1000 * Math.pow(2, attempt - 1), 10000);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }

    // All retries failed
    if (lastError.code === 'ECONNABORTED' || lastError.code === 'ETIMEDOUT') {
      throw new TimeoutError(`Request to ${serviceName} timed out after ${retries + 1} attempts`);
    }

    throw new ServiceUnavailableError(`Service ${serviceName} is unavailable after ${retries + 1} attempts: ${lastError.message}`);
  }

  // Circuit breaker implementation
  isCircuitOpen(serviceName) {
    const breaker = this.circuitBreakers.get(serviceName);
    if (!breaker) return false;

    if (breaker.state === 'open') {
      // Check if we should try to close the circuit
      if (Date.now() - breaker.lastFailureTime > config.circuitBreaker.resetTimeout) {
        breaker.state = 'half-open';
        logger.info(`Circuit breaker for ${serviceName} is now half-open`);
      }
      return breaker.state === 'open';
    }

    return false;
  }

  recordFailure(serviceName) {
    if (!config.circuitBreaker.enabled) return;

    let breaker = this.circuitBreakers.get(serviceName);
    if (!breaker) {
      breaker = {
        failures: 0,
        lastFailureTime: null,
        state: 'closed' // closed, open, half-open
      };
      this.circuitBreakers.set(serviceName, breaker);
    }

    breaker.failures++;
    breaker.lastFailureTime = Date.now();

    if (breaker.failures >= config.circuitBreaker.threshold) {
      breaker.state = 'open';
      logger.warn(`Circuit breaker opened for ${serviceName} after ${breaker.failures} failures`);
    }
  }

  resetCircuitBreaker(serviceName) {
    const breaker = this.circuitBreakers.get(serviceName);
    if (breaker) {
      breaker.failures = 0;
      breaker.state = 'closed';
      logger.info(`Circuit breaker reset for ${serviceName}`);
    }
  }

  // Cache management
  async getCachedResponse(key) {
    try {
      return await redisClient.cacheGet(key);
    } catch (error) {
      logger.error('Cache get error:', error);
      return null;
    }
  }

  async setCachedResponse(key, data, ttl) {
    try {
      await redisClient.cacheSet(key, data, ttl);
    } catch (error) {
      logger.error('Cache set error:', error);
    }
  }

  async invalidateCache(pattern) {
    try {
      // In a real implementation, you would use Redis SCAN to find matching keys
      // For now, we'll just clear the local cache
      this.cache.clear();
      logger.info(`Cache invalidated for pattern: ${pattern}`);
    } catch (error) {
      logger.error('Cache invalidation error:', error);
    }
  }

  // Request transformation
  transformRequest(req, serviceName) {
    const transformed = {
      method: req.method,
      headers: { ...req.headers },
      data: req.body,
      params: req.query
    };

    // Remove hop-by-hop headers
    delete transformed.headers.connection;
    delete transformed.headers['proxy-connection'];
    delete transformed.headers['transfer-encoding'];
    delete transformed.headers.upgrade;

    // Add gateway headers
    transformed.headers['X-Forwarded-By'] = 'API-Gateway';
    transformed.headers['X-Service-Name'] = serviceName;
    transformed.headers['X-Request-ID'] = req.requestId;

    // Add user context if available
    if (req.user) {
      transformed.headers['X-User-ID'] = req.user.userId || req.user.id;
      transformed.headers['X-User-Roles'] = JSON.stringify(req.user.roles || []);
    }

    return transformed;
  }

  // Response transformation
  transformResponse(response, serviceName) {
    const transformed = {
      data: response.data,
      status: response.status,
      headers: { ...response.headers }
    };

    // Add gateway headers
    transformed.headers['X-Proxied-By'] = 'API-Gateway';
    transformed.headers['X-Service-Name'] = serviceName;

    return transformed;
  }

  // Get circuit breaker status
  getCircuitBreakerStatus() {
    const status = {};
    this.circuitBreakers.forEach((breaker, serviceName) => {
      status[serviceName] = {
        state: breaker.state,
        failures: breaker.failures,
        lastFailureTime: breaker.lastFailureTime
      };
    });
    return status;
  }

  // Health check for proxy service
  async healthCheck() {
    const services = serviceDiscovery.getAllServices();
    const health = {
      status: 'healthy',
      services: {},
      circuitBreakers: this.getCircuitBreakerStatus(),
      timestamp: new Date().toISOString()
    };

    let hasUnhealthyService = false;

    Object.entries(services).forEach(([name, service]) => {
      const healthyCount = service.healthyCount;
      const totalCount = service.totalCount;
      const isHealthy = healthyCount > 0;

      health.services[name] = {
        healthy: isHealthy,
        instances: {
          total: totalCount,
          healthy: healthyCount,
          unhealthy: totalCount - healthyCount
        }
      };

      if (!isHealthy) {
        hasUnhealthyService = true;
      }
    });

    if (hasUnhealthyService) {
      health.status = 'degraded';
    }

    return health;
  }
}

module.exports = new ProxyService();