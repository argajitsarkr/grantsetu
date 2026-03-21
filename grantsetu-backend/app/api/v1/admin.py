"""Admin endpoints — protected, requires is_admin=True."""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.grant import Grant
from app.models.scraper_run import ScraperRun
from app.models.user import User
from app.schemas.grant import GrantCreate, GrantResponse, GrantUpdate
from app.services.grant_service import create_grant, get_grant_by_id, update_grant

router = APIRouter(prefix="/admin", tags=["admin"])


@router.get("/stats")
async def admin_stats(db: AsyncSession = Depends(get_db)) -> dict:
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
    data: GrantCreate, db: AsyncSession = Depends(get_db)
) -> GrantResponse:
    """Create a grant manually."""
    grant = await create_grant(db, data)
    return GrantResponse.model_validate(grant)


@router.put("/grants/{grant_id}", response_model=GrantResponse)
async def admin_update_grant(
    grant_id: int, data: GrantUpdate, db: AsyncSession = Depends(get_db)
) -> GrantResponse:
    """Update an existing grant."""
    grant = await update_grant(db, grant_id, data)
    if not grant:
        raise HTTPException(status_code=404, detail="Grant not found")
    return GrantResponse.model_validate(grant)


@router.delete("/grants/{grant_id}")
async def admin_delete_grant(
    grant_id: int, db: AsyncSession = Depends(get_db)
) -> dict:
    """Soft delete a grant (set status to expired)."""
    grant = await get_grant_by_id(db, grant_id)
    if not grant:
        raise HTTPException(status_code=404, detail="Grant not found")
    grant.status = "expired"
    await db.flush()
    return {"status": "deleted", "id": grant_id}


@router.post("/scrapers/run")
async def admin_run_scraper(agency: str = "all") -> dict:
    """Trigger scraper manually via Celery."""
    from app.tasks.scraper_tasks import run_all_scrapers, run_scraper

    if agency == "all":
        run_all_scrapers.delay()
        return {"status": "queued", "agency": "all"}
    else:
        run_scraper.delay(agency)
        return {"status": "queued", "agency": agency}


@router.get("/scrapers/health")
async def admin_scraper_health(db: AsyncSession = Depends(get_db)) -> list[dict]:
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
