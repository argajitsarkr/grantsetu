"""Scraper runner — orchestrates all agency scrapers."""

import logging
from datetime import datetime, timezone

from sqlalchemy.ext.asyncio import AsyncSession

from app.scrapers.birac import BIRACScraper
from app.scrapers.dbt import DBTScraper
from app.scrapers.dst import DSTScraper
from app.scrapers.icmr import ICMRScraper
from app.scrapers.anrf import ANRFScraper
from app.scrapers.csir import CSIRScraper
from app.scrapers.ugc import UGCScraper
from app.scrapers.ayush import AYUSHScraper

logger = logging.getLogger(__name__)

SCRAPER_REGISTRY: dict[str, type] = {
    "DBT": DBTScraper,
    "DST": DSTScraper,
    "ICMR": ICMRScraper,
    "ANRF": ANRFScraper,
    "BIRAC": BIRACScraper,
    "CSIR": CSIRScraper,
    "UGC": UGCScraper,
    "AYUSH": AYUSHScraper,
}


async def run_single_scraper(db: AsyncSession, agency: str) -> dict:
    """Run a single agency scraper and return results."""
    scraper_cls = SCRAPER_REGISTRY.get(agency)
    if not scraper_cls:
        return {"agency": agency, "status": "error", "message": f"Unknown agency: {agency}"}

    scraper = scraper_cls()
    run = await scraper.run(db)
    return {
        "agency": agency,
        "status": run.status,
        "grants_found": run.grants_found,
        "grants_new": run.grants_new,
        "error_message": run.error_message,
    }


async def run_all_scrapers(db: AsyncSession) -> list[dict]:
    """Run all registered scrapers sequentially.

    Each scraper is independent — if one fails, others still run.
    """
    results = []
    for agency in SCRAPER_REGISTRY:
        logger.info(f"Running scraper for {agency}...")
        try:
            result = await run_single_scraper(db, agency)
            results.append(result)
            logger.info(f"[{agency}] Done: {result['status']}, found={result['grants_found']}, new={result['grants_new']}")
        except Exception as e:
            logger.error(f"[{agency}] Unexpected error: {e}")
            results.append({"agency": agency, "status": "error", "message": str(e)})

    return results
