#!/bin/bash

# Start Backend Service Script
echo "🚀 Starting Backend Service for OAuth Testing..."

# Check if we're in the right directory
if [ ! -d "backend/user-service" ]; then
    echo "❌ Error: backend/user-service directory not found"
    echo "Please run this script from the project root directory"
    exit 1
fi

# Navigate to user service directory
cd backend/user-service

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo "📥 Installing dependencies..."
pip install -r requirements.txt

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "⚠️  .env file not found, creating from example..."
    cp ../../.env.example .env
    echo "📝 Please edit .env file with your OAuth credentials"
fi

# Set default environment variables if not set
export DATABASE_URL=${DATABASE_URL:-"sqlite:///./user_service.db"}
export JWT_SECRET_KEY=${JWT_SECRET_KEY:-"your-secret-key-change-this-in-production"}

# Start the server
echo "🌟 Starting FastAPI server on port 8001..."
echo "📍 Backend will be available at: http://localhost:8001"
echo "📍 API docs will be available at: http://localhost:8001/docs"
echo "📍 Health check: http://localhost:8001/health"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

python -m uvicorn app.main:app --reload --port 8001 --host 0.0.0.0