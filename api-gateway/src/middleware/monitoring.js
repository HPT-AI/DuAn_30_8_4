const promClient = require('prom-client');
const logger = require('../utils/logger');

// Create a Registry to register the metrics
const register = new promClient.Registry();

// Add default metrics
promClient.collectDefaultMetrics({
  register,
  prefix: 'api_gateway_'
});

// Custom metrics
const httpRequestsTotal = new promClient.Counter({
  name: 'api_gateway_http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code', 'service'],
  registers: [register]
});

const httpRequestDuration = new promClient.Histogram({
  name: 'api_gateway_http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code', 'service'],
  buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10],
  registers: [register]
});

const activeConnections = new promClient.Gauge({
  name: 'api_gateway_active_connections',
  help: 'Number of active connections',
  registers: [register]
});

const serviceHealthStatus = new promClient.Gauge({
  name: 'api_gateway_service_health_status',
  help: 'Health status of backend services (1 = healthy, 0 = unhealthy)',
  labelNames: ['service', 'endpoint'],
  registers: [register]
});

const rateLimitHits = new promClient.Counter({
  name: 'api_gateway_rate_limit_hits_total',
  help: 'Total number of rate limit hits',
  labelNames: ['ip', 'endpoint'],
  registers: [register]
});

const cacheHits = new promClient.Counter({
  name: 'api_gateway_cache_hits_total',
  help: 'Total number of cache hits',
  labelNames: ['type', 'key'],
  registers: [register]
});

const cacheMisses = new promClient.Counter({
  name: 'api_gateway_cache_misses_total',
  help: 'Total number of cache misses',
  labelNames: ['type', 'key'],
  registers: [register]
});

const errorRate = new promClient.Counter({
  name: 'api_gateway_errors_total',
  help: 'Total number of errors',
  labelNames: ['type', 'service', 'error_code'],
  registers: [register]
});

// Middleware function
const monitoringMiddleware = (req, res, next) => {
  const startTime = Date.now();
  
  // Increment active connections
  activeConnections.inc();
  
  // Override res.end to capture metrics
  const originalEnd = res.end;
  res.end = function(...args) {
    const endTime = Date.now();
    const duration = (endTime - startTime) / 1000;
    
    // Extract service name from route
    const service = req.route?.path?.split('/')[2] || 'unknown';
    const route = req.route?.path || req.path;
    
    // Record metrics
    httpRequestsTotal.inc({
      method: req.method,
      route: route,
      status_code: res.statusCode,
      service: service
    });
    
    httpRequestDuration.observe({
      method: req.method,
      route: route,
      status_code: res.statusCode,
      service: service
    }, duration);
    
    // Decrement active connections
    activeConnections.dec();
    
    // Log request
    logger.logRequest(req, res, endTime - startTime);
    
    // Call original end function
    originalEnd.apply(this, args);
  };
  
  next();
};

// Metrics collection functions
const metrics = {
  register,
  
  // Record service health
  recordServiceHealth(serviceName, endpoint, isHealthy) {
    serviceHealthStatus.set(
      { service: serviceName, endpoint: endpoint },
      isHealthy ? 1 : 0
    );
  },
  
  // Record rate limit hit
  recordRateLimitHit(ip, endpoint) {
    rateLimitHits.inc({ ip, endpoint });
  },
  
  // Record cache hit
  recordCacheHit(type, key) {
    cacheHits.inc({ type, key });
  },
  
  // Record cache miss
  recordCacheMiss(type, key) {
    cacheMisses.inc({ type, key });
  },
  
  // Record error
  recordError(type, service, errorCode) {
    errorRate.inc({ type, service, error_code: errorCode });
  },
  
  // Get all metrics
  async getMetrics() {
    return await register.metrics();
  },
  
  // Reset all metrics
  resetMetrics() {
    register.resetMetrics();
  },
  
  // Get specific metric
  getMetric(name) {
    return register.getSingleMetric(name);
  },
  
  // Custom metric helpers
  incrementCounter(name, labels = {}) {
    const metric = register.getSingleMetric(name);
    if (metric && typeof metric.inc === 'function') {
      metric.inc(labels);
    }
  },
  
  setGauge(name, value, labels = {}) {
    const metric = register.getSingleMetric(name);
    if (metric && typeof metric.set === 'function') {
      metric.set(labels, value);
    }
  },
  
  observeHistogram(name, value, labels = {}) {
    const metric = register.getSingleMetric(name);
    if (metric && typeof metric.observe === 'function') {
      metric.observe(labels, value);
    }
  }
};

