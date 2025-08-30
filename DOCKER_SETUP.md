# 🐳 Docker Setup Guide

## Overview
This project has been containerized using Docker for easy deployment and consistent development environments.

## 📁 Docker Files

### 1. `Dockerfile`
- Multi-stage build for optimized production image
- Based on Node.js 18 Alpine Linux
- Uses PNPM for package management
- Implements Next.js standalone output for minimal image size
- Final image size: ~152MB

### 2. `docker-compose.yml`
- Orchestrates the Next.js application
- Maps port 12000 (host) to 3000 (container)
- Includes health checks
- Auto-restart policy
- Custom network configuration

### 3. `.dockerignore`
- Excludes unnecessary files from build context
- Reduces build time and image size
- Excludes node_modules, logs, and development files

## 🚀 Quick Start

### Prerequisites
- Docker installed and running
- Docker Compose (or Docker with compose plugin)

### Build and Run
```bash
# Build the Docker image
docker build -t khuongcuoicung:latest .

# Run with Docker Compose (recommended)
docker compose up -d

# Or run directly with Docker
docker run -d -p 12000:3000 --name khuongcuoicung-app khuongcuoicung:latest
```

### Access the Application
- **Local**: http://localhost:12000
- **Production**: https://work-1-numaanzkhaszjdwq.prod-runtime.all-hands.dev

## 📋 Docker Commands

### Container Management
```bash
# View running containers
docker ps

# View logs
docker logs khuongcuoicung-app

# Stop the application
docker compose down

# Restart the application
docker compose restart

# View container stats
docker stats khuongcuoicung-app
```

### Image Management
```bash
# List images
docker images

# Remove image
docker rmi khuongcuoicung:latest

# Rebuild image (no cache)
docker build --no-cache -t khuongcuoicung:latest .
```

## 🔧 Configuration

### Environment Variables
- `NODE_ENV=production`
- `PORT=3000`
- `HOSTNAME=0.0.0.0`

### Health Check
- Endpoint: `http://localhost:3000`
- Interval: 30 seconds
- Timeout: 10 seconds
- Retries: 3
- Start period: 40 seconds

## 🏗️ Build Process

The Docker build process consists of three stages:

1. **deps**: Install dependencies using PNPM
2. **builder**: Build the Next.js application with standalone output
3. **runner**: Create minimal production image with only necessary files

## 📊 Performance

- **Build time**: ~65 seconds
- **Image size**: 152MB
- **Startup time**: ~75ms
- **Memory usage**: Optimized for production

## 🔍 Troubleshooting

### Common Issues

1. **Port already in use**
   ```bash
   # Find process using port 12000
   lsof -i :12000
   # Kill the process
   kill -9 <PID>
   ```

2. **Container won't start**
   ```bash
   # Check logs
   docker logs khuongcuoicung-app
   # Check container status
   docker inspect khuongcuoicung-app
   ```

3. **Build fails**
   ```bash
   # Clean build cache
   docker builder prune
   # Rebuild without cache
   docker build --no-cache -t khuongcuoicung:latest .
   ```

## 🚀 Production Deployment

For production deployment, consider:

1. **Reverse Proxy**: Use Nginx for SSL termination and load balancing
2. **Environment Variables**: Use `.env` files or secrets management
3. **Monitoring**: Implement logging and monitoring solutions
4. **Scaling**: Use Docker Swarm or Kubernetes for scaling

## 📝 Development

For development with Docker:

```bash
# Development with hot reload (if needed)
docker run -d -p 12000:3000 -v $(pwd):/app khuongcuoicung:latest

# Or use development compose file
docker compose -f docker-compose.dev.yml up
```

## 🔐 Security

- Runs as non-root user (nextjs:nodejs)
- Minimal base image (Alpine Linux)
- No unnecessary packages installed
- Proper file permissions set

---

**Note**: This setup provides a production-ready containerized environment for the Khuongcuoicung Next.js application.