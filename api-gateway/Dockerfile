# API Gateway Dockerfile
# Build context should be the api-gateway directory

# Multi-stage build for production optimization
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (including dev dependencies for build if needed)
RUN npm ci && npm cache clean --force

# Production stage
FROM node:18-alpine AS production

# Install system dependencies
RUN apk add --no-cache dumb-init curl

# Create app user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S apigateway -u 1001

# Set working directory
WORKDIR /app

# Copy dependencies from builder stage (only production dependencies)
COPY --from=builder /app/node_modules ./node_modules

# Copy application code with proper ownership
COPY --chown=apigateway:nodejs . .

# Create logs directory with proper permissions
RUN mkdir -p logs && chown -R apigateway:nodejs logs

# Create temp directory for uploads/processing
RUN mkdir -p tmp && chown -R apigateway:nodejs tmp

# Set environment variables
ENV NODE_ENV=production
ENV PORT=8080

# Expose port
EXPOSE 8080

# Health check with improved endpoint
HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
  CMD curl -f http://localhost:8080/health || exit 1

# Switch to non-root user
USER apigateway

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start the application
CMD ["node", "src/app.js"]