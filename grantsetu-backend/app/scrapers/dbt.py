"""DBT (Department of Biotechnology) scraper."""

import logging
from urllib.parse import urljoin

from bs4 import BeautifulSoup

from app.scrapers.base import BaseScraper
from app.schemas.grant import GrantCreate
from app.utils.date_utils import parse_indian_date

logger = logging.getLogger(__name__)


class DBTScraper(BaseScraper):
    """Scraper for DBT call-for-proposals page."""

    agency = "DBT"
    portal_url = "https://dbtindia.gov.in/whats-new/call-for-proposals"

    async def scrape(self) -> list[GrantCreate]:
        """Scrape DBT portal for active grant calls."""
        grants = []

        try:
            html = await self.fetch_dynamic_page(self.portal_url)
        except Exception as e:
            logger.error(f"[DBT] Failed to fetch main page: {e}")
            # Try alternate URL (DBT recently migrated)
            try:
                html = await self.fetch_dynamic_page("https://dbt.gov.in/whats-new/call-for-proposals")
            except Exception:
                raise

        soup = BeautifulSoup(html, "lxml")

        # DBT typically lists calls in a content area with links
        # Look for common patterns: article listings, table rows, or divs with links
        content = soup.find("div", class_="view-content") or soup.find("main") or soup.find("article")
        if not content:
            content = soup

        # Find all links that might be grant calls
        for link in content.find_all("a", href=True):
            href = link.get("href", "")
            text = link.get_text(strip=True)

            if not text or len(text) < 10:
                continue

            # Skip navigation and non-grant links
            skip_keywords = ["home", "about", "contact", "login", "sitemap", "menu"]
            if any(kw in text.lower() for kw in skip_keywords):
                continue

            # Look for grant-related keywords
            grant_keywords = ["call", "proposal", "grant", "scheme", "programme", "funding", "application"]
            if not any(kw in text.lower() for kw in grant_keywords):
                continue

            full_url = urljoin(self.portal_url, href)
            pdf_url = full_url if href.endswith(".pdf") else None

            grant = GrantCreate(
                agency="DBT",
                title=text,
                url=full_url,
                pdf_url=pdf_url,
                portal_name="eProMIS",
                source_type="scraper",
                status="active",
            )
            grants.append(grant)

        logger.info(f"[DBT] Found {len(grants)} potential grant calls")
        return grants
