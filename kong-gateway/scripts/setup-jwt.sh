#!/bin/bash

# Kong JWT Setup Script
# This script sets up JWT authentication for Kong Gateway

set -e

KONG_ADMIN_URL="http://localhost:8001"
JWT_SECRET="your-super-secret-jwt-key-change-in-production"

echo "🔐 Setting up JWT authentication for Kong Gateway..."

# Wait for Kong Admin API to be ready
echo "⏳ Waiting for Kong Admin API to be ready..."
until curl -f -s "${KONG_ADMIN_URL}/status" > /dev/null; do
  echo "Kong Admin API is unavailable - sleeping"
  sleep 2
done

echo "✅ Kong Admin API is ready!"

# Create JWT credentials for consumers
echo "🔑 Creating JWT credentials for consumers..."

# Frontend client JWT credential
curl -X POST "${KONG_ADMIN_URL}/consumers/frontend-client/jwt" \
  --data "key=frontend-jwt-key" \
  --data "secret=${JWT_SECRET}" \
  --data "algorithm=HS256"

# Admin client JWT credential
curl -X POST "${KONG_ADMIN_URL}/consumers/admin-client/jwt" \
  --data "key=admin-jwt-key" \
  --data "secret=${JWT_SECRET}" \
  --data "algorithm=HS256"

# Agent client JWT credential
curl -X POST "${KONG_ADMIN_URL}/consumers/agent-client/jwt" \
  --data "key=agent-jwt-key" \
  --data "secret=${JWT_SECRET}" \
  --data "algorithm=HS256"

echo "✅ JWT credentials created successfully!"

# Verify setup
echo "🔍 Verifying JWT setup..."
curl -s "${KONG_ADMIN_URL}/consumers/frontend-client/jwt" | jq '.'
curl -s "${KONG_ADMIN_URL}/consumers/admin-client/jwt" | jq '.'
curl -s "${KONG_ADMIN_URL}/consumers/agent-client/jwt" | jq '.'

echo "🎉 JWT authentication setup completed!"