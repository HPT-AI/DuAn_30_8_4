#!/usr/bin/env python3
"""
Test script for User Service (Authify)
"""

import asyncio
import httpx
import json
from typing import Dict, Any

BASE_URL = "http://localhost:8001"

class UserServiceTester:
    def __init__(self, base_url: str = BASE_URL):
        self.base_url = base_url
        self.access_token = None
        self.refresh_token = None
        self.test_user_id = None

    async def test_health_check(self):
        """Test health check endpoint"""
        print("🔍 Testing health check...")
        async with httpx.AsyncClient() as client:
            response = await client.get(f"{self.base_url}/health")
            assert response.status_code == 200
            data = response.json()
            assert data["status"] == "healthy"
            print("✅ Health check passed")
            return data

    async def test_user_registration(self):
        """Test user registration"""
        print("🔍 Testing user registration...")
        user_data = {
            "email": "test@example.com",
            "password": "testpassword123",
            "full_name": "Test User",
            "role": "USER",
            "is_active": True
        }
        
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{self.base_url}/api/v1/auth/register",
                json=user_data
            )
            assert response.status_code == 201
            data = response.json()
            assert data["email"] == user_data["email"]
            assert data["full_name"] == user_data["full_name"]
            self.test_user_id = data["id"]
            print("✅ User registration passed")
            return data

    async def test_user_login(self):
        """Test user login"""
        print("🔍 Testing user login...")
        login_data = {
            "email": "test@example.com",
            "password": "testpassword123"
        }
        
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{self.base_url}/api/v1/auth/login",
                json=login_data
            )
            assert response.status_code == 200
            data = response.json()
            assert "access_token" in data
            assert "refresh_token" in data
            assert data["token_type"] == "bearer"
            
            self.access_token = data["access_token"]
            self.refresh_token = data["refresh_token"]
            print("✅ User login passed")
            return data

    async def test_get_current_user(self):
        """Test get current user info"""
        print("🔍 Testing get current user...")
        headers = {"Authorization": f"Bearer {self.access_token}"}
        
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.base_url}/api/v1/auth/me",
                headers=headers
            )
            assert response.status_code == 200
            data = response.json()
            assert data["email"] == "test@example.com"
            assert data["full_name"] == "Test User"
            print("✅ Get current user passed")
            return data

    async def test_token_verification(self):
        """Test token verification"""
        print("🔍 Testing token verification...")
        
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{self.base_url}/api/v1/auth/verify-token",
                json={"token": self.access_token}
            )
            assert response.status_code == 200
            data = response.json()
            assert data["valid"] == True
            assert data["user_id"] == self.test_user_id
            print("✅ Token verification passed")
            return data

    async def test_refresh_token(self):
        """Test token refresh"""
        print("🔍 Testing token refresh...")
        
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{self.base_url}/api/v1/auth/refresh",
                json={"refresh_token": self.refresh_token}
            )
            assert response.status_code == 200
            data = response.json()
            assert "access_token" in data
            assert "refresh_token" in data
            
            # Update tokens
            self.access_token = data["access_token"]
            self.refresh_token = data["refresh_token"]
            print("✅ Token refresh passed")
            return data

    async def test_update_profile(self):
        """Test profile update"""
        print("🔍 Testing profile update...")
        headers = {"Authorization": f"Bearer {self.access_token}"}
        update_data = {
            "full_name": "Updated Test User"
        }
        
        async with httpx.AsyncClient() as client:
            response = await client.put(
                f"{self.base_url}/api/v1/users/me",
                headers=headers,
                json=update_data
            )
            assert response.status_code == 200
            data = response.json()
            assert data["full_name"] == "Updated Test User"
            print("✅ Profile update passed")
            return data

    async def test_invalid_token(self):
        """Test invalid token handling"""
        print("🔍 Testing invalid token handling...")
        headers = {"Authorization": "Bearer invalid_token"}
        
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.base_url}/api/v1/auth/me",
                headers=headers
            )
            assert response.status_code == 401
            print("✅ Invalid token handling passed")

    async def run_all_tests(self):
        """Run all tests"""
        print("🚀 Starting User Service Tests...\n")
        
        try:
            # Test basic functionality
            await self.test_health_check()
            await self.test_user_registration()
            await self.test_user_login()
            await self.test_get_current_user()
            await self.test_token_verification()
            await self.test_refresh_token()
            await self.test_update_profile()
            await self.test_invalid_token()
            
            print("\n🎉 All tests passed! User Service is working correctly.")
            
        except Exception as e:
            print(f"\n❌ Test failed: {e}")
            raise

async def main():
    tester = UserServiceTester()
    await tester.run_all_tests()

if __name__ == "__main__":
    asyncio.run(main())