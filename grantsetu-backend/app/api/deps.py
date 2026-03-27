"""Authentication dependencies for FastAPI endpoints."""

import logging

import jwt
from fastapi import Depends, HTTPException, Request
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.database import get_db
from app.models.user import User

logger = logging.getLogger(__name__)


def _extract_token(request: Request) -> str | None:
    """Extract Bearer token from Authorization header."""
    auth_header = request.headers.get("Authorization")
    if auth_header and auth_header.startswith("Bearer "):
        return auth_header[7:]
    return None


def _decode_token(token: str) -> dict:
    """Decode and verify a JWT signed with NEXTAUTH_SECRET (HS256)."""
    try:
        payload = jwt.decode(
            token,
            settings.NEXTAUTH_SECRET,
            algorithms=["HS256"],
        )
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError as e:
        logger.warning(f"Invalid token: {e}")
        raise HTTPException(status_code=401, detail="Invalid token")


async def get_current_user(
    request: Request, db: AsyncSession = Depends(get_db)
) -> User:
    """FastAPI dependency that extracts and validates the authenticated user."""
    token = _extract_token(request)
    if not token:
        raise HTTPException(status_code=401, detail="Authentication required")

    payload = _decode_token(token)
    email = payload.get("email")
    if not email:
        raise HTTPException(status_code=401, detail="Invalid token: no email")

    result = await db.execute(select(User).where(User.email == email))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    return user


async def get_optional_user(
    request: Request, db: AsyncSession = Depends(get_db)
) -> User | None:
    """Same as get_current_user but returns None instead of raising 401."""
    token = _extract_token(request)
    if not token:
        return None

    try:
        payload = _decode_token(token)
    except HTTPException:
        return None

    email = payload.get("email")
    if not email:
        return None

    result = await db.execute(select(User).where(User.email == email))
    return result.scalar_one_or_none()


async def require_admin(request: Request, db: AsyncSession = Depends(get_db)) -> None:
    """FastAPI dependency that enforces admin access.

    Accepts either:
    - An Admin_Token JWT with role="admin" (issued by /admin/login)
    - A user JWT where the corresponding User.is_admin is True (Google OAuth path)

    Raises HTTP 401 for missing/invalid/expired tokens.
    Raises HTTP 403 for valid tokens belonging to non-admin users.
    """
    token = _extract_token(request)
    if not token:
        raise HTTPException(status_code=401, detail="Authentication required")

    payload = _decode_token(token)  # raises 401 on expired/invalid

    # Admin_Token path: JWT has role="admin"
    if payload.get("role") == "admin":
        return

    # Google OAuth path: JWT has email, look up user in DB
    email = payload.get("email")
    if not email:
        raise HTTPException(status_code=401, detail="Authentication required")

    result = await db.execute(select(User).where(User.email == email))
    user = result.scalar_one_or_none()

    if user is None:
        raise HTTPException(status_code=401, detail="Authentication required")

    if not user.is_admin:
        raise HTTPException(status_code=403, detail="Admin access required")
