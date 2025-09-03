#!/bin/bash

# Kong Gateway Initialization Script
# This script initializes Kong Gateway with database migrations and configuration

set -e

echo "🚀 Starting Kong Gateway initialization..."

# Wait for PostgreSQL to be ready
echo "⏳ Waiting for PostgreSQL database to be ready..."
until pg_isready -h kong-database -p 5432 -U kong; do
  echo "PostgreSQL is unavailable - sleeping"
  sleep 2
done

echo "✅ PostgreSQL is ready!"

# Run Kong migrations
echo "🔄 Running Kong database migrations..."
kong migrations bootstrap --conf /etc/kong/kong.conf

# Check if migrations were successful
if [ $? -eq 0 ]; then
    echo "✅ Kong migrations completed successfully!"
else
    echo "❌ Kong migrations failed!"
    exit 1
fi

# Load declarative configuration if provided
if [ -f "/etc/kong/kong.yml" ]; then
    echo "📋 Loading Kong declarative configuration..."
    kong config db_import /etc/kong/kong.yml --conf /etc/kong/kong.conf
    
    if [ $? -eq 0 ]; then
        echo "✅ Kong configuration loaded successfully!"
    else
        echo "❌ Failed to load Kong configuration!"
        exit 1
    fi
fi

# Start Kong Gateway
echo "🌟 Starting Kong Gateway..."
exec kong start --conf /etc/kong/kong.conf --vv