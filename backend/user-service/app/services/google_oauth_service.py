from google.auth.transport import requests
from google.oauth2 import id_token
from google_auth_oauthlib.flow import Flow
from typing import Optional, Dict, Any
import os
from app.core.config import settings


class GoogleOAuthService:
    def __init__(self):
        self.client_id = settings.GOOGLE_CLIENT_ID
        self.client_secret = settings.GOOGLE_CLIENT_SECRET
        self.redirect_uri = settings.OAUTH_REDIRECT_URI
        
        if not self.client_id or not self.client_secret:
            raise ValueError("Google OAuth credentials not configured")
    
    def get_authorization_url(self, state: Optional[str] = None) -> str:
        """
        Generate Google OAuth authorization URL
        """
        flow = Flow.from_client_config(
            {
                "web": {
                    "client_id": self.client_id,
                    "client_secret": self.client_secret,
                    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                    "token_uri": "https://oauth2.googleapis.com/token",
                    "redirect_uris": [self.redirect_uri]
                }
            },
            scopes=['openid', 'email', 'profile']
        )
        flow.redirect_uri = self.redirect_uri
        
        authorization_url, _ = flow.authorization_url(
            access_type='offline',
            include_granted_scopes='true',
            state=state
        )
        
        return authorization_url
    
    def verify_google_token(self, token: str) -> Optional[Dict[str, Any]]:
        """
        Verify Google ID token and return user info
        """
        try:
            # First try to decode as base64 (from our frontend OAuth2 flow)
            import base64
            import json
            
            try:
                decoded_data = base64.b64decode(token).decode('utf-8')
                user_data = json.loads(decoded_data)
                
                # Validate that this contains the expected fields
                if 'email' in user_data and 'access_token' in user_data:
                    print(f"Decoded frontend OAuth2 token for user: {user_data.get('email')}")
                    return {
                        'google_id': user_data.get('id', ''),
                        'email': user_data['email'],
                        'full_name': user_data.get('name', ''),
                        'picture': user_data.get('picture', ''),
                        'email_verified': True  # OAuth2 flow ensures verified email
                    }
            except (base64.binascii.Error, json.JSONDecodeError, KeyError):
                # Not a base64 encoded token, try Google ID token verification
                pass
            
            # Fallback to Google ID token verification
            idinfo = id_token.verify_oauth2_token(
                token, 
                requests.Request(), 
                self.client_id
            )
            
            # Check if token is from Google
            if idinfo['iss'] not in ['accounts.google.com', 'https://accounts.google.com']:
                raise ValueError('Wrong issuer.')
            
            return {
                'google_id': idinfo['sub'],
                'email': idinfo['email'],
                'full_name': idinfo.get('name', ''),
                'picture': idinfo.get('picture', ''),
                'email_verified': idinfo.get('email_verified', False)
            }
            
        except ValueError as e:
            print(f"Token verification failed: {e}")
            return None
    
    def exchange_code_for_token(self, code: str, state: Optional[str] = None) -> Optional[Dict[str, Any]]:
        """
        Exchange authorization code for access token and user info
        """
        try:
            flow = Flow.from_client_config(
                {
                    "web": {
                        "client_id": self.client_id,
                        "client_secret": self.client_secret,
                        "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                        "token_uri": "https://oauth2.googleapis.com/token",
                        "redirect_uris": [self.redirect_uri]
                    }
                },
                scopes=['openid', 'email', 'profile']
            )
            flow.redirect_uri = self.redirect_uri
            
            # Exchange code for token
            flow.fetch_token(code=code)
            
            # Get user info from ID token
            credentials = flow.credentials
            if credentials.id_token:
                return self.verify_google_token(credentials.id_token)
            
            return None
            
        except Exception as e:
            print(f"Code exchange failed: {e}")
            return None