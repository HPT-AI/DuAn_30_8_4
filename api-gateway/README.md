# API Gateway

Enterprise-grade API Gateway with advanced routing, authentication, rate limiting, load balancing, and monitoring capabilities.

## 🚀 Features

### Core Features
- **Request Routing & Load Balancing**: Intelligent routing with multiple load balancing strategies
- **Authentication & Authorization**: JWT-based authentication with role-based access control
- **Rate Limiting**: Configurable rate limiting per service and endpoint
- **Caching**: Redis-based response caching with TTL management
- **Circuit Breaker**: Automatic circuit breaking for failing services
- **Service Discovery**: Dynamic service registration and health monitoring

### Monitoring & Observability
- **Prometheus Metrics**: Comprehensive metrics collection
- **Health Checks**: Detailed health monitoring for all services
- **Request Logging**: Structured logging with request tracing
- **Performance Monitoring**: Response time and throughput tracking

### Security
- **Helmet.js**: Security headers and protection
- **CORS**: Configurable cross-origin resource sharing
- **Input Validation**: Request validation and sanitization
- **API Key Support**: Optional API key authentication

## 📋 Prerequisites

- Node.js 18+ 
- Redis 6+
- Docker & Docker Compose (for containerized deployment)

## 🛠️ Installation

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd api-gateway
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start Redis**
   ```bash
   docker run -d -p 6379:6379 redis:7-alpine
   ```

5. **Start the gateway**
   ```bash
   npm run dev
   ```

### Docker Deployment

1. **Build and start all services**
   ```bash
   docker-compose up -d
   ```

2. **View logs**
   ```bash
   docker-compose logs -f api-gateway
   ```

3. **Stop services**
   ```bash
   docker-compose down
   ```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `8080` |
| `NODE_ENV` | Environment | `development` |
| `REDIS_HOST` | Redis host | `localhost` |
| `REDIS_PORT` | Redis port | `6379` |
| `JWT_SECRET` | JWT secret key | `change-in-production` |
| `LOG_LEVEL` | Logging level | `info` |
| `RATE_LIMIT_MAX_REQUESTS` | Rate limit per window | `100` |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window (ms) | `900000` |

### Service Configuration

Services are configured in `config/default.js`:

```javascript
services: {
  userService: {
    name: 'user-service',
    baseUrl: 'http://localhost:3001',
    timeout: 5000,
    retries: 3,
    healthCheck: '/health'
  }
}
```

## 🌐 API Endpoints

### Gateway Routes

| Method | Path | Description |
|--------|------|-------------|
| `*` | `/api/:service/*` | Proxy to service |
| `GET` | `/health` | Basic health check |
| `GET` | `/health/detailed` | Detailed health check |
| `GET` | `/metrics` | Prometheus metrics |

### Service Routes

| Method | Path | Description | Auth Required |
|--------|------|-------------|---------------|
| `*` | `/api/users/*` | User service | ✅ |
| `*` | `/api/orders/*` | Order service | ✅ |
| `*` | `/api/payments/*` | Payment service | ✅ |

### Admin Routes

| Method | Path | Description | Auth Required |
|--------|------|-------------|---------------|
| `GET` | `/api/admin/services` | List services | Admin |
| `POST` | `/api/admin/services/:service/instances` | Add instance | Admin |
| `DELETE` | `/api/admin/services/:service/instances/:id` | Remove instance | Admin |
| `GET` | `/api/admin/circuit-breakers` | Circuit breaker status | Admin |

## 🔐 Authentication

### JWT Authentication

1. **Obtain JWT token** from your authentication service
2. **Include in requests**:
   ```bash
   curl -H "Authorization: Bearer <token>" http://localhost:8080/api/users/profile
   ```

### API Key Authentication

1. **Enable in configuration**:
   ```env
   API_KEY_ENABLED=true
   API_KEY_HEADER=X-API-Key
   ```

2. **Include in requests**:
   ```bash
   curl -H "X-API-Key: <api-key>" http://localhost:8080/api/users/profile
   ```

## 📊 Monitoring

### Health Checks

- **Basic**: `GET /health`
- **Detailed**: `GET /health/detailed`
- **Service-specific**: `GET /health/services/:serviceName`
- **Dependencies**: `GET /health/dependencies`

### Metrics

- **Prometheus**: `GET /metrics`
- **JSON format**: `GET /metrics/json`
- **Real-time stream**: `GET /metrics/stream`
- **Service-specific**: `GET /metrics/services/:serviceName`

