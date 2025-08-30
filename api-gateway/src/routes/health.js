const express = require('express');
const { asyncHandler } = require('../middleware/errorHandler');
const { serviceDiscovery } = require('../services/serviceDiscovery');
const proxyService = require('../services/proxyService');
const redisClient = require('../utils/redis');
const { healthMetrics } = require('../middleware/monitoring');
const logger = require('../utils/logger');

const router = express.Router();

// Basic health check
router.get('/', asyncHandler(async (req, res) => {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  };

  res.json(health);
}));

// Detailed health check
router.get('/detailed', asyncHandler(async (req, res) => {
  const startTime = Date.now();
  
  // Check Redis connection
  const redisHealth = await checkRedisHealth();
  
  // Check services health
  const servicesHealth = await checkServicesHealth();
  
  // Get system metrics
  const systemHealth = healthMetrics.getSystemHealth();
  
  // Get proxy service health
  const proxyHealth = await proxyService.healthCheck();
  
  const responseTime = Date.now() - startTime;
  
  const overallStatus = determineOverallStatus([
    redisHealth.status,
    servicesHealth.status,
    proxyHealth.status
  ]);
  
  const health = {
    status: overallStatus,
    timestamp: new Date().toISOString(),
    responseTime: `${responseTime}ms`,
    uptime: process.uptime(),
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    components: {
      redis: redisHealth,
      services: servicesHealth,
      proxy: proxyHealth,
      system: {
        status: 'healthy',
        ...systemHealth
      }
    }
  };

  const statusCode = overallStatus === 'healthy' ? 200 : 
                    overallStatus === 'degraded' ? 200 : 503;
  
  res.status(statusCode).json(health);
}));

