const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const config = require('../config/default');
const logger = require('./utils/logger');
const redisClient = require('./utils/redis');
const { middleware: monitoring } = require('./middleware/monitoring');
const { errorHandler } = require('./middleware/errorHandler');
const requestLogger = require('./middleware/requestLogger');
const authentication = require('./middleware/authentication');
const gatewayRoutes = require('./routes/gateway');
const healthRoutes = require('./routes/health');
const metricsRoutes = require('./routes/metrics');

class APIGateway {
  constructor() {
    this.app = express();
    this.server = null;
    this.setupMiddleware();
    this.setupRoutes();
    this.setupErrorHandling();
  }

  setupMiddleware() {
    // Security middleware
    this.app.use(helmet(config.security.helmet));
    
    // CORS middleware
    this.app.use(cors(config.cors));
    
    // Compression middleware
    this.app.use(compression());
    
    // Body parsing middleware
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));
    
    // Request logging middleware
    this.app.use(requestLogger);
    
    // Rate limiting middleware
    const limiter = rateLimit(config.rateLimit);
    this.app.use(limiter);
    
    // Monitoring middleware
    if (config.monitoring.enabled) {
      this.app.use(monitoring);
    }
    
    // Authentication middleware (applied selectively in routes)
    this.app.use('/api', authentication.optional);
    
    logger.info('Middleware setup completed');
  }

  setupRoutes() {
    // Health check routes
    this.app.use(config.monitoring.healthPath, healthRoutes);
    
    // Metrics routes
    if (config.monitoring.enabled) {
      this.app.use(config.monitoring.metricsPath, metricsRoutes);
    }
    
    // API Gateway routes
    this.app.use('/api', gatewayRoutes);
    
    // Root route
    this.app.get('/', (req, res) => {
      res.json({
        name: 'API Gateway',
        version: '1.0.0',
        status: 'running',
        timestamp: new Date().toISOString(),
        environment: config.server.environment
      });
    });
    
    // 404 handler
    this.app.use('*', (req, res) => {
      res.status(404).json({
        error: 'Route not found',
        path: req.originalUrl,
        method: req.method,
        timestamp: new Date().toISOString()
      });
    });
    
    logger.info('Routes setup completed');
  }

  setupErrorHandling() {
    this.app.use(errorHandler);
    logger.info('Error handling setup completed');
  }

  async start() {
    try {
      // Initialize Redis connection
      await redisClient.connect();
      logger.info('Redis connection established');
      
      // Start the server
      this.server = this.app.listen(config.server.port, config.server.host, () => {
        logger.info(`API Gateway started on ${config.server.host}:${config.server.port}`);
        logger.info(`Environment: ${config.server.environment}`);
        logger.info(`Health check: http://${config.server.host}:${config.server.port}${config.monitoring.healthPath}`);
        if (config.monitoring.enabled) {
          logger.info(`Metrics: http://${config.server.host}:${config.server.port}${config.monitoring.metricsPath}`);
        }
      });
      
      // Handle server errors
      this.server.on('error', (error) => {
        logger.error('Server error:', error);
        process.exit(1);
      });
      
    } catch (error) {
      logger.error('Failed to start API Gateway:', error);
      process.exit(1);
    }
  }

  async stop() {
    try {
      if (this.server) {
        await new Promise((resolve) => {
          this.server.close(resolve);
        });
        logger.info('Server stopped');
      }
      
      await redisClient.disconnect();
      logger.info('Redis connection closed');
      
    } catch (error) {
      logger.error('Error stopping API Gateway:', error);
    }
  }
}

// Handle graceful shutdown
const gateway = new APIGateway();

process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down gracefully');
  await gateway.stop();
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('SIGINT received, shutting down gracefully');
  await gateway.stop();
  process.exit(0);
});

process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Start the gateway
if (require.main === module) {
  gateway.start();
}

module.exports = gateway;