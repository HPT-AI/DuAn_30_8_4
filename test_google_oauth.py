import requests
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv('backend/user-service/.env')

client_id = os.getenv('GOOGLE_CLIENT_ID')
client_secret = os.getenv('GOOGLE_CLIENT_SECRET')
redirect_uri = os.getenv('OAUTH_REDIRECT_URI')

print(f"Client ID: {client_id}")
print(f"Client Secret: {client_secret}")
print(f"Redirect URI: {redirect_uri}")
print(f"Client Secret Length: {len(client_secret) if client_secret else 'None'}")

# Test if we can make a request to Google's token endpoint
test_data = {
    'client_id': client_id,
    'client_secret': client_secret,
    'redirect_uri': redirect_uri,
    'grant_type': 'authorization_code',
    'code': 'test_code'  # This will fail but we can see the error
}

try:
    response = requests.post('https://oauth2.googleapis.com/token', data=test_data)
    print(f"\nResponse Status: {response.status_code}")
    print(f"Response: {response.text}")
except Exception as e:
    print(f"Error: {e}")