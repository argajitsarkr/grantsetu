"""ICMR (Indian Council of Medical Research) scraper."""

import logging
from urllib.parse import urljoin

from bs4 import BeautifulSoup

from app.scrapers.base import BaseScraper
from app.schemas.grant import GrantCreate
from app.utils.date_utils import parse_indian_date

logger = logging.getLogger(__name__)


class ICMRScraper(BaseScraper):
    """Scraper for ICMR grants and funding pages."""

    agency = "ICMR"
    portal_url = "https://www.icmr.gov.in/grants-funding-overview"

    async def scrape(self) -> list[GrantCreate]:
        """Scrape ICMR portal for active grant calls."""
        grants = []

        try:
            html = await self.fetch_page(self.portal_url)
        except Exception as e:
            logger.error(f"[ICMR] Failed to fetch main page: {e}")
            # Fallback to alternate URL
            try:
                html = await self.fetch_page("https://main.icmr.nic.in/content/extramural-research-programme")
            except Exception:
                raise

        soup = BeautifulSoup(html, "lxml")

        # ICMR page may have various structures — look for links in content area
        content = (
            soup.find("div", class_="field-items")
            or soup.find("div", class_="content")
            or soup.find("main")
            or soup
        )

        for link in content.find_all("a", href=True):
            href = link.get("href", "")
            text = link.get_text(strip=True)

            if not text or len(text) < 10:
                continue

            # Look for grant/funding related links
            keywords = ["grant", "fund", "proposal", "call", "extramural", "adhoc", "scheme"]
            if not any(kw in text.lower() for kw in keywords):
                continue

            full_url = urljoin(self.portal_url, href)
            pdf_url = full_url if href.endswith(".pdf") else None

            grant = GrantCreate(
                agency="ICMR",
                title=text,
                url=full_url,
                pdf_url=pdf_url,
                portal_name="epms.icmr.org.in",
                source_type="scraper",
                subject_areas=["Medical/Health", "Life Sciences"],
                status="active",
            )
            grants.append(grant)

        logger.info(f"[ICMR] Found {len(grants)} potential grant calls")
        return grants
