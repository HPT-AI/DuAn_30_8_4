# 🏗️ Khuongcuoicung - Construction Management System

A modern Next.js application for construction project management with admin dashboard, agent frontend, and comprehensive reporting features.

## 🔐 OAuth Authentication Update

**Latest Update**: Fixed Google OAuth login issues and implemented Facebook OAuth integration.

### What's Fixed:
- ✅ **Google OAuth**: Changed from access token to ID token flow
- ✅ **Facebook OAuth**: Complete implementation with proper token verification
- ✅ **Error Handling**: Improved error messages and logging
- ✅ **Security**: Enhanced token verification and validation

### Setup OAuth:
1. See `OAUTH_SETUP_GUIDE.md` for detailed setup instructions
2. Configure environment variables in `.env`
3. Test with `test_oauth_integration.py` and `test_oauth_frontend.html`

## 🚀 Quick Start

### Option 1: Docker (Recommended)
```bash
# Clone the repository
git clone https://github.com/HPT-AI/DuAn_30_8_4.git
cd DuAn_30_8_4

# Run with Docker Compose
docker compose up -d

# Access the application
open http://localhost:12000
```

### Option 2: Manual Setup
```bash
# Install dependencies
pnpm install

# Setup OAuth credentials (see OAUTH_SETUP_GUIDE.md)
cp .env.example .env
# Edit .env with your OAuth credentials

# Start backend service
./start_backend.sh

# Run development server
pnpm run dev

# Build for production
pnpm run build
pnpm start
```

## 📁 Project Structure

```
├── admin/                 # Admin dashboard components
├── agent-frontend/        # Agent interface components  
├── construction-reports/  # Reporting functionality
├── components/           # Shared UI components
├── lib/                  # Utility functions and configurations
├── backend/              # Backend services
│   └── user-service/     # User authentication service
├── public/               # Static assets
├── OAUTH_SETUP_GUIDE.md  # OAuth setup instructions
├── OAUTH_FIX_SUMMARY.md  # Summary of OAuth fixes
├── test_oauth_*.py/html  # OAuth testing tools
├── Dockerfile            # Docker configuration
├── docker-compose.yml    # Docker Compose setup
└── DOCKER_SETUP.md      # Detailed Docker documentation
```

## 🐳 Docker Information

This project is fully containerized with Docker for easy deployment:

- **Image Size**: ~152MB (optimized)
- **Build Time**: ~65 seconds
- **Startup Time**: ~75ms
- **Port**: 12000 (host) → 3000 (container)

For detailed Docker setup and commands, see [DOCKER_SETUP.md](./DOCKER_SETUP.md)

## 🛠️ Technology Stack

- **Framework**: Next.js 14.2.16
- **Backend**: FastAPI (Python)
- **Authentication**: Google OAuth 2.0, Facebook Login
- **Package Manager**: PNPM
- **Styling**: Tailwind CSS
- **Containerization**: Docker & Docker Compose
- **Node.js**: 18 (Alpine Linux)

## 🌐 Access URLs

- **Development**: http://localhost:3000
- **Backend API**: http://localhost:8001
- **Docker**: http://localhost:12000
- **Production**: https://work-1-numaanzkhaszjdwq.prod-runtime.all-hands.dev

## 📋 Available Scripts

```bash
pnpm run dev      # Start development server
pnpm run build    # Build for production
pnpm run start    # Start production server
pnpm run lint     # Run ESLint

# Backend scripts
./start_backend.sh              # Start backend service
python test_oauth_integration.py # Test OAuth endpoints
```

## 🔧 Docker Commands

```bash
# Build and run
docker compose up -d

# View logs
docker logs khuongcuoicung-app

# Stop application
docker compose down

# Rebuild image
docker compose build --no-cache
```

## 📊 Features

- 🏢 **Admin Dashboard**: Complete administrative interface
- 👥 **Agent Frontend**: User-friendly agent interface
- 📈 **Construction Reports**: Comprehensive reporting system
- 🔐 **OAuth Authentication**: Google & Facebook login integration
- 🎨 **Modern UI**: Clean and responsive design
- 🐳 **Docker Ready**: Containerized for easy deployment
- ⚡ **Performance Optimized**: Fast loading and minimal bundle size

## 🔐 OAuth Features

- **Google Login**: Secure ID token-based authentication
- **Facebook Login**: Complete Facebook OAuth integration
- **JWT Tokens**: Secure session management
- **Error Handling**: Comprehensive error messages and logging
- **Testing Tools**: Built-in testing utilities

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Built with ❤️ using Next.js, FastAPI and Docker**
