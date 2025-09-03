#!/usr/bin/env python3
"""
Integration test for Frontend -> API Gateway -> User Service
"""

import asyncio
import json
import httpx

class IntegrationTester:
    def __init__(self):
        self.gateway_url = "http://localhost:8080"
        self.user_service_url = "http://localhost:8001"
        self.frontend_url = "http://localhost:12000"
        
    async def test_gateway_health(self):
        """Test API Gateway health"""
        print("🔍 Testing API Gateway health...")
        async with httpx.AsyncClient() as client:
            response = await client.get(f"{self.gateway_url}/health")
            assert response.status_code == 200
            print("✅ API Gateway health check passed")
            
    async def test_user_service_health(self):
        """Test User Service health"""
        print("🔍 Testing User Service health...")
        async with httpx.AsyncClient() as client:
            response = await client.get(f"{self.user_service_url}/health")
            assert response.status_code == 200
            print("✅ User Service health check passed")
            
    async def test_frontend_health(self):
        """Test Frontend health"""
        print("🔍 Testing Frontend health...")
        async with httpx.AsyncClient() as client:
            response = await client.get(f"{self.frontend_url}")
            assert response.status_code == 200
            print("✅ Frontend health check passed")
            
    async def test_gateway_proxy_registration(self):
        """Test registration through API Gateway"""
        print("🔍 Testing user registration through API Gateway...")
        async with httpx.AsyncClient() as client:
            user_data = {
                "email": "integration-test@example.com",
                "password": "testpassword123",
                "full_name": "Integration Test User"
            }
            
            response = await client.post(
                f"{self.gateway_url}/api/v1/auth/register",
                json=user_data,
                headers={"Content-Type": "application/json"}
            )
            
            assert response.status_code == 201
            data = response.json()
            assert data["email"] == user_data["email"]
            assert data["full_name"] == user_data["full_name"]
            print("✅ User registration through API Gateway passed")
            return data
            
    async def test_gateway_proxy_login(self):
        """Test login through API Gateway"""
        print("🔍 Testing user login through API Gateway...")
        async with httpx.AsyncClient() as client:
            login_data = {
                "email": "integration-test@example.com",
                "password": "testpassword123"
            }
            
            response = await client.post(
                f"{self.gateway_url}/api/v1/auth/login",
                json=login_data,
                headers={"Content-Type": "application/json"}
            )
            
            assert response.status_code == 200
            data = response.json()
            assert "access_token" in data
            assert "refresh_token" in data
            assert data["token_type"] == "bearer"
            print("✅ User login through API Gateway passed")
            return data
            
    async def test_gateway_proxy_protected_route(self, access_token):
        """Test protected route through API Gateway"""
        print("🔍 Testing protected route through API Gateway...")
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.gateway_url}/api/v1/auth/me",
                headers={
                    "Authorization": f"Bearer {access_token}",
                    "Content-Type": "application/json"
                }
            )
            
            assert response.status_code == 200
            data = response.json()
            assert data["email"] == "integration-test@example.com"
            print("✅ Protected route through API Gateway passed")
            return data
            
    async def test_cors_headers(self):
        """Test CORS headers from API Gateway"""
        print("🔍 Testing CORS headers from API Gateway...")
        async with httpx.AsyncClient() as client:
            response = await client.options(
                f"{self.gateway_url}/api/v1/auth/login",
                headers={
                    "Origin": "http://localhost:12000",
                    "Access-Control-Request-Method": "POST",
                    "Access-Control-Request-Headers": "Content-Type"
                }
            )
            
            # CORS preflight should return 200 or 204
            assert response.status_code in [200, 204]
            print("✅ CORS headers test passed")
            
    async def run_all_tests(self):
        """Run all integration tests"""
        try:
            await self.test_gateway_health()
            await self.test_user_service_health()
            await self.test_frontend_health()
            
            # Test API Gateway proxy functionality
            user_data = await self.test_gateway_proxy_registration()
            tokens = await self.test_gateway_proxy_login()
            await self.test_gateway_proxy_protected_route(tokens["access_token"])
            await self.test_cors_headers()
            
            print("\n🎉 All integration tests passed!")
            print("✅ Frontend -> API Gateway -> User Service integration is working correctly")
            
        except Exception as e:
            print(f"\n❌ Integration test failed: {e}")
            raise

async def main():
    print("🚀 Starting Integration Tests...")
    print("📡 Testing: Frontend (port 12000) -> API Gateway (port 8080) -> User Service (port 8001)")
    print()
    
    tester = IntegrationTester()
    await tester.run_all_tests()

if __name__ == "__main__":
    asyncio.run(main())