# Backend Services Structure

## Tổng quan

Dự án đã được tạo với 7 backend services theo kiến trúc microservices:

## Services được tạo

### 1. User Service (Authify) - Port 3001
**Mô tả**: User authentication and management service
**Chức năng**:
- User registration và login
- JWT authentication
- Email verification
- Password reset
- User profile management
- Role-based access control
- Account security (login attempts, account locking)

**API Endpoints**:
- `POST /api/auth/register` - Đăng ký user
- `POST /api/auth/login` - Đăng nhập
- `POST /api/auth/logout` - Đăng xuất
- `GET /api/auth/me` - Lấy thông tin user hiện tại
- `POST /api/auth/forgot-password` - Quên mật khẩu
- `PUT /api/auth/reset-password/:token` - Reset mật khẩu
- `GET /api/auth/verify-email/:token` - Xác thực email
- `GET /api/users/profile` - Lấy profile user
- `PUT /api/users/profile` - Cập nhật profile
- `GET /api/health` - Health check

### 2. Content Service - Port 3006
**Mô tả**: Content management and publishing service
**Chức năng**:
- Quản lý nội dung
- Publishing system
- Media management
- Content versioning

### 3. Payment Service - Port 3002
**Mô tả**: Payment processing and billing service
**Chức năng**:
- Payment processing
- Billing management
- Subscription handling
- Transaction history

### 4. Admin Service - Port 3004
**Mô tả**: Admin operations and management service
**Chức năng**:
- Admin dashboard
- System configuration
- User management
- Analytics và reporting

### 5. Agent Policy Service - Port 3003
**Mô tả**: Agent policy management service
**Chức năng**:
- Agent policy configuration
- Rule management
- Policy enforcement
- Compliance tracking

### 6. Agent Management Service - Port 3005
**Mô tả**: Agent lifecycle management service
**Chức năng**:
- Agent registration
- Agent monitoring
- Performance tracking
- Agent configuration

### 7. Botpress Service - Port 3000
**Mô tả**: Chatbot and conversational AI service
**Chức năng**:
- Chatbot interactions
- Natural Language Processing
- Multi-channel support
- Bot analytics

## Cấu trúc thư mục

```
backend/
├── user-service/                 # User authentication service
│   ├── src/
│   │   ├── controllers/         # Request handlers
│   │   ├── models/             # Database models
│   │   ├── routes/             # API routes
│   │   ├── middleware/         # Custom middleware
│   │   ├── services/           # Business logic
│   │   ├── utils/              # Utility functions
│   │   ├── config/             # Configuration files
│   │   └── app.js              # Main application file
│   ├── tests/                  # Unit tests
│   ├── docs/                   # Documentation
│   ├── logs/                   # Log files
│   ├── package.json            # Dependencies
│   ├── Dockerfile              # Docker configuration
│   └── README.md               # Service documentation
├── content-service/             # Content management service
├── payment-service/             # Payment processing service
├── admin-service/               # Admin operations service
├── agent-policy-service/        # Agent policy service
├── agent-management-service/    # Agent management service
├── botpress-service/            # Botpress chatbot service
│   ├── config/                 # Botpress configuration
│   ├── data/                   # Botpress data (volume)
│   └── README.md               # Service documentation
├── shared/                      # Shared utilities
│   ├── config/                 # Shared configurations
│   ├── middleware/             # Common middleware
│   ├── utils/                  # Utility functions
│   ├── models/                 # Shared data models
│   └── database/               # Database utilities
├── create-services.sh           # Service creation script
└── docker-compose.services.yml  # Docker compose configuration
```

## Công nghệ sử dụng

### Backend Framework
- **Node.js** với **Express.js**
- **MongoDB** với **Mongoose** ODM
- **Redis** cho caching và session management

### Authentication & Security
- **JWT** (JSON Web Tokens)
- **bcryptjs** cho password hashing
- **Helmet** cho security headers
- **CORS** configuration
- **Rate limiting** chống DDoS

### Validation & Middleware
- **Joi** cho data validation
- **express-validator** cho request validation
- Custom middleware cho authentication và authorization

### Logging & Monitoring
- **Winston** cho logging
- Health check endpoints
- Prometheus metrics integration

