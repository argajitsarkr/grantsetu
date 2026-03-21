"""Email alert service — sends grant digests via Resend."""

import logging
from datetime import datetime, timedelta, timezone

import resend
from sqlalchemy import and_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.models.alert_log import AlertLog
from app.models.grant import Grant
from app.models.user import User

logger = logging.getLogger(__name__)


async def send_digest(db: AsyncSession, frequency: str) -> dict:
    """Send grant digest emails to subscribed users.

    Args:
        db: Database session
        frequency: "daily" or "weekly"

    Returns:
        Summary dict with sent/failed counts.
    """
    if not settings.RESEND_API_KEY:
        logger.warning("RESEND_API_KEY not set, skipping digest")
        return {"sent": 0, "failed": 0, "skipped": "no_api_key"}

    resend.api_key = settings.RESEND_API_KEY

    # Find users with matching alert frequency
    result = await db.execute(
        select(User).where(
            and_(User.alert_enabled.is_(True), User.alert_frequency == frequency)
        )
    )
    users = result.scalars().all()

    if not users:
        return {"sent": 0, "failed": 0, "users": 0}

    # Determine time window
    if frequency == "daily":
        since = datetime.now(timezone.utc) - timedelta(days=1)
    else:
        since = datetime.now(timezone.utc) - timedelta(days=7)

    sent = 0
    failed = 0

    for user in users:
        try:
            # Find matching grants
            conditions = [
                Grant.status == "active",
                Grant.created_at >= since,
            ]

            if user.subject_areas:
                conditions.append(Grant.subject_areas.overlap(user.subject_areas))
            if user.career_stage:
                conditions.append(Grant.career_stages.any(user.career_stage))
            if user.alert_agencies:
                conditions.append(Grant.agency.in_(user.alert_agencies))

            grants_result = await db.execute(
                select(Grant).where(and_(*conditions)).order_by(Grant.deadline.asc().nulls_last()).limit(10)
            )
            grants = grants_result.scalars().all()

            if not grants:
                continue

            # Check alert_log to skip already-sent grants
            already_sent = await db.execute(
                select(AlertLog.grant_id).where(
                    and_(
                        AlertLog.user_id == user.id,
                        AlertLog.grant_id.in_([g.id for g in grants]),
                    )
                )
            )
            sent_ids = set(row[0] for row in already_sent.all())
            new_grants = [g for g in grants if g.id not in sent_ids]

            if not new_grants:
                continue

            # Build email HTML
            html = _build_digest_html(new_grants, frequency)

            # Send via Resend
            resend.Emails.send({
                "from": "GrantSetu <alerts@grantsetu.in>",
                "to": [user.email],
                "subject": f"GrantSetu: {len(new_grants)} new grant{'s' if len(new_grants) > 1 else ''} for you",
                "html": html,
            })

            # Log sent alerts
            for grant in new_grants:
                db.add(AlertLog(user_id=user.id, grant_id=grant.id))

            sent += 1

        except Exception as e:
            logger.error(f"Failed to send digest to {user.email}: {e}")
            failed += 1

    await db.flush()
    return {"sent": sent, "failed": failed, "users": len(users)}


def _build_digest_html(grants: list[Grant], frequency: str) -> str:
    """Build a simple HTML email for grant digest."""
    grant_rows = ""
    for g in grants:
        deadline = g.deadline_text or "Open / Rolling"
        grant_rows += f"""
        <tr>
            <td style="padding: 12px; border-bottom: 1px solid #eee;">
                <div style="font-size: 12px; color: #666; margin-bottom: 4px;">{g.agency}{f' — {g.scheme_name}' if g.scheme_name else ''}</div>
                <a href="{settings.FRONTEND_URL}/grants/{g.slug}" style="color: #1E40AF; font-weight: 600; text-decoration: none; font-size: 14px;">{g.title}</a>
                {f'<div style="font-size: 13px; color: #555; margin-top: 4px;">{g.summary}</div>' if g.summary else ''}
                <div style="font-size: 12px; color: #888; margin-top: 4px;">Deadline: {deadline}</div>
            </td>
        </tr>
        """

    return f"""
    <div style="max-width: 600px; margin: 0 auto; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
        <div style="background: #1E40AF; color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0; font-size: 20px;">GrantSetu</h1>
            <p style="margin: 8px 0 0; font-size: 14px; opacity: 0.9;">Your {frequency} grant digest</p>
        </div>
        <div style="padding: 20px;">
            <p style="color: #333; font-size: 14px;">We found {len(grants)} new grant{'s' if len(grants) > 1 else ''} matching your preferences:</p>
            <table style="width: 100%; border-collapse: collapse;">
                {grant_rows}
            </table>
            <div style="text-align: center; margin-top: 24px;">
                <a href="{settings.FRONTEND_URL}/grants" style="display: inline-block; background: #1E40AF; color: white; padding: 10px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px;">Browse All Grants</a>
            </div>
        </div>
        <div style="padding: 16px 20px; background: #f9f9f9; text-align: center; font-size: 12px; color: #999;">
            <a href="{settings.FRONTEND_URL}/alerts" style="color: #666;">Manage preferences</a> &middot; <a href="{settings.FRONTEND_URL}/alerts" style="color: #666;">Unsubscribe</a>
        </div>
    </div>
    """
