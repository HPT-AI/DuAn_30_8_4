const express = require('express');
const mongoose = require('mongoose');
const redis = require('redis');

const router = express.Router();

// Health check endpoint
router.get('/', async (req, res) => {
  const healthCheck = {
    service: 'user-service',
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: process.env.SERVICE_VERSION || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    checks: {
      database: 'unknown',
      redis: 'unknown',
      memory: 'unknown'
    }
  };

  try {
    // Check MongoDB connection
    if (mongoose.connection.readyState === 1) {
      healthCheck.checks.database = 'healthy';
    } else {
      healthCheck.checks.database = 'unhealthy';
      healthCheck.status = 'unhealthy';
    }

    // Check Redis connection (if configured)
    if (process.env.REDIS_URL) {
      try {
        const redisClient = redis.createClient({
          url: process.env.REDIS_URL
        });
        
        await redisClient.connect();
        await redisClient.ping();
        await redisClient.disconnect();
        
        healthCheck.checks.redis = 'healthy';
      } catch (redisError) {
        healthCheck.checks.redis = 'unhealthy';
        healthCheck.status = 'degraded';
      }
    } else {
      healthCheck.checks.redis = 'not_configured';
    }

    // Check memory usage
    const memUsage = process.memoryUsage();
    const memUsageMB = {
      rss: Math.round(memUsage.rss / 1024 / 1024),
      heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024),
      heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024),
      external: Math.round(memUsage.external / 1024 / 1024)
    };

    healthCheck.checks.memory = {
      status: memUsageMB.heapUsed < 500 ? 'healthy' : 'warning',
      usage: memUsageMB
    };

    // Set overall status based on critical checks
    if (healthCheck.checks.database === 'unhealthy') {
      healthCheck.status = 'unhealthy';
    } else if (healthCheck.checks.redis === 'unhealthy') {
      healthCheck.status = 'degraded';
    }

    const statusCode = healthCheck.status === 'healthy' ? 200 : 
                      healthCheck.status === 'degraded' ? 200 : 503;

    res.status(statusCode).json(healthCheck);

  } catch (error) {
    healthCheck.status = 'unhealthy';
    healthCheck.error = error.message;
    res.status(503).json(healthCheck);
  }
});

// Readiness check endpoint
router.get('/ready', async (req, res) => {
  try {
    // Check if database is ready
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        status: 'not_ready',
        message: 'Database not connected'
      });
    }

    // Perform a simple database query
    await mongoose.connection.db.admin().ping();

    res.json({
      status: 'ready',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    res.status(503).json({
      status: 'not_ready',
      error: error.message
    });
  }
});

// Liveness check endpoint
router.get('/live', (req, res) => {
  res.json({
    status: 'alive',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

module.exports = router;