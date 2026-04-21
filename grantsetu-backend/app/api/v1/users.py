"""User endpoints."""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user
from app.config import settings
from app.database import get_db
from app.models.grant import Grant
from app.models.saved_grant import SavedGrant
from app.models.user import User
from app.schemas.grant import GrantListResponse
from app.schemas.user import UserResponse, UserSync, UserUpdate

router = APIRouter(prefix="/users", tags=["users"])


@router.post("/sync", response_model=UserResponse)
async def sync_user(data: UserSync, db: AsyncSession = Depends(get_db)) -> UserResponse:
    """Create or update user from NextAuth session."""
    email = data.email.lower()
    result = await db.execute(select(User).where(User.email == email))
    user = result.scalar_one_or_none()
    is_admin_email = email in [e.lower() for e in settings.admin_email_list]

    if user:
        user.name = data.name
        if data.image_url:
            user.image_url = data.image_url
        user.auth_provider = data.auth_provider
        if is_admin_email and not user.is_admin:
            user.is_admin = True
        # Google OAuth users are verified by Google - self-heal if previously false.
        if data.auth_provider == "google" and not user.email_verified:
            user.email_verified = True
    else:
        user = User(
            name=data.name,
            email=email,
            image_url=data.image_url,
            auth_provider=data.auth_provider,
            is_admin=is_admin_email,
            email_verified=(data.auth_provider == "google"),
        )
        db.add(user)

    await db.flush()
    await db.refresh(user)
    return UserResponse.model_validate(user)


@router.get("/me", response_model=UserResponse)
async def get_me(user: User = Depends(get_current_user)) -> UserResponse:
    """Get the authenticated user's profile."""
    return UserResponse.model_validate(user)


@router.patch("/me", response_model=UserResponse)
async def update_profile(
    data: UserUpdate,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> UserResponse:
    """Update the authenticated user's profile."""
    update_data = data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(user, field, value)

    await db.flush()
    await db.refresh(user)
    return UserResponse.model_validate(user)


@router.delete("/me", status_code=204)
async def delete_me(
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> None:
    """Permanently delete the authenticated user and all their data.

    saved_grants and alert_logs cascade via ondelete=CASCADE on the FK.
    """
    await db.delete(user)
    await db.flush()
    return None


@router.get("/grants/saved", response_model=list[GrantListResponse])
async def list_saved_grants(
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> list[GrantListResponse]:
    """List the authenticated user's saved grants."""
    result = await db.execute(
        select(Grant)
        .join(SavedGrant, SavedGrant.grant_id == Grant.id)
        .where(SavedGrant.user_id == user.id)
        .order_by(SavedGrant.created_at.desc())
    )
    grants = result.scalars().all()
    return [GrantListResponse.model_validate(g) for g in grants]


@router.post("/grants/{grant_id}/save")
async def save_grant(
    grant_id: int,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> dict:
    """Save/bookmark a grant."""
    # Check grant exists
    grant = await db.get(Grant, grant_id)
    if not grant:
        raise HTTPException(status_code=404, detail="Grant not found")

    # Check if already saved
    result = await db.execute(
        select(SavedGrant).where(
            SavedGrant.user_id == user.id, SavedGrant.grant_id == grant_id
        )
    )
    if result.scalar_one_or_none():
        return {"status": "already_saved"}

    db.add(SavedGrant(user_id=user.id, grant_id=grant_id))
    await db.flush()
    return {"status": "saved"}


@router.delete("/grants/{grant_id}/save")
async def unsave_grant(
    grant_id: int,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> dict:
    """Remove a saved grant."""
    result = await db.execute(
        select(SavedGrant).where(
            SavedGrant.user_id == user.id, SavedGrant.grant_id == grant_id
        )
    )
    saved = result.scalar_one_or_none()
    if not saved:
        raise HTTPException(status_code=404, detail="Grant not saved")

    await db.delete(saved)
    await db.flush()
    return {"status": "removed"}
