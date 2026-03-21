"""Celery tasks for scraping agency portals."""

import asyncio
import logging

from app.database import async_session
from app.scrapers.runner import run_all_scrapers as _run_all, run_single_scraper
from app.tasks.celery_app import celery_app

logger = logging.getLogger(__name__)


def _run_async(coro):
    """Run an async coroutine from a sync Celery task."""
    loop = asyncio.new_event_loop()
    try:
        return loop.run_until_complete(coro)
    finally:
        loop.close()


@celery_app.task(bind=True, max_retries=3, default_retry_delay=300)
def run_scraper(self, agency: str) -> dict:
    """Run a single agency scraper."""
    async def _run():
        async with async_session() as db:
            result = await run_single_scraper(db, agency)
            await db.commit()
            return result

    try:
        return _run_async(_run())
    except Exception as exc:
        logger.error(f"Scraper task failed for {agency}: {exc}")
        raise self.retry(exc=exc)


@celery_app.task
def run_all_scrapers() -> list[dict]:
    """Run all agency scrapers sequentially."""
    async def _run():
        async with async_session() as db:
            results = await _run_all(db)
            await db.commit()
            return results

    return _run_async(_run())