### Email & Communication
- **Nodemailer** cho email service
- Email templates cho verification và password reset

### Development Tools
- **Nodemon** cho development
- **Jest** cho testing
- **ESLint** cho code quality
- **Docker** containerization

## Database Schema

### User Model (User Service)
```javascript
{
  email: String (unique, required),
  password: String (hashed, required),
  firstName: String (required),
  lastName: String (required),
  phone: String (optional),
  avatar: String (optional),
  role: Enum ['user', 'admin', 'agent', 'super_admin'],
  status: Enum ['active', 'inactive', 'suspended', 'pending'],
  emailVerified: Boolean,
  lastLogin: Date,
  loginAttempts: Number,
  preferences: {
    language: Enum ['en', 'vi'],
    timezone: String,
    notifications: {
      email: Boolean,
      push: Boolean
    }
  },
  metadata: {
    registrationIP: String,
    lastLoginIP: String,
    userAgent: String
  },
  timestamps: true
}
```

## Environment Variables

Mỗi service cần các environment variables:

```env
# Service Configuration
NODE_ENV=development
PORT=3001
SERVICE_NAME=user-service
SERVICE_VERSION=1.0.0

# Database
MONGODB_URI=mongodb://localhost:27017/user_service
REDIS_URL=redis://localhost:6379

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=24h

# CORS
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:12000

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Logging
LOG_LEVEL=info
LOG_FILE=logs/app.log
```

## Docker Configuration

### Individual Service Dockerfile
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001
RUN chown -R nodejs:nodejs /app
USER nodejs
EXPOSE 3001
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:3001/api/health || exit 1
CMD ["npm", "start"]
```

### Docker Compose Services
File `backend/docker-compose.services.yml` chứa cấu hình cho tất cả services để integrate vào main docker-compose.yml.

## API Documentation

### Authentication Flow
1. **Register**: `POST /api/auth/register`
2. **Email Verification**: `GET /api/auth/verify-email/:token`
3. **Login**: `POST /api/auth/login`
4. **Access Protected Routes**: Include JWT token in Authorization header
5. **Refresh Token**: `POST /api/auth/refresh-token`
6. **Logout**: `POST /api/auth/logout`

### Error Handling
Tất cả services sử dụng consistent error response format:
```json
{
  "success": false,
  "error": "Error message",
  "details": "Additional error details (development only)"
}
```

### Success Response Format
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data
  }
}
```

## Security Features

### User Service Security
- Password hashing với bcrypt (cost factor 12)
- JWT token với expiration
- Account locking sau 5 failed login attempts
- Email verification required
- Password reset với secure tokens
- Rate limiting (100 requests/15 minutes)
- Input validation và sanitization
- CORS configuration
- Security headers với Helmet

### General Security
- Environment variables cho sensitive data
- Non-root user trong Docker containers
- Health checks cho monitoring
- Comprehensive logging
- Error handling không expose sensitive information

## Testing

Mỗi service có test structure:
```
tests/
├── unit/           # Unit tests
├── integration/    # Integration tests
├── fixtures/       # Test data
└── helpers/        # Test utilities
```

## Deployment

### Development
```bash
# Install dependencies
npm install

# Start in development mode
npm run dev

# Run tests
npm test
```

### Production
```bash
# Build Docker image
npm run docker:build

# Run with Docker Compose
docker-compose up -d
```

## Monitoring & Health Checks

### Health Check Endpoints
- `GET /api/health` - Comprehensive health check
- `GET /api/health/ready` - Readiness probe
- `GET /api/health/live` - Liveness probe

### Metrics
- Prometheus metrics integration
- Request/response logging
- Performance monitoring
- Error tracking

## Next Steps

1. **Complete Implementation**: Hoàn thiện các controllers và services còn lại
2. **Database Setup**: Tạo database migrations và seeders
3. **Testing**: Viết comprehensive tests cho tất cả services
4. **Documentation**: API documentation với Swagger/OpenAPI
5. **CI/CD**: Setup continuous integration và deployment
6. **Monitoring**: Setup monitoring và alerting
7. **Security**: Security audit và penetration testing

---

**Status**: ✅ Backend structure created
**Date**: 2025-09-03
**Services**: 7 microservices ready for development