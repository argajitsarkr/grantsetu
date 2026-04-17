"""Email/password authentication endpoints.

Credentials flow for users who don't want Google OAuth:
  POST /auth/register — create account with email + password
  POST /auth/login    — verify credentials, return signed JWT

The returned token uses the same HS256/NEXTAUTH_SECRET signing as the
Google OAuth path, so downstream deps (get_current_user) accept both.
"""

from __future__ import annotations

import time

import bcrypt
import jwt
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, EmailStr, Field
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.database import get_db
from app.models.user import User
from app.schemas.user import UserResponse

router = APIRouter(prefix="/auth", tags=["auth"])


class RegisterRequest(BaseModel):
    name: str = Field(min_length=1, max_length=255)
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)


class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=1, max_length=128)


class AuthResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


def _sign_token(user: User) -> str:
    now = int(time.time())
    payload = {
        "email": user.email,
        "name": user.name,
        "sub": str(user.id),
        "iat": now,
        "exp": now + 60 * 60 * 24 * 30,  # 30 days
    }
    return jwt.encode(payload, settings.NEXTAUTH_SECRET, algorithm="HS256")


@router.post("/register", response_model=AuthResponse, status_code=201)
async def register(data: RegisterRequest, db: AsyncSession = Depends(get_db)) -> AuthResponse:
    """Create a new account with email + password."""
    email = data.email.lower()
    existing = await db.execute(select(User).where(User.email == email))
    user = existing.scalar_one_or_none()

    if user is not None:
        # If the user was created via Google OAuth and has no password set,
        # refuse rather than silently overwriting — they should sign in with Google.
        if user.password_hash:
            raise HTTPException(status_code=409, detail="An account with this email already exists")
        raise HTTPException(
            status_code=409,
            detail="This email is already registered via Google. Please sign in with Google.",
        )

    password_hash = bcrypt.hashpw(data.password.encode(), bcrypt.gensalt()).decode()
    user = User(
        name=data.name.strip(),
        email=email,
        password_hash=password_hash,
        auth_provider="credentials",
    )
    db.add(user)
    await db.flush()
    await db.refresh(user)

    return AuthResponse(
        access_token=_sign_token(user),
        user=UserResponse.model_validate(user),
    )


@router.post("/login", response_model=AuthResponse)
async def login(data: LoginRequest, db: AsyncSession = Depends(get_db)) -> AuthResponse:
    """Verify email/password and return a signed JWT."""
    email = data.email.lower()
    result = await db.execute(select(User).where(User.email == email))
    user = result.scalar_one_or_none()

    # Uniform error to avoid user enumeration.
    invalid = HTTPException(status_code=401, detail="Invalid email or password")

    if user is None or not user.password_hash:
        raise invalid

    if not bcrypt.checkpw(data.password.encode(), user.password_hash.encode()):
        raise invalid

    return AuthResponse(
        access_token=_sign_token(user),
        user=UserResponse.model_validate(user),
    )
