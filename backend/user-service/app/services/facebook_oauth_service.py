import requests
from typing import Optional, Dict, Any
from app.core.config import settings


class FacebookOAuthService:
    def __init__(self):
        self.app_id = settings.FACEBOOK_APP_ID
        self.app_secret = settings.FACEBOOK_APP_SECRET
        self.redirect_uri = settings.OAUTH_REDIRECT_URI
        
        if not self.app_id or not self.app_secret:
            raise ValueError("Facebook OAuth credentials not configured")
    
    def get_authorization_url(self, state: Optional[str] = None) -> str:
        """
        Generate Facebook OAuth authorization URL
        """
        base_url = "https://www.facebook.com/v18.0/dialog/oauth"
        params = {
            "client_id": self.app_id,
            "redirect_uri": self.redirect_uri,
            "scope": "email,public_profile",
            "response_type": "code",
            "state": state or ""
        }
        
        query_string = "&".join([f"{k}={v}" for k, v in params.items()])
        return f"{base_url}?{query_string}"
    
    def verify_facebook_token(self, access_token: str) -> Optional[Dict[str, Any]]:
        """
        Verify Facebook access token and return user info
        """
        try:
            print(f"[FACEBOOK-OAUTH] Verifying Facebook access token...")
            print(f"[FACEBOOK-OAUTH] Token length: {len(access_token)}")
            
            # First, verify the token is valid and get app token
            app_token_url = f"https://graph.facebook.com/oauth/access_token"
            app_token_params = {
                "client_id": self.app_id,
                "client_secret": self.app_secret,
                "grant_type": "client_credentials"
            }
            
            app_token_response = requests.get(app_token_url, params=app_token_params)
            if not app_token_response.ok:
                print(f"[FACEBOOK-OAUTH] Failed to get app token: {app_token_response.text}")
                return None
            
            app_token = app_token_response.json().get("access_token")
            
            # Verify the user token
            debug_url = f"https://graph.facebook.com/debug_token"
            debug_params = {
                "input_token": access_token,
                "access_token": app_token
            }
            
            debug_response = requests.get(debug_url, params=debug_params)
            if not debug_response.ok:
                print(f"[FACEBOOK-OAUTH] Token debug failed: {debug_response.text}")
                return None
            
            debug_data = debug_response.json().get("data", {})
            
            # Check if token is valid
            if not debug_data.get("is_valid", False):
                print(f"[FACEBOOK-OAUTH] Token is not valid")
                return None
            
            # Check if token is for our app
            if debug_data.get("app_id") != self.app_id:
                print(f"[FACEBOOK-OAUTH] Token is for different app")
                return None
            
            # Get user info
            user_info_url = f"https://graph.facebook.com/me"
            user_info_params = {
                "access_token": access_token,
                "fields": "id,name,email,picture"
            }
            
            user_response = requests.get(user_info_url, params=user_info_params)
            if not user_response.ok:
                print(f"[FACEBOOK-OAUTH] Failed to get user info: {user_response.text}")
                return None
            
            user_data = user_response.json()
            
            user_info = {
                'facebook_id': user_data.get('id'),
                'email': user_data.get('email', ''),
                'full_name': user_data.get('name', ''),
                'picture': user_data.get('picture', {}).get('data', {}).get('url', ''),
                'email_verified': True  # Facebook provides verified emails
            }
            
            print(f"[FACEBOOK-OAUTH] Extracted user info: {user_info}")
            return user_info
            
        except Exception as e:
            print(f"[FACEBOOK-OAUTH] Error verifying Facebook token: {e}")
            return None
    
    def exchange_code_for_token(self, code: str, state: Optional[str] = None) -> Optional[Dict[str, Any]]:
        """
        Exchange authorization code for access token and user info
        """
        try:
            print(f"[FACEBOOK-OAUTH] Exchanging code for access token...")
            
            # Exchange code for access token
            token_url = "https://graph.facebook.com/v18.0/oauth/access_token"
            token_params = {
                "client_id": self.app_id,
                "client_secret": self.app_secret,
                "redirect_uri": self.redirect_uri,
                "code": code
            }
            
            token_response = requests.get(token_url, params=token_params)
            if not token_response.ok:
                print(f"[FACEBOOK-OAUTH] Token exchange failed: {token_response.text}")
                return None
            
            token_data = token_response.json()
            access_token = token_data.get("access_token")
            
            if not access_token:
                print(f"[FACEBOOK-OAUTH] No access token in response")
                return None
            
            # Get user info using the access token
            return self.verify_facebook_token(access_token)
            
        except Exception as e:
            print(f"[FACEBOOK-OAUTH] Code exchange failed: {e}")
            return None