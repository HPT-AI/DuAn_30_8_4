from typing import Optional, List
from sqlalchemy.orm import Session
from sqlalchemy import and_
from datetime import datetime
from app.models.user import User, UserRole
from app.schemas.user import UserCreate, UserUpdate
from app.core.security import get_password_hash, verify_password


class UserService:
    def __init__(self, db: Session):
        self.db = db

    def get_user_by_id(self, user_id: int) -> Optional[User]:
        return self.db.query(User).filter(User.id == user_id).first()

    def get_user_by_email(self, email: str) -> Optional[User]:
        return self.db.query(User).filter(User.email == email).first()

    def get_users(self, skip: int = 0, limit: int = 100) -> List[User]:
        return self.db.query(User).offset(skip).limit(limit).all()

    def create_user(self, user_create: UserCreate) -> User:
        hashed_password = get_password_hash(user_create.password)
        db_user = User(
            email=user_create.email,
            hashed_password=hashed_password,
            full_name=user_create.full_name,
            is_active=user_create.is_active,
            role=user_create.role
        )
        self.db.add(db_user)
        self.db.commit()
        self.db.refresh(db_user)
        return db_user

    def create_oauth_user(self, user_create: UserCreate, provider: str) -> User:
        """
        Create user from OAuth provider (no password required)
        """
        db_user = User(
            email=user_create.email,
            hashed_password="",  # No password for OAuth users
            full_name=user_create.full_name,
            is_active=user_create.is_active,
            role=user_create.role,
            is_verified=getattr(user_create, 'is_verified', True)  # OAuth users are usually verified
        )
        self.db.add(db_user)
        self.db.commit()
        self.db.refresh(db_user)
        return db_user

    def update_user(self, user_id: int, user_update: UserUpdate) -> Optional[User]:
        db_user = self.get_user_by_id(user_id)
        if not db_user:
            return None
        
        update_data = user_update.dict(exclude_unset=True)
        
        if "password" in update_data:
            update_data["hashed_password"] = get_password_hash(update_data.pop("password"))
        
        for field, value in update_data.items():
            setattr(db_user, field, value)
        
        self.db.commit()
        self.db.refresh(db_user)
        return db_user

    def authenticate_user(self, email: str, password: str) -> Optional[User]:
        user = self.get_user_by_email(email)
        if not user:
            return None
        if not verify_password(password, user.hashed_password):
            return None
        if not user.is_active:
            return None
        
        # Update last login
        user.last_login = datetime.utcnow()
        self.db.commit()
        return user

    def deactivate_user(self, user_id: int) -> Optional[User]:
        db_user = self.get_user_by_id(user_id)
        if not db_user:
            return None
        
        db_user.is_active = False
        self.db.commit()
        self.db.refresh(db_user)
        return db_user

    def activate_user(self, user_id: int) -> Optional[User]:
        db_user = self.get_user_by_id(user_id)
        if not db_user:
            return None
        
        db_user.is_active = True
        self.db.commit()
        self.db.refresh(db_user)
        return db_user

    def change_user_role(self, user_id: int, new_role: UserRole) -> Optional[User]:
        db_user = self.get_user_by_id(user_id)
        if not db_user:
            return None
        
        db_user.role = new_role
        self.db.commit()
        self.db.refresh(db_user)
        return db_user

    def verify_user(self, user_id: int) -> Optional[User]:
        db_user = self.get_user_by_id(user_id)
        if not db_user:
            return None
        
        db_user.is_verified = True
        self.db.commit()
        self.db.refresh(db_user)
        return db_user