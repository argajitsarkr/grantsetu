"""Alert subscription endpoints."""

from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.user import User
from app.schemas.user import AlertSubscribe

router = APIRouter(prefix="/alerts", tags=["alerts"])


@router.post("/subscribe")
async def subscribe_alerts(
    data: AlertSubscribe, db: AsyncSession = Depends(get_db)
) -> dict:
    """Subscribe to grant email alerts. Creates or updates user."""
    result = await db.execute(select(User).where(User.email == data.email))
    user = result.scalar_one_or_none()

    if user:
        user.alert_enabled = True
        user.alert_frequency = data.frequency
        user.subject_areas = data.subject_areas
        user.career_stage = data.career_stage
        user.alert_agencies = data.agencies
    else:
        user = User(
            name=data.email.split("@")[0],
            email=data.email,
            alert_enabled=True,
            alert_frequency=data.frequency,
            subject_areas=data.subject_areas,
            career_stage=data.career_stage,
            alert_agencies=data.agencies,
            auth_provider="email",
        )
        db.add(user)

    await db.flush()
    return {"status": "subscribed", "frequency": data.frequency}
