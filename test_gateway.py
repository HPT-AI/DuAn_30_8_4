#!/usr/bin/env python3
"""
Simple API Gateway proxy for testing integration
Simulates Kong Gateway routing to User Service
"""

import asyncio
import json
from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import httpx
import uvicorn

app = FastAPI(title="Test API Gateway", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:12000",
        "https://work-1-qivpqxdxprbfynjb.prod-runtime.all-hands.dev",
        "https://work-2-qivpqxdxprbfynjb.prod-runtime.all-hands.dev"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# User Service URL
USER_SERVICE_URL = "http://localhost:8002"

@app.get("/health")
async def health_check():
    """Gateway health check"""
    return {"status": "healthy", "service": "test-api-gateway"}

@app.api_route("/api/v1/auth/{path:path}", methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"])
async def proxy_auth(path: str, request: Request):
    """Proxy authentication requests to User Service"""
    return await proxy_request(f"/api/v1/auth/{path}", request)

@app.api_route("/api/v1/users/{path:path}", methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"])
async def proxy_users(path: str, request: Request):
    """Proxy user requests to User Service"""
    return await proxy_request(f"/api/v1/users/{path}", request)

async def proxy_request(path: str, request: Request):
    """Generic proxy function"""
    try:
        # Get request data
        headers = dict(request.headers)
        # Remove host header to avoid conflicts
        headers.pop("host", None)
        
        # Get request body
        body = None
        if request.method in ["POST", "PUT", "PATCH"]:
            body = await request.body()
        
        # Make request to User Service
        async with httpx.AsyncClient() as client:
            response = await client.request(
                method=request.method,
                url=f"{USER_SERVICE_URL}{path}",
                headers=headers,
                content=body,
                params=request.query_params,
                timeout=30.0
            )
            
            # Return response
            return JSONResponse(
                content=response.json() if response.headers.get("content-type", "").startswith("application/json") else response.text,
                status_code=response.status_code,
                headers=dict(response.headers)
            )
            
    except httpx.RequestError as e:
        print(f"Request error: {e}")
        raise HTTPException(status_code=503, detail="Service unavailable")
    except Exception as e:
        print(f"Proxy error: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

if __name__ == "__main__":
    print("🚀 Starting Test API Gateway on port 8080...")
    print("📡 Proxying requests to User Service at http://localhost:8001")
    uvicorn.run(app, host="0.0.0.0", port=8080)