#!/bin/bash

# Script to create backend services structure
# Usage: ./create-services.sh

set -e

BACKEND_DIR="/workspace/DuAn_30_8/backend"

# Define services with their ports and descriptions
declare -A SERVICES=(
    ["user-service"]="3001:User authentication and management service (Authify)"
    ["content-service"]="3006:Content management and publishing service"
    ["payment-service"]="3002:Payment processing and billing service"
    ["admin-service"]="3004:Admin operations and management service"
    ["agent-policy-service"]="3003:Agent policy management service"
    ["agent-management-service"]="3005:Agent lifecycle management service"
)

# Botpress service is special - it uses existing Botpress image
BOTPRESS_PORT="3000"

echo "Creating backend services structure..."

# Create each service
for service in "${!SERVICES[@]}"; do
    IFS=':' read -r port description <<< "${SERVICES[$service]}"
    
    echo "Creating $service (port $port)..."
    
    # Create directory structure
    mkdir -p "$BACKEND_DIR/$service/src/"{controllers,models,routes,middleware,services,utils,config}
    mkdir -p "$BACKEND_DIR/$service/"{tests,docs,logs}
    
    # Create package.json
    cat > "$BACKEND_DIR/$service/package.json" << EOF
{
  "name": "$service",
  "version": "1.0.0",
  "description": "$description",
  "main": "src/app.js",
  "scripts": {
    "start": "node src/app.js",
    "dev": "nodemon src/app.js",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "lint": "eslint src/",
    "lint:fix": "eslint src/ --fix",
    "docker:build": "docker build -t $service .",
    "docker:run": "docker run -p $port:$port $service"
  },
  "keywords": [
    "microservice",
    "nodejs",
    "express",
    "api"
  ],
  "author": "HPT-AI",
  "license": "MIT",
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "helmet": "^7.1.0",
    "express-rate-limit": "^7.1.5",
    "dotenv": "^16.3.1",
    "winston": "^3.11.0",
    "joi": "^17.11.0",
    "mongoose": "^8.0.3",
    "redis": "^4.6.10",
    "uuid": "^9.0.1"
  },
  "devDependencies": {
    "nodemon": "^3.0.2",
    "jest": "^29.7.0",
    "supertest": "^6.3.3",
    "eslint": "^8.55.0"
  },
  "engines": {
    "node": ">=18.0.0",
    "npm": ">=8.0.0"
  }
}
EOF

    # Create Dockerfile
    cat > "$BACKEND_DIR/$service/Dockerfile" << EOF
# $service Dockerfile
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Change ownership of the app directory
RUN chown -R nodejs:nodejs /app
USER nodejs

# Expose port
EXPOSE $port

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \\
  CMD curl -f http://localhost:$port/api/health || exit 1

# Start the application
CMD ["npm", "start"]
EOF

    # Create .env template
    cat > "$BACKEND_DIR/$service/.env.example" << EOF
# $service Environment Variables
NODE_ENV=development
PORT=$port

# Database
MONGODB_URI=mongodb://localhost:27017/${service//-/_}
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=24h

# CORS
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:12000

# Logging
LOG_LEVEL=info
LOG_FILE=logs/app.log

# Service specific configurations
SERVICE_NAME=$service
SERVICE_VERSION=1.0.0
EOF

    # Create .dockerignore
    cat > "$BACKEND_DIR/$service/.dockerignore" << EOF
node_modules
npm-debug.log
.git
.gitignore
README.md
.env
.env.local
.env.development
.env.test
.env.production
coverage
.nyc_output
logs
*.log
.DS_Store
Thumbs.db
EOF

    # Create basic app.js
    cat > "$BACKEND_DIR/$service/src/app.js" << EOF
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const logger = require('./utils/logger');
const errorHandler = require('./middleware/errorHandler');

