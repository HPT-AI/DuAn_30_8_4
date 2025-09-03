from typing import List
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.schemas.user import User, UserUpdate
from app.services.user_service import UserService
from app.utils.deps import get_current_active_user, get_current_admin_user
from app.models.user import User as UserModel, UserRole

router = APIRouter()


@router.get("/me", response_model=User)
def get_my_profile(
    current_user: UserModel = Depends(get_current_active_user)
):
    """
    Get current user profile
    """
    return current_user


@router.put("/me", response_model=User)
def update_my_profile(
    user_update: UserUpdate,
    current_user: UserModel = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Update current user profile
    """
    user_service = UserService(db)
    
    # Users can only update their own basic info
    allowed_fields = {"full_name", "password"}
    update_data = user_update.dict(exclude_unset=True)
    
    # Remove fields that users cannot update themselves
    filtered_update = {k: v for k, v in update_data.items() if k in allowed_fields}
    
    if not filtered_update:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No valid fields to update"
        )
    
    filtered_user_update = UserUpdate(**filtered_update)
    updated_user = user_service.update_user(current_user.id, filtered_user_update)
    
    if not updated_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return updated_user


@router.get("/", response_model=List[User])
def get_users(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    current_admin: UserModel = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """
    Get all users (Admin only)
    """
    user_service = UserService(db)
    users = user_service.get_users(skip=skip, limit=limit)
    return users


@router.get("/{user_id}", response_model=User)
def get_user(
    user_id: int,
    current_admin: UserModel = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """
    Get user by ID (Admin only)
    """
    user_service = UserService(db)
    user = user_service.get_user_by_id(user_id)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return user


@router.put("/{user_id}", response_model=User)
def update_user(
    user_id: int,
    user_update: UserUpdate,
    current_admin: UserModel = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """
    Update user by ID (Admin only)
    """
    user_service = UserService(db)
    updated_user = user_service.update_user(user_id, user_update)
    
    if not updated_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return updated_user


@router.post("/{user_id}/deactivate", response_model=User)
def deactivate_user(
    user_id: int,
    current_admin: UserModel = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """
    Deactivate user (Admin only)
    """
    user_service = UserService(db)
    user = user_service.deactivate_user(user_id)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return user


@router.post("/{user_id}/activate", response_model=User)
def activate_user(
    user_id: int,
    current_admin: UserModel = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """
    Activate user (Admin only)
    """
    user_service = UserService(db)
    user = user_service.activate_user(user_id)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return user


@router.post("/{user_id}/change-role", response_model=User)
def change_user_role(
    user_id: int,
    new_role: UserRole,
    current_admin: UserModel = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """
    Change user role (Admin only)
    """
    user_service = UserService(db)
    user = user_service.change_user_role(user_id, new_role)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return user