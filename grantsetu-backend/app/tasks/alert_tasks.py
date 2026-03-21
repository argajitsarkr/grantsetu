"""Celery tasks for sending email alert digests."""

import asyncio
import logging

from app.database import async_session
from app.services.alert_service import send_digest
from app.tasks.celery_app import celery_app

logger = logging.getLogger(__name__)


def _run_async(coro):
    loop = asyncio.new_event_loop()
    try:
        return loop.run_until_complete(coro)
    finally:
        loop.close()


@celery_app.task
def send_daily_digest() -> dict:
    """Send daily grant digest to subscribed users."""
    async def _run():
        async with async_session() as db:
            result = await send_digest(db, "daily")
            await db.commit()
            return result

    return _run_async(_run())


@celery_app.task
def send_weekly_digest() -> dict:
    """Send weekly grant digest to subscribed users."""
    async def _run():
        async with async_session() as db:
            result = await send_digest(db, "weekly")
            await db.commit()
            return result

    return _run_async(_run())