class $(echo $service | sed 's/-/ /g' | sed 's/\b\w/\U&/g' | sed 's/ //g') {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || $port;
    this.setupMiddleware();
    this.setupRoutes();
    this.setupErrorHandling();
  }

  setupMiddleware() {
    // Security middleware
    this.app.use(helmet());
    
    // CORS middleware
    this.app.use(cors({
      origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000', 'http://localhost:12000'],
      credentials: true
    }));
    
    // Rate limiting
    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
      message: 'Too many requests from this IP, please try again later.'
    });
    this.app.use(limiter);
    
    // Body parsing middleware
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));
    
    // Request logging
    this.app.use((req, res, next) => {
      logger.info(\`\${req.method} \${req.path} - \${req.ip}\`);
      next();
    });
  }

  setupRoutes() {
    // Health check route
    this.app.get('/api/health', (req, res) => {
      res.json({
        service: '$service',
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        version: process.env.SERVICE_VERSION || '1.0.0'
      });
    });
    
    // Root route
    this.app.get('/', (req, res) => {
      res.json({
        service: '$service',
        description: '$description',
        version: '1.0.0',
        status: 'running',
        timestamp: new Date().toISOString()
      });
    });
    
    // 404 handler
    this.app.use('*', (req, res) => {
      res.status(404).json({
        error: 'Route not found',
        path: req.originalUrl
      });
    });
  }

  setupErrorHandling() {
    this.app.use(errorHandler);
  }

  start() {
    this.app.listen(this.port, '0.0.0.0', () => {
      logger.info(\`$service running on port \${this.port}\`);
      logger.info(\`Environment: \${process.env.NODE_ENV || 'development'}\`);
    });
  }
}

// Start the service
const service = new $(echo $service | sed 's/-/ /g' | sed 's/\b\w/\U&/g' | sed 's/ //g')();
service.start();

module.exports = service.app;
EOF

    # Create logger utility
    cat > "$BACKEND_DIR/$service/src/utils/logger.js" << EOF
const winston = require('winston');
const path = require('path');

const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: logFormat,
  defaultMeta: { service: '$service' },
  transports: [
    new winston.transports.File({ 
      filename: path.join(__dirname, '../../logs/error.log'), 
      level: 'error' 
    }),
    new winston.transports.File({ 
      filename: path.join(__dirname, '../../logs/combined.log') 
    })
  ]
});

// Add console transport in development
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  }));
}

module.exports = logger;
EOF

    # Create error handler middleware
    cat > "$BACKEND_DIR/$service/src/middleware/errorHandler.js" << EOF
const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error
  logger.error(err);

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    error = { message, statusCode: 404 };
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    error = { message, statusCode: 400 };
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message);
    error = { message, statusCode: 400 };
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = errorHandler;
EOF

    # Create README
    cat > "$BACKEND_DIR/$service/README.md" << EOF
# $service

$description

## Features

- RESTful API endpoints
- JWT authentication integration
- Request validation
- Error handling
- Logging
- Health checks
- Docker support

## Installation

\`\`\`bash
npm install
\`\`\`

## Configuration

Copy \`.env.example\` to \`.env\` and configure your environment variables:

\`\`\`bash
cp .env.example .env
\`\`\`

## Development

\`\`\`bash
npm run dev
\`\`\`

## Production

\`\`\`bash
npm start
\`\`\`

## Docker

\`\`\`bash
# Build image
npm run docker:build

# Run container
npm run docker:run
\`\`\`

## API Endpoints

### Health Check
- \`GET /api/health\` - Service health status

### Service Info
- \`GET /\` - Service information

## Testing

\`\`\`bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
\`\`\`

## Linting

\`\`\`bash
# Check code style
npm run lint

# Fix code style issues
npm run lint:fix
\`\`\`

## Port

This service runs on port **$port**
EOF

    echo "✅ Created $service"
done

# Create Botpress service configuration
echo "Creating botpress-service configuration..."
mkdir -p "$BACKEND_DIR/botpress-service/config"

cat > "$BACKEND_DIR/botpress-service/README.md" << EOF
# Botpress Service

Chatbot and conversational AI service using Botpress.

## Features

- Conversational AI chatbot
- Multi-channel support
- Natural Language Processing
- Integration with other services
- Analytics and monitoring

## Configuration

This service uses the official Botpress Docker image.

## Port

This service runs on port **$BOTPRESS_PORT**

## Docker

The service is configured in docker-compose.yml to use the official Botpress image:

\`\`\`yaml
botpress:
  image: botpress/server:latest
  container_name: botpress-service
  ports:
    - "$BOTPRESS_PORT:3000"
  volumes:
    - ./backend/botpress-service/data:/botpress/data
    - ./backend/botpress-service/config:/botpress/config
  environment:
    - BP_HOST=0.0.0.0
    - BP_PORT=3000
\`\`\`

## API Endpoints

### Chatbot
- \`POST /api/v1/bots/{botId}/converse/{userId}\` - Send message to bot
- \`GET /api/v1/bots\` - List available bots

### Webhooks
- \`POST /api/v1/bots/{botId}/webhook\` - Webhook endpoint

For more information, see [Botpress Documentation](https://botpress.com/docs)
EOF

# Create shared utilities
echo "Creating shared utilities..."
mkdir -p "$BACKEND_DIR/shared/"{config,middleware,utils,models,database}

cat > "$BACKEND_DIR/shared/README.md" << EOF
# Shared Backend Utilities

Common utilities, configurations, and middleware shared across all backend services.

## Structure

- \`config/\` - Shared configuration files
- \`middleware/\` - Common middleware functions
- \`utils/\` - Utility functions and helpers
- \`models/\` - Shared data models
- \`database/\` - Database connection and migration utilities

## Usage

Services can import shared utilities:

\`\`\`javascript
const { logger } = require('../shared/utils');
const { authMiddleware } = require('../shared/middleware');
const { connectDB } = require('../shared/database');
\`\`\`
EOF

# Create docker-compose services section
cat > "$BACKEND_DIR/docker-compose.services.yml" << EOF
# Backend Services Configuration for docker-compose.yml
# Copy these service definitions to your main docker-compose.yml

services:
  # User Service (Authify)
  user-service:
    build:
      context: ./backend/user-service
      dockerfile: Dockerfile
    container_name: user-service
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=production
      - PORT=3001
      - MONGODB_URI=mongodb://mongo:27017/user_service
      - REDIS_URL=redis://redis:6379
      - JWT_SECRET=\${JWT_SECRET}
    depends_on:
      - mongo
      - redis
    networks:
      - khuongcuoicung-network
    restart: unless-stopped
    volumes:
      - ./backend/user-service/logs:/app/logs

  # Content Service
  content-service:
    build:
      context: ./backend/content-service
      dockerfile: Dockerfile
    container_name: content-service
    ports:
      - "3006:3006"
    environment:
      - NODE_ENV=production
      - PORT=3006
      - MONGODB_URI=mongodb://mongo:27017/content_service
      - REDIS_URL=redis://redis:6379
    depends_on:
      - mongo
      - redis
    networks:
      - khuongcuoicung-network
    restart: unless-stopped
    volumes:
      - ./backend/content-service/logs:/app/logs

  # Payment Service
  payment-service:
    build:
      context: ./backend/payment-service
      dockerfile: Dockerfile
    container_name: payment-service
    ports:
      - "3002:3002"
    environment:
      - NODE_ENV=production
      - PORT=3002
      - MONGODB_URI=mongodb://mongo:27017/payment_service
      - REDIS_URL=redis://redis:6379
    depends_on:
      - mongo
      - redis
    networks:
      - khuongcuoicung-network
    restart: unless-stopped
    volumes:
      - ./backend/payment-service/logs:/app/logs

  # Admin Service
  admin-service:
    build:
      context: ./backend/admin-service
      dockerfile: Dockerfile
    container_name: admin-service
    ports:
      - "3004:3004"
    environment:
      - NODE_ENV=production
      - PORT=3004
      - MONGODB_URI=mongodb://mongo:27017/admin_service
      - REDIS_URL=redis://redis:6379
    depends_on:
      - mongo
      - redis
    networks:
      - khuongcuoicung-network
    restart: unless-stopped
    volumes:
      - ./backend/admin-service/logs:/app/logs

  # Agent Policy Service
  agent-policy-service:
    build:
      context: ./backend/agent-policy-service
      dockerfile: Dockerfile
    container_name: agent-policy-service
    ports:
      - "3003:3003"
    environment:
      - NODE_ENV=production
      - PORT=3003
      - MONGODB_URI=mongodb://mongo:27017/agent_policy_service
      - REDIS_URL=redis://redis:6379
    depends_on:
      - mongo
      - redis
    networks:
      - khuongcuoicung-network
    restart: unless-stopped
    volumes:
      - ./backend/agent-policy-service/logs:/app/logs

  # Agent Management Service
  agent-management-service:
    build:
      context: ./backend/agent-management-service
      dockerfile: Dockerfile
    container_name: agent-management-service
    ports:
      - "3005:3005"
    environment:
      - NODE_ENV=production
      - PORT=3005
      - MONGODB_URI=mongodb://mongo:27017/agent_management_service
      - REDIS_URL=redis://redis:6379
    depends_on:
      - mongo
      - redis
    networks:
      - khuongcuoicung-network
    restart: unless-stopped
    volumes:
      - ./backend/agent-management-service/logs:/app/logs

  # Botpress Service
  botpress-service:
    image: botpress/server:latest
    container_name: botpress-service
    ports:
      - "3000:3000"
    environment:
      - BP_HOST=0.0.0.0
      - BP_PORT=3000
      - BP_PRODUCTION=true
    volumes:
      - ./backend/botpress-service/data:/botpress/data
      - ./backend/botpress-service/config:/botpress/config
    networks:
      - khuongcuoicung-network
    restart: unless-stopped

  # MongoDB for backend services
  mongo:
    image: mongo:7
    container_name: backend-mongodb
    ports:
      - "27017:27017"
    environment:
      - MONGO_INITDB_ROOT_USERNAME=admin
      - MONGO_INITDB_ROOT_PASSWORD=\${MONGO_PASSWORD}
    volumes:
      - mongo-data:/data/db
      - ./backend/shared/database/init:/docker-entrypoint-initdb.d
    networks:
      - khuongcuoicung-network
    restart: unless-stopped

volumes:
  mongo-data:
    driver: local

networks:
  khuongcuoicung-network:
    driver: bridge
EOF

echo ""
echo "🎉 Backend services structure created successfully!"
echo ""
echo "Services created:"
for service in "${!SERVICES[@]}"; do
    IFS=':' read -r port description <<< "${SERVICES[$service]}"
    echo "  ✅ $service (port $port) - $description"
done
echo "  ✅ botpress-service (port $BOTPRESS_PORT) - Chatbot and conversational AI service"
echo ""
echo "Next steps:"
echo "1. Review and customize each service's configuration"
echo "2. Add service-specific routes and controllers"
echo "3. Update main docker-compose.yml with backend services"
echo "4. Configure environment variables"
echo "5. Set up databases and run migrations"
echo ""
echo "Files created:"
echo "  📁 backend/ - Main backend directory"
echo "  📄 backend/docker-compose.services.yml - Docker compose services configuration"
echo "  📁 backend/shared/ - Shared utilities and configurations"
echo ""
EOF

chmod +x /workspace/DuAn_30_8/backend/create-services.sh