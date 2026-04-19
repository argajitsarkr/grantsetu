"""Admin endpoints — protected, requires is_admin=True."""

import time

import bcrypt
import jwt
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import require_admin
from app.config import settings
from app.database import get_db
from app.models.grant import Grant
from app.models.scraper_run import ScraperRun
from app.models.user import User
from app.schemas.admin import AdminLoginRequest, AdminTokenResponse
from app.schemas.grant import GrantCreate, GrantResponse, GrantUpdate
from app.services.grant_service import create_grant, get_grant_by_id, update_grant

router = APIRouter(prefix="/admin", tags=["admin"])


@router.post("/login", response_model=AdminTokenResponse)
async def admin_login(data: AdminLoginRequest) -> AdminTokenResponse:
    """Authenticate with admin credentials and return a signed JWT."""
    from app.main import _admin_password_hash

    username_ok = data.username == settings.ADMIN_USERNAME
    password_ok = username_ok and bcrypt.checkpw(
        data.password.encode(), _admin_password_hash.encode()
    )

    if not (username_ok and password_ok):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    now = int(time.time())
    payload = {
        "role": "admin",
        "sub": "admin",
        "iat": now,
        "exp": now + 86400,
    }
    token = jwt.encode(payload, settings.NEXTAUTH_SECRET, algorithm="HS256")
    return AdminTokenResponse(access_token=token)


@router.get("/stats")
async def admin_stats(
    _: None = Depends(require_admin), db: AsyncSession = Depends(get_db)
) -> dict:
    """Get admin dashboard statistics."""
    grants_total = (await db.execute(select(func.count(Grant.id)))).scalar() or 0
    grants_active = (
        await db.execute(select(func.count(Grant.id)).where(Grant.status == "active"))
    ).scalar() or 0
    users_total = (await db.execute(select(func.count(User.id)))).scalar() or 0
    alerts_enabled = (
        await db.execute(select(func.count(User.id)).where(User.alert_enabled.is_(True)))
    ).scalar() or 0

    return {
        "grants_total": grants_total,
        "grants_active": grants_active,
        "users_total": users_total,
        "alerts_enabled": alerts_enabled,
    }


@router.post("/grants", response_model=GrantResponse)
async def admin_create_grant(
    data: GrantCreate,
    _: None = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
) -> GrantResponse:
    """Create a grant manually."""
    grant = await create_grant(db, data)
    return GrantResponse.model_validate(grant)


@router.put("/grants/{grant_id}", response_model=GrantResponse)
async def admin_update_grant(
    grant_id: int,
    data: GrantUpdate,
    _: None = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
) -> GrantResponse:
    """Update an existing grant."""
    grant = await update_grant(db, grant_id, data)
    if not grant:
        raise HTTPException(status_code=404, detail="Grant not found")
    return GrantResponse.model_validate(grant)


@router.delete("/grants/{grant_id}")
async def admin_delete_grant(
    grant_id: int,
    hard: bool = False,
    _: None = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
) -> dict:
    """Delete a grant. Default soft-delete (status=expired); pass ?hard=true to remove the row."""
    grant = await get_grant_by_id(db, grant_id)
    if not grant:
        raise HTTPException(status_code=404, detail="Grant not found")
    if hard:
        await db.delete(grant)
        await db.flush()
        return {"status": "removed", "id": grant_id}
    grant.status = "expired"
    await db.flush()
    return {"status": "expired", "id": grant_id}


@router.get("/users")
async def admin_list_users(
    _: None = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
    page: int = 1,
    per_page: int = 50,
) -> dict:
    """List all users (admin only)."""
    offset = (page - 1) * per_page
    total = (await db.execute(select(func.count(User.id)))).scalar() or 0
    result = await db.execute(
        select(User).order_by(User.created_at.desc()).offset(offset).limit(per_page)
    )
    users = result.scalars().all()
    return {
        "total": total,
        "page": page,
        "per_page": per_page,
        "items": [
            {
                "id": u.id,
                "email": u.email,
                "name": u.name,
                "institution": u.institution,
                "career_stage": u.career_stage,
                "is_admin": u.is_admin,
                "onboarding_completed": u.onboarding_completed,
                "auth_provider": u.auth_provider,
                "created_at": u.created_at.isoformat() if u.created_at else None,
            }
            for u in users
        ],
    }


@router.post("/scrapers/run")
async def admin_run_scraper(
    agency: str = "all", _: None = Depends(require_admin)
) -> dict:
    """Trigger scraper manually via Celery."""
    from app.tasks.scraper_tasks import run_all_scrapers, run_scraper

    if agency == "all":
        run_all_scrapers.delay()
        return {"status": "queued", "agency": "all"}
    else:
        run_scraper.delay(agency)
        return {"status": "queued", "agency": agency}


@router.get("/scrapers/health")
async def admin_scraper_health(
    _: None = Depends(require_admin), db: AsyncSession = Depends(get_db)
) -> list[dict]:
    """Get recent scraper run history."""
    result = await db.execute(
        select(ScraperRun).order_by(ScraperRun.started_at.desc()).limit(20)
    )
    runs = result.scalars().all()
    return [
        {
            "id": run.id,
            "agency": run.agency,
            "started_at": run.started_at.isoformat() if run.started_at else None,
            "finished_at": run.finished_at.isoformat() if run.finished_at else None,
            "status": run.status,
            "grants_found": run.grants_found,
            "grants_new": run.grants_new,
            "error_message": run.error_message,
        }
        for run in runs
    ]
