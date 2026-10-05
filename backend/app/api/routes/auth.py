import uuid
import logging
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Header, status
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.database.models import User
from app.schemas.auth import SignUpRequest, LoginRequest, AuthResponse, UserResponse, MessageResponse
from app.utils.security import hash_password, verify_password, validate_email, validate_password_strength

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/auth", tags=["User Authentication"])

def _build_user_response(user: User) -> UserResponse:
    return UserResponse(
        id=user.id,
        email=user.email,
        full_name=user.full_name,
        created_at=user.created_at
    )

@router.post("/signup", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
def signup(req: SignUpRequest, db: Session = Depends(get_db)):
    """
    Registers a new user account with email, password, and optional full name.
    Includes full email and password strength validations.
    """
    email = req.email.strip().lower()
    password = req.password

    # 1. Validate email format
    if not email or not validate_email(email):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid email address format. Please enter a valid email (e.g. user@example.com)."
        )

    # 2. Validate password strength
    is_valid_pwd, pwd_error = validate_password_strength(password)
    if not is_valid_pwd:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=pwd_error
        )

    # 3. Check for existing user
    existing_user = db.query(User).filter(User.email == email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email address already exists. Please log in."
        )

    # 4. Create new User record
    hashed_pwd = hash_password(password)
    new_user = User(
        email=email,
        hashed_password=hashed_pwd,
        full_name=req.full_name.strip() if req.full_name else email.split("@")[0].capitalize()
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # 5. Generate Auth Token
    token = f"token_{new_user.id}_{uuid.uuid4().hex[:16]}"
    logger.info(f"User signed up successfully: {new_user.email}")

    return AuthResponse(
        message="Account created successfully! Welcome to Google Photos AI Retrieval MVP.",
        token=token,
        user=_build_user_response(new_user)
    )

@router.post("/login", response_model=AuthResponse)
def login(req: LoginRequest, db: Session = Depends(get_db)):
    """
    Authenticates an existing user with email and password.
    """
    email = req.email.strip().lower()
    password = req.password

    if not email or not password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Please provide both email and password."
        )

    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password. Please check your credentials and try again."
        )

    if not verify_password(password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password. Please check your credentials and try again."
        )

    token = f"token_{user.id}_{uuid.uuid4().hex[:16]}"
    logger.info(f"User logged in successfully: {user.email}")

    return AuthResponse(
        message="Login successful! Welcome back.",
        token=token,
        user=_build_user_response(user)
    )

@router.get("/me", response_model=UserResponse)
def get_current_user_profile(authorization: Optional[str] = Header(None), db: Session = Depends(get_db)):
    """
    Retrieves profile information for authenticated user via Authorization header.
    """
    if not authorization or not authorization.startswith("token_"):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated. Please log in."
        )

    try:
        parts = authorization.split("_")
        user_id = int(parts[1])
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            raise HTTPException(status_code=401, detail="User session invalid.")
        return _build_user_response(user)
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid session token.")
