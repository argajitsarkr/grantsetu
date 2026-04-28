"""Business logic for grants — filtering, search, CRUD."""

import math
from datetime import datetime, timezone

from sqlalchemy import and_, case, func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.grant import Grant
from app.schemas.grant import GrantCreate, GrantUpdate
from app.utils.slug import generate_slug


async def list_grants(
    db: AsyncSession,
    *,
    agency: list[str] | None = None,
    status: str | None = "active",
    career_stage: str | None = None,
    subject_area: str | None = None,
    search: str | None = None,
    deadline_filter: str | None = None,
    budget_min: int | None = None,
    budget_max: int | None = None,
    sort: str = "deadline_asc",
    page: int = 1,
    per_page: int = 20,
) -> tuple[list[Grant], int]:
    """Query grants with filtering, full-text search, and pagination.

    Returns (grants, total_count).
    """
    query = select(Grant)
    count_query = select(func.count(Grant.id))

    conditions = []

    if status:
        conditions.append(Grant.status == status)

    if agency:
        conditions.append(Grant.agency.in_(agency))

    if career_stage:
        conditions.append(Grant.career_stages.any(career_stage))

    if subject_area:
        conditions.append(Grant.subject_areas.any(subject_area))

    if deadline_filter == "closing_soon":
        now = datetime.now(timezone.utc)
        conditions.append(Grant.deadline.isnot(None))
        conditions.append(Grant.deadline > now)
        conditions.append(
            Grant.deadline <= func.now() + func.cast("7 days", func.literal_column("interval"))
        )
    elif deadline_filter == "open_now":
        now = datetime.now(timezone.utc)
        conditions.append(
            or_(Grant.deadline.is_(None), Grant.deadline > now)
        )
    elif deadline_filter == "rolling":
        conditions.append(Grant.deadline.is_(None))

    if budget_min is not None:
        conditions.append(
            or_(Grant.budget_max >= budget_min, Grant.budget_max.is_(None))
        )
    if budget_max is not None:
        conditions.append(
            or_(Grant.budget_min <= budget_max, Grant.budget_min.is_(None))
        )

    if search:
        ts_query = func.plainto_tsquery("english", search)
        ts_vector = func.to_tsvector(
            "english",
            func.coalesce(Grant.title, "")
            + " "
            + func.coalesce(Grant.description, "")
            + " "
            + func.coalesce(Grant.scheme_name, ""),
        )
        conditions.append(ts_vector.op("@@")(ts_query))

    if conditions:
        query = query.where(and_(*conditions))
        count_query = count_query.where(and_(*conditions))

    # Sorting
    if sort == "deadline_asc":
        # Tiered order so visitors see actionable grants first:
        #   0) Upcoming (deadline in the future) - soonest first
        #   1) Rolling / no deadline
        #   2) Expired (deadline in the past) - most-recently-expired first
        now = datetime.now(timezone.utc)
        deadline_bucket = case(
            (Grant.deadline.is_(None), 1),
            (Grant.deadline >= now, 0),
            else_=2,
        )
        query = query.order_by(
            deadline_bucket.asc(),
            # Within bucket 0 ascending pulls soonest-upcoming to top;
            # within bucket 2 the same ascending keys would surface
            # oldest-expired first, so flip with a secondary descending key
            # that only fires for the expired bucket.
            case(
                (Grant.deadline >= now, Grant.deadline),
                else_=None,
            ).asc().nulls_last(),
            Grant.deadline.desc().nulls_last(),
        )
    elif sort == "deadline_desc":
        query = query.order_by(Grant.deadline.desc().nulls_last())
    elif sort == "newest":
        query = query.order_by(Grant.created_at.desc())
    elif sort == "budget_desc":
        query = query.order_by(Grant.budget_max.desc().nulls_last())
    else:
        query = query.order_by(Grant.created_at.desc())

    # Pagination
    offset = (page - 1) * per_page
    query = query.offset(offset).limit(per_page)

    result = await db.execute(query)
    grants = list(result.scalars().all())

    count_result = await db.execute(count_query)
    total = count_result.scalar() or 0

    return grants, total


async def get_grant_by_slug(db: AsyncSession, slug: str) -> Grant | None:
    """Fetch a single grant by its URL slug."""
    result = await db.execute(select(Grant).where(Grant.slug == slug))
    return result.scalar_one_or_none()


async def get_grant_by_id(db: AsyncSession, grant_id: int) -> Grant | None:
    """Fetch a single grant by ID."""
    result = await db.execute(select(Grant).where(Grant.id == grant_id))
    return result.scalar_one_or_none()


async def create_grant(db: AsyncSession, data: GrantCreate) -> Grant:
    """Create a new grant with auto-generated slug."""
    year = data.deadline.year if data.deadline else None
    slug = generate_slug(data.title, data.agency, year)

    # Ensure unique slug
    existing = await get_grant_by_slug(db, slug)
    if existing:
        slug = f"{slug}-{int(datetime.now(timezone.utc).timestamp())}"

    grant = Grant(slug=slug, **data.model_dump())
    db.add(grant)
    await db.flush()
    await db.refresh(grant)
    return grant


async def update_grant(db: AsyncSession, grant_id: int, data: GrantUpdate) -> Grant | None:
    """Update an existing grant. Only updates non-None fields."""
    grant = await get_grant_by_id(db, grant_id)
    if not grant:
        return None

    update_data = data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(grant, field, value)

    await db.flush()
    await db.refresh(grant)
    return grant


async def upsert_grant_by_url(db: AsyncSession, data: GrantCreate) -> tuple[Grant, bool]:
    """Insert or update a grant by its URL. Returns (grant, is_new)."""
    result = await db.execute(select(Grant).where(Grant.url == data.url))
    existing = result.scalar_one_or_none()

    if existing:
        update_data = data.model_dump(exclude={"url"})
        for field, value in update_data.items():
            if value is not None:
                setattr(existing, field, value)
        existing.scraped_at = datetime.now(timezone.utc)
        await db.flush()
        await db.refresh(existing)
        return existing, False

    grant = await create_grant(db, data)
    grant.scraped_at = datetime.now(timezone.utc)
    await db.flush()
    return grant, True


async def get_agency_counts(db: AsyncSession) -> list[dict]:
    """Get count of active grants per agency."""
    result = await db.execute(
        select(Grant.agency, func.count(Grant.id))
        .where(Grant.status == "active")
        .group_by(Grant.agency)
        .order_by(func.count(Grant.id).desc())
    )
    return [{"agency": row[0], "count": row[1]} for row in result.all()]


async def get_related_grants(
    db: AsyncSession, grant: Grant, limit: int = 5
) -> list[Grant]:
    """Get related grants by same agency or overlapping subject areas."""
    conditions = [
        Grant.id != grant.id,
        Grant.status == "active",
        or_(
            Grant.agency == grant.agency,
            Grant.subject_areas.overlap(grant.subject_areas) if grant.subject_areas else False,
        ),
    ]
    result = await db.execute(
        select(Grant).where(and_(*conditions)).limit(limit)
    )
    return list(result.scalars().all())
