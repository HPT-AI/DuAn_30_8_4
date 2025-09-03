#!/bin/bash

# Start development environment
echo "🚀 Starting MathService Development Environment..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Build and start services
echo "📦 Building and starting services..."
docker-compose -f docker-compose.dev.yml up --build -d

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 10

# Check service health
echo "🔍 Checking service health..."

# Check PostgreSQL
echo "Checking PostgreSQL..."
docker-compose -f docker-compose.dev.yml exec postgres pg_isready -U authify_user -d authify_db

# Check Redis
echo "Checking Redis..."
docker-compose -f docker-compose.dev.yml exec redis redis-cli ping

# Check User Service
echo "Checking User Service..."
curl -f http://localhost:8001/health || echo "User Service not ready yet"

# Check Kong Gateway
echo "Checking Kong Gateway..."
curl -f http://localhost:8000/health || echo "Kong Gateway not ready yet"

# Check Frontend
echo "Checking Frontend..."
curl -f http://localhost:12000 || echo "Frontend not ready yet"

echo "✅ Development environment started!"
echo ""
echo "🌐 Services available at:"
echo "  - Frontend: http://localhost:12000"
echo "  - API Gateway: http://localhost:8000"
echo "  - User Service: http://localhost:8001"
echo "  - Kong Admin: http://localhost:8002"
echo ""
echo "📊 Database connections:"
echo "  - PostgreSQL (User Service): localhost:5432"
echo "  - Redis: localhost:6379"
echo ""
echo "🔧 To stop all services: docker-compose -f docker-compose.dev.yml down"
echo "📝 To view logs: docker-compose -f docker-compose.dev.yml logs -f [service-name]"