### Dashboards

Access monitoring dashboards:
- **Grafana**: http://localhost:3000 (admin/admin)
- **Prometheus**: http://localhost:9090

## 🔄 Load Balancing

Supported strategies:
- **Round Robin** (default)
- **Least Connections**
- **Random**
- **Weighted** (based on response time)

Configure in `config/default.js`:
```javascript
loadBalancing: {
  strategy: 'round-robin',
  healthCheckInterval: 30000
}
```

## 🛡️ Rate Limiting

### Global Rate Limiting
```javascript
rateLimit: {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // requests per window
  message: 'Too many requests'
}
```

### Service-specific Rate Limiting
```javascript
// In route handler
const rateLimiter = createServiceRateLimit('userService', 50, 60000);
```

## 💾 Caching

### Response Caching
```bash
# Cache GET request for 5 minutes
curl "http://localhost:8080/api/users/1?cache=true&cacheTTL=300"
```

### Cache Management
```bash
# Invalidate cache pattern (admin only)
curl -X POST -H "Authorization: Bearer <admin-token>" \
  -d '{"pattern": "users:*"}' \
  http://localhost:8080/api/admin/cache/invalidate
```

## 🔧 Circuit Breaker

Automatic circuit breaking when services fail:

```javascript
circuitBreaker: {
  enabled: true,
  threshold: 5,        // failures before opening
  timeout: 60000,      // circuit open time
  resetTimeout: 30000  // time before retry
}
```

## 📝 Logging

Structured logging with Winston:

```javascript
// Log levels: error, warn, info, debug
logger.info('Request processed', {
  requestId: 'req-123',
  method: 'GET',
  path: '/api/users/1',
  responseTime: '45ms'
});
```

## 🧪 Testing

### Run Tests
```bash
npm test
npm run test:coverage
```

### Load Testing
```bash
# Install artillery
npm install -g artillery

# Run load test
artillery run tests/load-test.yml
```

## 🚀 Deployment

### Production Checklist

- [ ] Set strong `JWT_SECRET`
- [ ] Configure Redis password
- [ ] Set up SSL/TLS termination
- [ ] Configure log rotation
- [ ] Set up monitoring alerts
- [ ] Configure backup strategy
- [ ] Review security headers
- [ ] Set resource limits

### Kubernetes Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api-gateway
spec:
  replicas: 3
  selector:
    matchLabels:
      app: api-gateway
  template:
    metadata:
      labels:
        app: api-gateway
    spec:
      containers:
      - name: api-gateway
        image: api-gateway:latest
        ports:
        - containerPort: 8080
        env:
        - name: NODE_ENV
          value: "production"
        - name: REDIS_HOST
          value: "redis-service"
        livenessProbe:
          httpGet:
            path: /health/live
            port: 8080
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /health/ready
            port: 8080
          initialDelaySeconds: 5
          periodSeconds: 5
```

## 🔍 Troubleshooting

### Common Issues

1. **Redis Connection Failed**
   ```bash
   # Check Redis status
   docker-compose logs redis
   
   # Test Redis connection
   redis-cli ping
   ```

2. **Service Health Check Failed**
   ```bash
   # Check service logs
   docker-compose logs user-service
   
   # Test service directly
   curl http://localhost:3001/health
   ```

3. **High Memory Usage**
   ```bash
   # Check metrics
   curl http://localhost:8080/health/performance
   
   # Clear cache
   curl -X POST http://localhost:8080/api/admin/cache/invalidate \
     -d '{"pattern": "*"}'
   ```

### Debug Mode

Enable debug logging:
```env
LOG_LEVEL=debug
NODE_ENV=development
```

## 📚 API Documentation

### Request/Response Format

All API responses follow this format:
```json
{
  "data": {},
  "status": "success",
  "timestamp": "2023-12-01T10:00:00Z",
  "requestId": "req-123"
}
```

### Error Format
```json
{
  "error": "Error Type",
  "message": "Detailed error message",
  "code": "ERROR_CODE",
  "requestId": "req-123",
  "timestamp": "2023-12-01T10:00:00Z"
}
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [Wiki](wiki-url)
- **Issues**: [GitHub Issues](issues-url)
- **Discussions**: [GitHub Discussions](discussions-url)
- **Email**: support@example.com

---

**Built with ❤️ by HPT-AI Team**