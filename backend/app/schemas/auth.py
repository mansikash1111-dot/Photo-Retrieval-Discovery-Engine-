from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class SignUpRequest(BaseModel):
    email: str
    password: str
    full_name: Optional[str] = None

class LoginRequest(BaseModel):
    email: str
    password: str

class UserResponse(BaseModel):
    id: int
    email: str
    full_name: Optional[str] = None
    created_at: datetime

class AuthResponse(BaseModel):
    message: str
    token: str
    user: UserResponse

class MessageResponse(BaseModel):
    message: str
