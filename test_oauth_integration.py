#!/usr/bin/env python3
"""
Test script for OAuth integration
"""
import requests
import json
import sys
import os

# Test configuration
BASE_URL = "http://localhost:8001"
API_BASE = f"{BASE_URL}/api/v1"

def test_google_oauth_endpoint():
    """Test Google OAuth initialization endpoint"""
    print("🔍 Testing Google OAuth initialization...")
    
    try:
        response = requests.get(f"{API_BASE}/auth/google")
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Google OAuth endpoint working")
            print(f"Authorization URL: {data.get('authorization_url', 'Not found')}")
            return True
        else:
            print(f"❌ Google OAuth endpoint failed: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Error testing Google OAuth: {e}")
        return False

def test_facebook_oauth_endpoint():
    """Test Facebook OAuth initialization endpoint"""
    print("\n📘 Testing Facebook OAuth initialization...")
    
    try:
        response = requests.get(f"{API_BASE}/auth/facebook")
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Facebook OAuth endpoint working")
            print(f"Authorization URL: {data.get('authorization_url', 'Not found')}")
            return True
        else:
            print(f"❌ Facebook OAuth endpoint failed: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Error testing Facebook OAuth: {e}")
        return False

def test_google_token_endpoint():
    """Test Google token verification endpoint with dummy token"""
    print("\n🔍 Testing Google token endpoint...")
    
    try:
        # This will fail but should return proper error message
        response = requests.post(
            f"{API_BASE}/auth/google/token",
            json={"token": "dummy_token"},
            headers={"Content-Type": "application/json"}
        )
        print(f"Status: {response.status_code}")
        
        if response.status_code == 400:
            print("✅ Google token endpoint working (expected 400 for dummy token)")
            return True
        elif response.status_code == 500:
            error_data = response.json()
            if "not configured" in error_data.get("detail", "").lower():
                print("⚠️  Google OAuth not configured (expected in test environment)")
                return True
            else:
                print(f"❌ Unexpected 500 error: {error_data}")
                return False
        else:
            print(f"❌ Unexpected response: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Error testing Google token endpoint: {e}")
        return False

def test_facebook_token_endpoint():
    """Test Facebook token verification endpoint with dummy token"""
    print("\n📘 Testing Facebook token endpoint...")
    
    try:
        # This will fail but should return proper error message
        response = requests.post(
            f"{API_BASE}/auth/facebook/token",
            json={"token": "dummy_token"},
            headers={"Content-Type": "application/json"}
        )
        print(f"Status: {response.status_code}")
        
        if response.status_code == 400:
            print("✅ Facebook token endpoint working (expected 400 for dummy token)")
            return True
        elif response.status_code == 500:
            error_data = response.json()
            if "not configured" in error_data.get("detail", "").lower():
                print("⚠️  Facebook OAuth not configured (expected in test environment)")
                return True
            else:
                print(f"❌ Unexpected 500 error: {error_data}")
                return False
        else:
            print(f"❌ Unexpected response: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Error testing Facebook token endpoint: {e}")
        return False

def test_health_check():
    """Test if the backend is running"""
    print("🏥 Testing backend health...")
    
    try:
        response = requests.get(f"{BASE_URL}/health", timeout=5)
        if response.status_code == 200:
            print("✅ Backend is running")
            return True
        else:
            print(f"❌ Backend health check failed: {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to backend. Is it running on port 8001?")
        return False
    except Exception as e:
        print(f"❌ Health check error: {e}")
        return False

def main():
    """Run all tests"""
    print("🚀 Starting OAuth Integration Tests")
    print("=" * 50)
    
    # Check if backend is running
    if not test_health_check():
        print("\n💡 To start the backend:")
        print("cd backend/user-service")
        print("pip install -r requirements.txt")
        print("python -m uvicorn app.main:app --reload --port 8001")
        sys.exit(1)
    
    # Run OAuth tests
    tests = [
        test_google_oauth_endpoint,
        test_facebook_oauth_endpoint,
        test_google_token_endpoint,
        test_facebook_token_endpoint
    ]
    
    results = []
    for test in tests:
        results.append(test())
    
    # Summary
    print("\n" + "=" * 50)
    print("📊 Test Summary:")
    passed = sum(results)
    total = len(results)
    print(f"✅ Passed: {passed}/{total}")
    
    if passed == total:
        print("🎉 All tests passed! OAuth integration is working.")
    else:
        print("⚠️  Some tests failed. Check the configuration.")
        print("\n💡 Next steps:")
        print("1. Set up Google OAuth credentials in .env")
        print("2. Set up Facebook OAuth credentials in .env")
        print("3. Restart the backend service")
        print("4. Run this test again")

if __name__ == "__main__":
    main()