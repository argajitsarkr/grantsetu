"""Public grant API endpoints."""

import math

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user
from app.database import get_db
from app.models.user import User
from app.schemas.common import PaginatedResponse
from app.schemas.grant import AgencyCount, GrantListResponse, GrantResponse
from app.services import grant_service
from app.services.recommendation_service import get_recommended_grants

router = APIRouter(prefix="/grants", tags=["grants"])


@router.get("", response_model=PaginatedResponse[GrantListResponse])
async def list_grants(
    agency: list[str] | None = Query(None),
    status: str | None = Query("active"),
    career_stage: str | None = Query(None),
    subject_area: str | None = Query(None),
    search: str | None = Query(None),
    deadline_filter: str | None = Query(None, alias="deadline"),
    budget_min: int | None = Query(None),
    budget_max: int | None = Query(None),
    sort: str = Query("deadline_asc"),
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
) -> PaginatedResponse[GrantListResponse]:
    """List grants with filtering, search, and pagination."""
    grants, total = await grant_service.list_grants(
        db,
        agency=agency,
        status=status,
        career_stage=career_stage,
        subject_area=subject_area,
        search=search,
        deadline_filter=deadline_filter,
        budget_min=budget_min,
        budget_max=budget_max,
        sort=sort,
        page=page,
        per_page=per_page,
    )
    return PaginatedResponse(
        items=[GrantListResponse.model_validate(g) for g in grants],
        total=total,
        page=page,
        per_page=per_page,
        pages=math.ceil(total / per_page) if total > 0 else 0,
    )


@router.get("/agencies", response_model=list[AgencyCount])
async def list_agencies(db: AsyncSession = Depends(get_db)) -> list[AgencyCount]:
    """Get list of agencies with active grant counts."""
    counts = await grant_service.get_agency_counts(db)
    return [AgencyCount(**c) for c in counts]


@router.get("/recommended", response_model=list[GrantListResponse])
async def recommended_grants(
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> list[GrantListResponse]:
    """Get grants recommended for the authenticated user based on their profile."""
    grants = await get_recommended_grants(db, user)
    return [GrantListResponse.model_validate(g) for g in grants]


@router.get("/{slug}", response_model=GrantResponse)
async def get_grant(slug: str, db: AsyncSession = Depends(get_db)) -> GrantResponse:
    """Get a single grant by its URL slug."""
    grant = await grant_service.get_grant_by_slug(db, slug)
    if not grant:
        raise HTTPException(status_code=404, detail="Grant not found")
    return GrantResponse.model_validate(grant)
