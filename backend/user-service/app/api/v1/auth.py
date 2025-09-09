from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session
from pydantic import BaseModel
from app.db.database import get_db
from app.schemas.user import UserCreate, UserLogin, Token, User
from app.services.user_service import UserService
from app.services.google_oauth_service import GoogleOAuthService
from app.services.facebook_oauth_service import FacebookOAuthService
from app.core.security import create_access_token, create_refresh_token, verify_token
from app.utils.deps import get_current_active_user
from typing import Optional

router = APIRouter()
security = HTTPBearer()


@router.post("/register", response_model=User, status_code=status.HTTP_201_CREATED)
def register(
    user_create: UserCreate,
    db: Session = Depends(get_db)
):
    """
    Register a new user
    """
    user_service = UserService(db)
    
    # Check if user already exists
    existing_user = user_service.get_user_by_email(user_create.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create new user
    user = user_service.create_user(user_create)
    return user


@router.post("/login", response_model=Token)
def login(
    user_login: UserLogin,
    db: Session = Depends(get_db)
):
    """
    Login user and return JWT tokens
    """
    user_service = UserService(db)
    
    # Authenticate user
    user = user_service.authenticate_user(user_login.email, user_login.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Create tokens
    access_token = create_access_token(subject=user.id)
    refresh_token = create_refresh_token(subject=user.id)
    
    return Token(
        access_token=access_token,
        refresh_token=refresh_token,
        token_type="bearer"
    )


class RefreshTokenRequest(BaseModel):
    refresh_token: str

@router.post("/refresh", response_model=Token)
def refresh_token(
    request: RefreshTokenRequest,
    db: Session = Depends(get_db)
):
    """
    Refresh access token using refresh token
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    payload = verify_token(request.refresh_token)
    if payload is None:
        raise credentials_exception
    
    if payload.get("type") != "refresh":
        raise credentials_exception
    
    user_id: str = payload.get("sub")
    if user_id is None:
        raise credentials_exception
    
    user_service = UserService(db)
    user = user_service.get_user_by_id(int(user_id))
    if user is None or not user.is_active:
        raise credentials_exception
    
    # Create new tokens
    new_access_token = create_access_token(subject=user.id)
    new_refresh_token = create_refresh_token(subject=user.id)
    
    return Token(
        access_token=new_access_token,
        refresh_token=new_refresh_token,
        token_type="bearer"
    )


@router.get("/me", response_model=User)
def get_current_user_info(
    current_user: User = Depends(get_current_active_user)
):
    """
    Get current user information
    """
    return current_user


class TokenVerifyRequest(BaseModel):
    token: str

@router.post("/verify-token")
def verify_jwt_token(
    request: TokenVerifyRequest,
    db: Session = Depends(get_db)
):
    """
    Verify JWT token - for API Gateway and other services
    """
    payload = verify_token(request.token)
    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )
    
    if payload.get("type") != "access":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token type"
        )
    
    user_id = payload.get("sub")
    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload"
        )
    
    user_service = UserService(db)
    user = user_service.get_user_by_id(int(user_id))
    if user is None or not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found or inactive"
        )
    
    return {
        "valid": True,
        "user_id": user.id,
        "email": user.email,
        "role": user.role,
        "is_active": user.is_active
    }


# Google OAuth endpoints
class GoogleTokenRequest(BaseModel):
    token: str


@router.get("/google")
def google_login():
    """
    Initiate Google OAuth login
    """
    try:
        google_service = GoogleOAuthService()
        authorization_url = google_service.get_authorization_url()
        return {"authorization_url": authorization_url}
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@router.get("/google/callback")
def google_callback(
    code: str,
    state: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """
    Handle Google OAuth callback
    """
    try:
        google_service = GoogleOAuthService()
        user_info = google_service.exchange_code_for_token(code, state)

        if not user_info:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Failed to get user info from Google"
            )

        user_service = UserService(db)

        existing_user = user_service.get_user_by_email(user_info['email'])

        if existing_user:
            # User exists, log them in
            user = existing_user
        else:
            # Create new user
            user_create = UserCreate(
                email=user_info['email'],
                password="",
                full_name=user_info['full_name'],
                role="USER",
                is_active=True,
                is_verified=user_info['email_verified']
            )
            user = user_service.create_oauth_user(user_create, provider="google")

        access_token = create_access_token(subject=user.id)
        refresh_token = create_refresh_token(subject=user.id)

        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_type": "bearer",
            "user": {
                "id": user.id,
                "email": user.email,
                "full_name": user.full_name,
                "role": user.role,
                "is_active": user.is_active,
                "is_verified": user.is_verified
            }
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"OAuth callback failed: {str(e)}"
        )
# token
@router.post("/google/token", response_model=Token)
def google_token_login(
    request: GoogleTokenRequest,
    db: Session = Depends(get_db)
):
    """
    Login with Google ID token (for frontend direct integration)
    """
    try:
        print(f"[AUTH-ENDPOINT] Received Google token login request")
        print(f"[AUTH-ENDPOINT] Token length: {len(request.token) if request.token else 0}")
        
        # Initialize Google OAuth service
        try:
            google_service = GoogleOAuthService()
        except ValueError as e:
            print(f"[AUTH-ENDPOINT] Failed to initialize Google OAuth service: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Google OAuth service not configured properly"
            )
        
        # Verify Google token
        user_info = google_service.verify_google_token(request.token)
        
        if not user_info:
            print(f"[AUTH-ENDPOINT] Google token verification failed")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid Google token or token verification failed"
            )
        
        print(f"[AUTH-ENDPOINT] Google token verified for user: {user_info['email']}")
        
        user_service = UserService(db)
        
        # Check if user exists
        existing_user = user_service.get_user_by_email(user_info['email'])
        
        if existing_user:
            # User exists, log them in
            print(f"[AUTH-ENDPOINT] Existing user found: {existing_user.email}")
            user = existing_user
        else:
            # Create new user
            print(f"[AUTH-ENDPOINT] Creating new user for: {user_info['email']}")
            user_create = UserCreate(
                email=user_info['email'],
                password="",  # No password for OAuth users
                full_name=user_info['full_name'],
                role="USER",
                is_active=True,
                is_verified=user_info['email_verified']
            )
            user = user_service.create_oauth_user(user_create, provider="google")
            print(f"[AUTH-ENDPOINT] New user created with ID: {user.id}")
        
        # Create tokens
        print(f"[AUTH-ENDPOINT] Creating JWT tokens for user ID: {user.id}")
        access_token = create_access_token(subject=user.id)
        refresh_token = create_refresh_token(subject=user.id)
        
        print(f"[AUTH-ENDPOINT] Google authentication successful for: {user.email}")
        return Token(
            access_token=access_token,
            refresh_token=refresh_token,
            token_type="bearer"
        )
        
    except HTTPException:
        # Re-raise HTTP exceptions as-is
        raise
    except Exception as e:
        print(f"[AUTH-ENDPOINT] Unexpected error in Google token login: {e}")
        print(f"[AUTH-ENDPOINT] Error type: {type(e).__name__}")
        import traceback
        print(f"[AUTH-ENDPOINT] Traceback: {traceback.format_exc()}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Google authentication failed: {str(e)}"
        )


# Facebook OAuth endpoints
class FacebookTokenRequest(BaseModel):
    token: str


@router.get("/facebook")
def facebook_login():
    """
    Initiate Facebook OAuth login
    """
    try:
        facebook_service = FacebookOAuthService()
        authorization_url = facebook_service.get_authorization_url()
        return {"authorization_url": authorization_url}
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@router.get("/facebook/callback")
def facebook_callback(
    code: str,
    state: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """
    Handle Facebook OAuth callback
    """
    try:
        facebook_service = FacebookOAuthService()
        user_info = facebook_service.exchange_code_for_token(code, state)

        if not user_info:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Failed to get user info from Facebook"
            )

        user_service = UserService(db)

        existing_user = user_service.get_user_by_email(user_info['email'])

        if existing_user:
            # User exists, log them in
            user = existing_user
        else:
            # Create new user
            user_create = UserCreate(
                email=user_info['email'],
                password="",
                full_name=user_info['full_name'],
                role="USER",
                is_active=True,
                is_verified=user_info['email_verified']
            )
            user = user_service.create_oauth_user(user_create, provider="facebook")

        access_token = create_access_token(subject=user.id)
        refresh_token = create_refresh_token(subject=user.id)

        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_type": "bearer",
            "user": {
                "id": user.id,
                "email": user.email,
                "full_name": user.full_name,
                "role": user.role,
                "is_active": user.is_active,
                "is_verified": user.is_verified
            }
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Facebook OAuth callback failed: {str(e)}"
        )


@router.post("/facebook/token", response_model=Token)
def facebook_token_login(
    request: FacebookTokenRequest,
    db: Session = Depends(get_db)
):
    """
    Login with Facebook access token (for frontend direct integration)
    """
    try:
        print(f"[AUTH-ENDPOINT] Received Facebook token login request")
        print(f"[AUTH-ENDPOINT] Token length: {len(request.token) if request.token else 0}")
        
        # Initialize Facebook OAuth service
        try:
            facebook_service = FacebookOAuthService()
        except ValueError as e:
            print(f"[AUTH-ENDPOINT] Failed to initialize Facebook OAuth service: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Facebook OAuth service not configured properly"
            )
        
        # Verify Facebook token
        user_info = facebook_service.verify_facebook_token(request.token)
        
        if not user_info:
            print(f"[AUTH-ENDPOINT] Facebook token verification failed")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid Facebook token or token verification failed"
            )
        
        print(f"[AUTH-ENDPOINT] Facebook token verified for user: {user_info['email']}")
        
        user_service = UserService(db)
        
        # Check if user exists
        existing_user = user_service.get_user_by_email(user_info['email'])
        
        if existing_user:
            # User exists, log them in
            print(f"[AUTH-ENDPOINT] Existing user found: {existing_user.email}")
            user = existing_user
        else:
            # Create new user
            print(f"[AUTH-ENDPOINT] Creating new user for: {user_info['email']}")
            user_create = UserCreate(
                email=user_info['email'],
                password="",  # No password for OAuth users
                full_name=user_info['full_name'],
                role="USER",
                is_active=True,
                is_verified=user_info['email_verified']
            )
            user = user_service.create_oauth_user(user_create, provider="facebook")
            print(f"[AUTH-ENDPOINT] New user created with ID: {user.id}")
        
        # Create tokens
        print(f"[AUTH-ENDPOINT] Creating JWT tokens for user ID: {user.id}")
        access_token = create_access_token(subject=user.id)
        refresh_token = create_refresh_token(subject=user.id)
        
        print(f"[AUTH-ENDPOINT] Facebook authentication successful for: {user.email}")
        return Token(
            access_token=access_token,
            refresh_token=refresh_token,
            token_type="bearer"
        )
        
    except HTTPException:
        # Re-raise HTTP exceptions as-is
        raise
    except Exception as e:
        print(f"[AUTH-ENDPOINT] Unexpected error in Facebook token login: {e}")
        print(f"[AUTH-ENDPOINT] Error type: {type(e).__name__}")
        import traceback
        print(f"[AUTH-ENDPOINT] Traceback: {traceback.format_exc()}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Facebook authentication failed: {str(e)}"
        )