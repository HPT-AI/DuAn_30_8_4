from typing import List, Optional
from pydantic_settings import BaseSettings
from pydantic import model_validator
import os


class Settings(BaseSettings):
    # API
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "Authify User Service"
    DEBUG: bool = False
    
    # Database
    DATABASE_URL: str
    
    # JWT
    JWT_SECRET_KEY: str
    JWT_ALGORITHM: str = "HS256"
    JWT_ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    JWT_REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    
    # Redis
    REDIS_URL: str = "redis://localhost:6379/0"
    
    # CORS
    BACKEND_CORS_ORIGINS: List[str] = []
    
    @model_validator(mode="before")
    @classmethod
    def validate_cors_origins(cls, values):
        if isinstance(values, dict) and "BACKEND_CORS_ORIGINS" in values:
            v = values["BACKEND_CORS_ORIGINS"]
            if isinstance(v, str):
                if v.startswith("[") and v.endswith("]"):
                    # Handle JSON-like string
                    import json
                    try:
                        values["BACKEND_CORS_ORIGINS"] = json.loads(v)
                    except json.JSONDecodeError:
                        values["BACKEND_CORS_ORIGINS"] = [i.strip() for i in v.split(",") if i.strip()]
                else:
                    # Handle comma-separated string
                    values["BACKEND_CORS_ORIGINS"] = [i.strip() for i in v.split(",") if i.strip()]
            elif not isinstance(v, list):
                values["BACKEND_CORS_ORIGINS"] = []
        return values
    
    # Rate Limiting
    RATE_LIMIT_PER_MINUTE: int = 60
    
    # Security
    BCRYPT_ROUNDS: int = 12
    
    # Email (for future use)
    SMTP_TLS: bool = True
    SMTP_PORT: Optional[int] = None
    SMTP_HOST: Optional[str] = None
    SMTP_USER: Optional[str] = None
    SMTP_PASSWORD: Optional[str] = None
    EMAILS_FROM_EMAIL: Optional[str] = None
    EMAILS_FROM_NAME: Optional[str] = None

    model_config = {
        "env_file": ".env",
        "case_sensitive": True
    }


settings = Settings()