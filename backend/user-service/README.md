# Authify User Service

User authentication and management service for the MathService ecosystem.

## Features

- User registration and authentication
- JWT token management (access and refresh tokens)
- Role-based access control (USER, ADMIN, AGENT)
- User profile management
- Admin user management capabilities
- Token verification for API Gateway integration

## Technology Stack

- **Framework**: FastAPI
- **Database**: PostgreSQL with SQLAlchemy ORM
- **Authentication**: JWT with python-jose
- **Password Hashing**: bcrypt via passlib
- **Validation**: Pydantic
- **Migration**: Alembic
- **Logging**: structlog

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/refresh` - Refresh access token
- `GET /api/v1/auth/me` - Get current user info
- `POST /api/v1/auth/verify-token` - Verify JWT token (for API Gateway)

### User Management
- `GET /api/v1/users/me` - Get current user profile
- `PUT /api/v1/users/me` - Update current user profile
- `GET /api/v1/users/` - Get all users (Admin only)
- `GET /api/v1/users/{user_id}` - Get user by ID (Admin only)
- `PUT /api/v1/users/{user_id}` - Update user (Admin only)
- `POST /api/v1/users/{user_id}/deactivate` - Deactivate user (Admin only)
- `POST /api/v1/users/{user_id}/activate` - Activate user (Admin only)
- `POST /api/v1/users/{user_id}/change-role` - Change user role (Admin only)

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. Run database migrations:
```bash
alembic upgrade head
```

4. Start the service:
```bash
uvicorn app.main:app --host 0.0.0.0 --port 8001 --reload
```

## Docker

Build and run with Docker:

```bash
docker build -t authify-user-service .
docker run -p 8001:8001 authify-user-service
```

## Environment Variables

- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET_KEY`: Secret key for JWT signing
- `JWT_ALGORITHM`: JWT algorithm (default: HS256)
- `JWT_ACCESS_TOKEN_EXPIRE_MINUTES`: Access token expiration (default: 30)
- `JWT_REFRESH_TOKEN_EXPIRE_DAYS`: Refresh token expiration (default: 7)
- `REDIS_URL`: Redis connection string
- `BACKEND_CORS_ORIGINS`: Allowed CORS origins
- `RATE_LIMIT_PER_MINUTE`: Rate limiting (default: 60)

## User Roles

- **USER**: Regular user with basic access
- **ADMIN**: Administrator with full access to user management
- **AGENT**: Agent role for special permissions

## Integration with API Gateway

The service provides a `/api/v1/auth/verify-token` endpoint that API Gateway can use to verify JWT tokens and get user information for request routing and authorization.