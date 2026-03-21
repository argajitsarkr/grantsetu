"""Base scraper abstract class for all agency scrapers."""

import logging
from abc import ABC, abstractmethod
from datetime import datetime, timezone

import httpx
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.scraper_run import ScraperRun
from app.schemas.grant import GrantCreate
from app.services.grant_service import upsert_grant_by_url

logger = logging.getLogger(__name__)

USER_AGENT = "GrantSetu/1.0 (grant discovery platform; contact@grantsetu.in)"
REQUEST_TIMEOUT = 30.0
MAX_RETRIES = 3
BACKOFF_SECONDS = [2, 4, 8]


class BaseScraper(ABC):
    """Base class for all agency scrapers."""

    agency: str = ""
    portal_url: str = ""

    async def fetch_page(self, url: str) -> str:
        """Fetch a page with retries and exponential backoff.

        Returns the response text, or raises on failure after all retries.
        """
        last_error = None
        for attempt in range(MAX_RETRIES):
            try:
                async with httpx.AsyncClient(
                    timeout=REQUEST_TIMEOUT,
                    headers={"User-Agent": USER_AGENT},
                    follow_redirects=True,
                ) as client:
                    response = await client.get(url)
                    response.raise_for_status()
                    return response.text
            except Exception as e:
                last_error = e
                if attempt < MAX_RETRIES - 1:
                    import asyncio
                    wait = BACKOFF_SECONDS[attempt]
                    logger.warning(
                        f"[{self.agency}] Retry {attempt + 1}/{MAX_RETRIES} for {url} "
                        f"after {wait}s: {e}"
                    )
                    await asyncio.sleep(wait)

        raise last_error  # type: ignore[misc]

    async def fetch_pdf_bytes(self, url: str) -> bytes:
        """Download PDF as bytes with retries."""
        last_error = None
        for attempt in range(MAX_RETRIES):
            try:
                async with httpx.AsyncClient(
                    timeout=60.0,
                    headers={"User-Agent": USER_AGENT},
                    follow_redirects=True,
                ) as client:
                    response = await client.get(url)
                    response.raise_for_status()
                    return response.content
            except Exception as e:
                last_error = e
                if attempt < MAX_RETRIES - 1:
                    import asyncio
                    await asyncio.sleep(BACKOFF_SECONDS[attempt])

        raise last_error  # type: ignore[misc]

    @abstractmethod
    async def scrape(self) -> list[GrantCreate]:
        """Scrape the agency portal and return structured grant data.

        Pipeline:
        1. Fetch portal page
        2. Find new call links
        3. Download call PDFs if available
        4. Extract text from PDFs
        5. Return list of GrantCreate objects
        """
        ...

    async def run(self, db: AsyncSession) -> ScraperRun:
        """Execute the scraper and log results to scraper_runs table."""
        run = ScraperRun(agency=self.agency, status="running")
        db.add(run)
        await db.flush()

        try:
            grants_data = await self.scrape()
            new_count = 0
            for grant_data in grants_data:
                try:
                    _, is_new = await upsert_grant_by_url(db, grant_data)
                    if is_new:
                        new_count += 1
                except Exception as e:
                    logger.error(f"[{self.agency}] Failed to upsert grant: {e}")

            run.status = "success"
            run.grants_found = len(grants_data)
            run.grants_new = new_count
            run.finished_at = datetime.now(timezone.utc)

        except Exception as e:
            logger.error(f"[{self.agency}] Scraper failed: {e}")
            run.status = "failed"
            run.error_message = str(e)[:1000]
            run.finished_at = datetime.now(timezone.utc)

        await db.flush()
        return run
