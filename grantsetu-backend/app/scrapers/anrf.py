"""ANRF/SERB scraper."""

import logging
from urllib.parse import urljoin

from bs4 import BeautifulSoup

from app.scrapers.base import BaseScraper
from app.schemas.grant import GrantCreate
from app.utils.date_utils import parse_indian_date

logger = logging.getLogger(__name__)


class ANRFScraper(BaseScraper):
    """Scraper for ANRF (formerly SERB) research grants pages."""

    agency = "ANRF"
    portal_url = "https://anrf.gov.in/page/english/research_grants"

    # Also check SERB legacy page
    serb_url = "https://serb.gov.in/page/english/research_grants"

    async def scrape(self) -> list[GrantCreate]:
        """Scrape ANRF and SERB portals for active grant calls."""
        grants = []

        # Try ANRF first
        for url in [self.portal_url, self.serb_url]:
            try:
                html = await self.fetch_dynamic_page(url)
                found = self._parse_grants_page(html, url)
                grants.extend(found)
            except Exception as e:
                logger.warning(f"[ANRF] Failed to fetch {url}: {e}")
                continue

        # Deduplicate by title
        seen_titles = set()
        unique_grants = []
        for g in grants:
            if g.title not in seen_titles:
                seen_titles.add(g.title)
                unique_grants.append(g)

        logger.info(f"[ANRF] Found {len(unique_grants)} grant calls")
        return unique_grants

    def _parse_grants_page(self, html: str, base_url: str) -> list[GrantCreate]:
        """Parse an ANRF/SERB grants page."""
        grants = []
        soup = BeautifulSoup(html, "lxml")

        # Look for scheme/programme listings
        content = soup.find("div", class_="content") or soup.find("main") or soup

        for link in content.find_all("a", href=True):
            href = link.get("href", "")
            text = link.get_text(strip=True)

            if not text or len(text) < 5:
                continue

            # Skip navigation links
            skip = ["home", "about", "contact", "login", "sitemap", "back"]
            if any(kw in text.lower() for kw in skip):
                continue

            full_url = urljoin(base_url, href)
            pdf_url = full_url if href.endswith(".pdf") else None

            # Identify scheme names
            scheme_name = None
            known_schemes = ["PM-ECRG", "CRG", "MATRICS", "SURE", "ARG", "SUPRA", "TARE", "POWER"]
            for scheme in known_schemes:
                if scheme.lower() in text.lower():
                    scheme_name = scheme
                    break

            grant = GrantCreate(
                agency="ANRF",
                scheme_name=scheme_name,
                title=text,
                url=full_url,
                pdf_url=pdf_url,
                portal_name="anrfonline.in",
                source_type="scraper",
                status="active",
            )
            grants.append(grant)

        return grants
