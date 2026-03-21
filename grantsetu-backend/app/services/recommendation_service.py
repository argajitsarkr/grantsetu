"""Grant recommendation service — matches grants to user profile."""

import logging
from datetime import date, datetime, timezone

from sqlalchemy import and_, func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.grant import Grant
from app.models.user import User

logger = logging.getLogger(__name__)


def _calculate_user_age(dob: date) -> int:
    """Calculate age from date of birth."""
    today = date.today()
    return today.year - dob.year - ((today.month, today.day) < (dob.month, dob.day))


def _score_grant(grant: Grant, user: User) -> float:
    """Score a grant against a user profile. Higher = better match."""
    score = 0.0

    # Subject areas overlap (0-30 pts)
    if user.subject_areas and grant.subject_areas:
        overlap = len(set(user.subject_areas) & set(grant.subject_areas))
        max_possible = max(len(user.subject_areas), 1)
        score += (overlap / max_possible) * 30

    # Career stage match (0-20 pts)
    if user.career_stage and grant.career_stages:
        if user.career_stage in grant.career_stages:
            score += 20

    # Institution type match (0-15 pts)
    if user.institution_type and grant.institution_types:
        if user.institution_type in grant.institution_types:
            score += 15

    # Preferred agency boost (0-15 pts)
    if user.preferred_agencies and grant.agency:
        if grant.agency in user.preferred_agencies:
            score += 15

    # Age eligibility check (-100 if disqualified)
    if grant.age_limit and user.date_of_birth:
        user_age = _calculate_user_age(user.date_of_birth)
        if user_age > grant.age_limit:
            score -= 100

    # Recency bonus: grants created in the last 7 days get a small boost
    if grant.created_at:
        created = grant.created_at
        if created.tzinfo is None:
            created = created.replace(tzinfo=timezone.utc)
        days_old = (datetime.now(timezone.utc) - created).days
        if days_old <= 7:
            score += 5

    # Featured grant bonus
    if grant.is_featured:
        score += 5

    return score


async def get_recommended_grants(
    db: AsyncSession, user: User, limit: int = 20
) -> list[Grant]:
    """Get grants recommended for a user based on profile matching.

    Pre-filters candidates with SQL, then scores in Python and returns top N.
    """
    conditions = [Grant.status == "active"]

    # Pre-filter: at least one of subject overlap, career match, or agency match
    or_conditions = []
    if user.subject_areas:
        or_conditions.append(Grant.subject_areas.overlap(user.subject_areas))
    if user.career_stage:
        or_conditions.append(Grant.career_stages.any(user.career_stage))
    if user.preferred_agencies:
        or_conditions.append(Grant.agency.in_(user.preferred_agencies))
    if user.institution_type:
        or_conditions.append(Grant.institution_types.any(user.institution_type))

    if or_conditions:
        conditions.append(or_(*or_conditions))

    # Fetch candidates (generous limit for scoring)
    result = await db.execute(
        select(Grant)
        .where(and_(*conditions))
        .order_by(Grant.deadline.asc().nulls_last())
        .limit(100)
    )
    candidates = result.scalars().all()

    if not candidates:
        # Fallback: return newest active grants if no profile match
        result = await db.execute(
            select(Grant)
            .where(Grant.status == "active")
            .order_by(Grant.created_at.desc())
            .limit(limit)
        )
        return list(result.scalars().all())

    # Score and rank
    scored = [(grant, _score_grant(grant, user)) for grant in candidates]
    scored.sort(key=lambda x: x[1], reverse=True)

    # Filter out disqualified (score < 0) and return top N
    return [grant for grant, score in scored[:limit] if score > 0]