// Liveness probe (for Kubernetes)
router.get('/live', asyncHandler(async (req, res) => {
  // Simple check to see if the application is running
  res.json({
    status: 'alive',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
}));

// Readiness probe (for Kubernetes)
router.get('/ready', asyncHandler(async (req, res) => {
  const checks = [];
  
  // Check Redis connection
  const redisReady = await checkRedisHealth();
  checks.push(redisReady.status === 'healthy');
  
  // Check if at least one service is available
  const services = serviceDiscovery.getAllServices();
  const hasHealthyService = Object.values(services).some(service => 
    service.healthyCount > 0
  );
  checks.push(hasHealthyService);
  
  const isReady = checks.every(check => check);
  
  const response = {
    status: isReady ? 'ready' : 'not_ready',
    timestamp: new Date().toISOString(),
    checks: {
      redis: redisReady.status === 'healthy',
      services: hasHealthyService
    }
  };
  
  res.status(isReady ? 200 : 503).json(response);
}));

// Service-specific health check
router.get('/services/:serviceName', asyncHandler(async (req, res) => {
  const { serviceName } = req.params;
  const service = serviceDiscovery.services.get(serviceName);
  
  if (!service) {
    return res.status(404).json({
      error: 'Service not found',
      message: `Service '${serviceName}' is not registered`,
      availableServices: Array.from(serviceDiscovery.services.keys())
    });
  }
  
  const healthyInstances = service.instances.filter(instance => instance.healthy);
  const unhealthyInstances = service.instances.filter(instance => !instance.healthy);
  
  const status = healthyInstances.length > 0 ? 'healthy' : 
                unhealthyInstances.length > 0 ? 'unhealthy' : 'unknown';
  
  const health = {
    service: serviceName,
    status,
    timestamp: new Date().toISOString(),
    instances: {
      total: service.instances.length,
      healthy: healthyInstances.length,
      unhealthy: unhealthyInstances.length
    },
    details: service.instances.map(instance => ({
      id: instance.id,
      url: instance.url,
      healthy: instance.healthy,
      lastHealthCheck: instance.lastHealthCheck,
      responseTime: instance.responseTime,
      errorCount: instance.errorCount
    }))
  };
  
  const statusCode = status === 'healthy' ? 200 : 503;
  res.status(statusCode).json(health);
}));

// Dependency health check
router.get('/dependencies', asyncHandler(async (req, res) => {
  const dependencies = {
    redis: await checkRedisHealth(),
    services: await checkServicesHealth()
  };
  
  const overallStatus = determineOverallStatus([
    dependencies.redis.status,
    dependencies.services.status
  ]);
  
  res.json({
    status: overallStatus,
    timestamp: new Date().toISOString(),
    dependencies
  });
}));

// Performance metrics health
router.get('/performance', asyncHandler(async (req, res) => {
  const systemHealth = healthMetrics.getSystemHealth();
  const metricsSummary = await healthMetrics.getMetricsSummary();
  
  // Calculate performance indicators
  const memoryUsagePercent = (systemHealth.memory.heapUsed / systemHealth.memory.heapTotal) * 100;
  const performanceStatus = memoryUsagePercent > 90 ? 'critical' :
                           memoryUsagePercent > 70 ? 'warning' : 'healthy';
  
  res.json({
    status: performanceStatus,
    timestamp: new Date().toISOString(),
    performance: {
      memory: {
        ...systemHealth.memory,
        usagePercent: Math.round(memoryUsagePercent * 100) / 100
      },
      cpu: systemHealth.cpu,
      uptime: systemHealth.uptime
    },
    metrics: metricsSummary
  });
}));

// Helper functions
async function checkRedisHealth() {
  try {
    if (!redisClient.isConnected) {
      return {
        status: 'unhealthy',
        message: 'Redis not connected',
        error: 'Connection not established'
      };
    }
    
    // Test Redis with a simple operation
    const testKey = 'health_check_test';
    const testValue = Date.now().toString();
    
    await redisClient.set(testKey, testValue, 10); // 10 seconds TTL
    const retrievedValue = await redisClient.get(testKey);
    
    if (retrievedValue === testValue) {
      await redisClient.del(testKey);
      return {
        status: 'healthy',
        message: 'Redis connection is working',
        responseTime: '< 10ms'
      };
    } else {
      return {
        status: 'unhealthy',
        message: 'Redis read/write test failed',
        error: 'Data integrity issue'
      };
    }
  } catch (error) {
    logger.error('Redis health check failed:', error);
    return {
      status: 'unhealthy',
      message: 'Redis health check failed',
      error: error.message
    };
  }
}

async function checkServicesHealth() {
  try {
    const services = serviceDiscovery.getAllServices();
    const serviceHealths = {};
    let healthyServices = 0;
    let totalServices = 0;
    
    Object.entries(services).forEach(([name, service]) => {
      totalServices++;
      const isHealthy = service.healthyCount > 0;
      
      if (isHealthy) {
        healthyServices++;
      }
      
      serviceHealths[name] = {
        status: isHealthy ? 'healthy' : 'unhealthy',
        instances: {
          total: service.totalCount,
          healthy: service.healthyCount,
          unhealthy: service.totalCount - service.healthyCount
        }
      };
    });
    
    const overallStatus = healthyServices === totalServices ? 'healthy' :
                         healthyServices > 0 ? 'degraded' : 'unhealthy';
    
    return {
      status: overallStatus,
      message: `${healthyServices}/${totalServices} services are healthy`,
      services: serviceHealths,
      summary: {
        total: totalServices,
        healthy: healthyServices,
        unhealthy: totalServices - healthyServices
      }
    };
  } catch (error) {
    logger.error('Services health check failed:', error);
    return {
      status: 'unhealthy',
      message: 'Services health check failed',
      error: error.message
    };
  }
}

function determineOverallStatus(statuses) {
  if (statuses.every(status => status === 'healthy')) {
    return 'healthy';
  } else if (statuses.some(status => status === 'healthy')) {
    return 'degraded';
  } else {
    return 'unhealthy';
  }
}

module.exports = router;