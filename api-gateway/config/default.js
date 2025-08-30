module.exports = {
  // Server Configuration
  server: {
    port: process.env.PORT || 8080,
    host: process.env.HOST || '0.0.0.0',
    environment: process.env.NODE_ENV || 'development'
  },

  // Redis Configuration
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD || '',
    db: process.env.REDIS_DB || 0,
    ttl: process.env.REDIS_TTL || 3600 // 1 hour
  },

  // JWT Configuration
  jwt: {
    secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
    issuer: process.env.JWT_ISSUER || 'api-gateway',
    audience: process.env.JWT_AUDIENCE || 'api-clients'
  },

  // Rate Limiting Configuration
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false
  },

  // CORS Configuration
  cors: {
    origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : ['http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-API-Key'],
    credentials: true
  },

  // Logging Configuration
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    format: process.env.LOG_FORMAT || 'combined',
    directory: process.env.LOG_DIRECTORY || './logs',
    filename: process.env.LOG_FILENAME || 'api-gateway-%DATE%.log',
    maxSize: process.env.LOG_MAX_SIZE || '20m',
    maxFiles: process.env.LOG_MAX_FILES || '14d'
  },

  // Monitoring Configuration
  monitoring: {
    enabled: process.env.MONITORING_ENABLED === 'true' || true,
    metricsPath: process.env.METRICS_PATH || '/metrics',
    healthPath: process.env.HEALTH_PATH || '/health'
  },

  // Service Discovery Configuration
  services: {
    // Example service configurations
    userService: {
      name: 'user-service',
      baseUrl: process.env.USER_SERVICE_URL || 'http://localhost:3001',
      timeout: parseInt(process.env.USER_SERVICE_TIMEOUT) || 5000,
      retries: parseInt(process.env.USER_SERVICE_RETRIES) || 3,
      healthCheck: '/health'
    },
    orderService: {
      name: 'order-service',
      baseUrl: process.env.ORDER_SERVICE_URL || 'http://localhost:3002',
      timeout: parseInt(process.env.ORDER_SERVICE_TIMEOUT) || 5000,
      retries: parseInt(process.env.ORDER_SERVICE_RETRIES) || 3,
      healthCheck: '/health'
    },
    paymentService: {
      name: 'payment-service',
      baseUrl: process.env.PAYMENT_SERVICE_URL || 'http://localhost:3003',
      timeout: parseInt(process.env.PAYMENT_SERVICE_TIMEOUT) || 5000,
      retries: parseInt(process.env.PAYMENT_SERVICE_RETRIES) || 3,
      healthCheck: '/health'
    }
  },

  // Load Balancing Configuration
  loadBalancing: {
    strategy: process.env.LOAD_BALANCE_STRATEGY || 'round-robin', // round-robin, least-connections, random
    healthCheckInterval: parseInt(process.env.HEALTH_CHECK_INTERVAL) || 30000 // 30 seconds
  },

  // Cache Configuration
  cache: {
    enabled: process.env.CACHE_ENABLED === 'true' || true,
    defaultTTL: parseInt(process.env.CACHE_DEFAULT_TTL) || 300, // 5 minutes
    maxSize: parseInt(process.env.CACHE_MAX_SIZE) || 1000
  },

  // Security Configuration
  security: {
    helmet: {
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", "data:", "https:"]
        }
      },
      hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true
      }
    },
    apiKey: {
      enabled: process.env.API_KEY_ENABLED === 'true' || false,
      header: process.env.API_KEY_HEADER || 'X-API-Key'
    }
  },

  // Circuit Breaker Configuration
  circuitBreaker: {
    enabled: process.env.CIRCUIT_BREAKER_ENABLED === 'true' || true,
    threshold: parseInt(process.env.CIRCUIT_BREAKER_THRESHOLD) || 5,
    timeout: parseInt(process.env.CIRCUIT_BREAKER_TIMEOUT) || 60000, // 1 minute
    resetTimeout: parseInt(process.env.CIRCUIT_BREAKER_RESET_TIMEOUT) || 30000 // 30 seconds
  }
};