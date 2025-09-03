# content-service

Content management and publishing service

## Features

- RESTful API endpoints
- JWT authentication integration
- Request validation
- Error handling
- Logging
- Health checks
- Docker support

## Installation

```bash
npm install
```

## Configuration

Copy `.env.example` to `.env` and configure your environment variables:

```bash
cp .env.example .env
```

## Development

```bash
npm run dev
```

## Production

```bash
npm start
```

## Docker

```bash
# Build image
npm run docker:build

# Run container
npm run docker:run
```

## API Endpoints

### Health Check
- `GET /api/health` - Service health status

### Service Info
- `GET /` - Service information

## Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## Linting

```bash
# Check code style
npm run lint

# Fix code style issues
npm run lint:fix
```

## Port

This service runs on port **3006**
