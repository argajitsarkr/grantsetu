"""Email/password authentication endpoints.

Credentials flow for users who don't want Google OAuth:
  POST /auth/register — create account with email + password
  POST /auth/login    — verify credentials, return signed JWT

The returned token uses the same HS256/NEXTAUTH_SECRET signing as the
Google OAuth path, so downstream deps (get_current_user) accept both.
"""

from __future__ import annotations

import secrets
import time
from datetime import datetime, timedelta, timezone

import bcrypt
import jwt
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import RedirectResponse
from pydantic import BaseModel, EmailStr, Field
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user
from app.config import settings
from app.database import get_db
from app.models.user import User
from app.schemas.user import UserResponse
from app.services import email_service

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
    is_admin = email in [e.lower() for e in settings.admin_email_list]
    verification_token = secrets.token_urlsafe(32)
    user = User(
        name=data.name.strip(),
        email=email,
        password_hash=password_hash,
        auth_provider="credentials",
        is_admin=is_admin,
        email_verified=False,
        email_verification_token=verification_token,
        email_verification_sent_at=datetime.now(timezone.utc),
    )
    db.add(user)
    await db.flush()
    await db.refresh(user)

    email_service.send_verification_email(user.email, user.name, verification_token)

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

    # Self-heal: promote admin if email is in ADMIN_EMAILS but flag is stale.
    if not user.is_admin and email in [e.lower() for e in settings.admin_email_list]:
        user.is_admin = True
        await db.flush()
        await db.refresh(user)

    return AuthResponse(
        access_token=_sign_token(user),
        user=UserResponse.model_validate(user),
    )


# ---------------------------------------------------------------------------
# Email verification + password reset + change password
# ---------------------------------------------------------------------------

_RESEND_COOLDOWN_SECONDS = 60


class EmailOnly(BaseModel):
    email: EmailStr


class ResetPasswordRequest(BaseModel):
    token: str = Field(min_length=10, max_length=128)
    new_password: str = Field(min_length=8, max_length=128)


class ChangePasswordRequest(BaseModel):
    current_password: str = Field(min_length=1, max_length=128)
    new_password: str = Field(min_length=8, max_length=128)


def _cooldown_active(sent_at: datetime | None) -> bool:
    if sent_at is None:
        return False
    now = datetime.now(timezone.utc)
    ref = sent_at if sent_at.tzinfo else sent_at.replace(tzinfo=timezone.utc)
    return (now - ref).total_seconds() < _RESEND_COOLDOWN_SECONDS


@router.post("/send-verification", status_code=200)
async def send_verification(data: EmailOnly, db: AsyncSession = Depends(get_db)) -> dict:
    """Re-issue a verification link. Always returns 200 to avoid enumeration."""
    email = data.email.lower()
    result = await db.execute(select(User).where(User.email == email))
    user = result.scalar_one_or_none()

    if user is not None and not user.email_verified and not _cooldown_active(user.email_verification_sent_at):
        user.email_verification_token = secrets.token_urlsafe(32)
        user.email_verification_sent_at = datetime.now(timezone.utc)
        await db.flush()
        email_service.send_verification_email(user.email, user.name, user.email_verification_token)

    return {"status": "ok"}


@router.get("/verify")
async def verify_email(token: str, db: AsyncSession = Depends(get_db)) -> RedirectResponse:
    """Verify email by token. Redirects back to the frontend with a flag."""
    front = settings.FRONTEND_URL.rstrip("/")
    if not token:
        return RedirectResponse(f"{front}/auth/verify?error=missing", status_code=302)

    result = await db.execute(select(User).where(User.email_verification_token == token))
    user = result.scalar_one_or_none()
    if user is None:
        return RedirectResponse(f"{front}/auth/verify?error=invalid", status_code=302)

    user.email_verified = True
    user.email_verification_token = None
    await db.flush()
    return RedirectResponse(f"{front}/auth/verify?ok=1", status_code=302)


@router.post("/forgot-password", status_code=200)
async def forgot_password(data: EmailOnly, db: AsyncSession = Depends(get_db)) -> dict:
    """Send a password reset link. Always returns 200 to avoid enumeration."""
    email = data.email.lower()
    result = await db.execute(select(User).where(User.email == email))
    user = result.scalar_one_or_none()

    if (
        user is not None
        and user.password_hash
        and not _cooldown_active(user.email_verification_sent_at)
    ):
        user.password_reset_token = secrets.token_urlsafe(32)
        user.password_reset_expires_at = datetime.now(timezone.utc) + timedelta(hours=1)
        user.email_verification_sent_at = datetime.now(timezone.utc)  # reuse as rate-limit marker
        await db.flush()
        email_service.send_password_reset_email(user.email, user.name, user.password_reset_token)

    return {"status": "ok"}


@router.post("/reset-password", response_model=AuthResponse)
async def reset_password(data: ResetPasswordRequest, db: AsyncSession = Depends(get_db)) -> AuthResponse:
    """Verify reset token, set new password, return a fresh JWT."""
    result = await db.execute(select(User).where(User.password_reset_token == data.token))
    user = result.scalar_one_or_none()
    invalid = HTTPException(status_code=400, detail="This reset link is invalid or has expired.")

    if user is None or user.password_reset_expires_at is None:
        raise invalid

    now = datetime.now(timezone.utc)
    exp = user.password_reset_expires_at
    if not exp.tzinfo:
        exp = exp.replace(tzinfo=timezone.utc)
    if exp < now:
        raise invalid

    user.password_hash = bcrypt.hashpw(data.new_password.encode(), bcrypt.gensalt()).decode()
    user.password_reset_token = None
    user.password_reset_expires_at = None
    await db.flush()
    await db.refresh(user)

    email_service.send_password_changed_notice(user.email, user.name)

    return AuthResponse(
        access_token=_sign_token(user),
        user=UserResponse.model_validate(user),
    )


@router.post("/change-password", status_code=200)
async def change_password(
    data: ChangePasswordRequest,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> dict:
    """Authenticated user changes their own password."""
    if not user.password_hash:
        raise HTTPException(
            status_code=400,
            detail="This account signs in with Google. Manage your password at myaccount.google.com.",
        )
    if not bcrypt.checkpw(data.current_password.encode(), user.password_hash.encode()):
        raise HTTPException(status_code=400, detail="Current password is incorrect.")

    user.password_hash = bcrypt.hashpw(data.new_password.encode(), bcrypt.gensalt()).decode()
    await db.flush()

    email_service.send_password_changed_notice(user.email, user.name)
    return {"status": "ok"}