// Performance monitoring class
class PerformanceMonitor {
  constructor() {
    this.timers = new Map();
  }
  
  startTimer(id) {
    this.timers.set(id, Date.now());
  }
  
  endTimer(id) {
    const startTime = this.timers.get(id);
    if (startTime) {
      const duration = Date.now() - startTime;
      this.timers.delete(id);
      return duration;
    }
    return 0;
  }
  
  measureAsync(id, asyncFunction) {
    return async (...args) => {
      this.startTimer(id);
      try {
        const result = await asyncFunction(...args);
        const duration = this.endTimer(id);
        logger.info(`Performance: ${id} took ${duration}ms`);
        return result;
      } catch (error) {
        this.endTimer(id);
        throw error;
      }
    };
  }
}

const performanceMonitor = new PerformanceMonitor();

// Health check metrics
const healthMetrics = {
  // System health
  getSystemHealth() {
    const memUsage = process.memoryUsage();
    const cpuUsage = process.cpuUsage();
    
    return {
      memory: {
        rss: memUsage.rss,
        heapTotal: memUsage.heapTotal,
        heapUsed: memUsage.heapUsed,
        external: memUsage.external,
        arrayBuffers: memUsage.arrayBuffers
      },
      cpu: {
        user: cpuUsage.user,
        system: cpuUsage.system
      },
      uptime: process.uptime(),
      version: process.version,
      platform: process.platform,
      arch: process.arch
    };
  },
  
  // Get current metrics summary
  async getMetricsSummary() {
    const metricsString = await register.metrics();
    const lines = metricsString.split('\n');
    const summary = {};
    
    lines.forEach(line => {
      if (line.startsWith('# HELP')) {
        const parts = line.split(' ');
        const metricName = parts[2];
        summary[metricName] = { help: parts.slice(3).join(' ') };
      } else if (line.startsWith('# TYPE')) {
        const parts = line.split(' ');
        const metricName = parts[2];
        if (summary[metricName]) {
          summary[metricName].type = parts[3];
        }
      } else if (line && !line.startsWith('#')) {
        const spaceIndex = line.indexOf(' ');
        if (spaceIndex > 0) {
          const metricPart = line.substring(0, spaceIndex);
          const value = parseFloat(line.substring(spaceIndex + 1));
          
          let metricName = metricPart;
          let labels = {};
          
          const braceIndex = metricPart.indexOf('{');
          if (braceIndex > 0) {
            metricName = metricPart.substring(0, braceIndex);
            const labelsString = metricPart.substring(braceIndex + 1, metricPart.length - 1);
            // Parse labels (simplified)
            labelsString.split(',').forEach(labelPair => {
              const [key, val] = labelPair.split('=');
              if (key && val) {
                labels[key.trim()] = val.trim().replace(/"/g, '');
              }
            });
          }
          
          if (!summary[metricName]) {
            summary[metricName] = { values: [] };
          }
          if (!summary[metricName].values) {
            summary[metricName].values = [];
          }
          summary[metricName].values.push({ labels, value });
        }
      }
    });
    
    return summary;
  }
};

module.exports = {
  middleware: monitoringMiddleware,
  metrics,
  performanceMonitor,
  healthMetrics
};