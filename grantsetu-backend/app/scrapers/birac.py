"""BIRAC (Biotechnology Industry Research Assistance Council) scraper."""

import logging
from urllib.parse import urljoin

from bs4 import BeautifulSoup

from app.scrapers.base import BaseScraper
from app.schemas.grant import GrantCreate
from app.utils.date_utils import parse_indian_date

logger = logging.getLogger(__name__)


class BIRACScraper(BaseScraper):
    """Scraper for BIRAC call-for-proposals page."""

    agency = "BIRAC"
    portal_url = "https://birac.nic.in/cfp.php"

    async def scrape(self) -> list[GrantCreate]:
        """Scrape BIRAC portal for active grant calls."""
        grants = []

        html = await self.fetch_page(self.portal_url)
        soup = BeautifulSoup(html, "lxml")

        # BIRAC typically has a table of CFPs
        table = soup.find("table")
        if table:
            grants.extend(self._parse_table(table))

        # Also look for content area listings
        content = soup.find("div", class_="content") or soup.find("main") or soup

        for link in content.find_all("a", href=True):
            href = link.get("href", "")
            text = link.get_text(strip=True)

            if not text or len(text) < 10:
                continue

            # Look for funding-related links
            keywords = ["call", "proposal", "big", "bipp", "pace", "sparsh", "fund", "grant"]
            if not any(kw in text.lower() for kw in keywords):
                continue

            full_url = urljoin(self.portal_url, href)

            # Check if this URL is already captured from the table
            if any(g.url == full_url for g in grants):
                continue

            pdf_url = full_url if href.endswith(".pdf") else None

            # Identify scheme
            scheme_name = None
            for scheme in ["BIG", "BIPP", "PACE", "SPARSH", "CRS", "SEED"]:
                if scheme.lower() in text.lower():
                    scheme_name = scheme
                    break

            grant = GrantCreate(
                agency="BIRAC",
                scheme_name=scheme_name,
                title=text,
                url=full_url,
                pdf_url=pdf_url,
                portal_name="birac.nic.in",
                source_type="scraper",
                subject_areas=["Life Sciences", "Biotechnology"],
                status="active",
            )
            grants.append(grant)

        logger.info(f"[BIRAC] Found {len(grants)} grant calls")
        return grants

    def _parse_table(self, table) -> list[GrantCreate]:
        """Parse a BIRAC CFP table."""
        grants = []
        rows = table.find_all("tr")

        for row in rows[1:]:  # Skip header
            cells = row.find_all(["td", "th"])
            if len(cells) < 2:
                continue

            title_cell = cells[1] if len(cells) > 1 else cells[0]
            title = title_cell.get_text(strip=True)
            if not title or len(title) < 5:
                continue

            link = title_cell.find("a", href=True)
            url = urljoin(self.portal_url, link["href"]) if link else self.portal_url

            deadline = None
            deadline_text = None
            if len(cells) >= 3:
                deadline_text = cells[-1].get_text(strip=True)
                deadline = parse_indian_date(deadline_text)

            pdf_url = None
            for cell in cells:
                pdf_link = cell.find("a", href=lambda h: h and h.endswith(".pdf"))
                if pdf_link:
                    pdf_url = urljoin(self.portal_url, pdf_link["href"])
                    break

            grant = GrantCreate(
                agency="BIRAC",
                title=title,
                url=url,
                pdf_url=pdf_url,
                deadline=deadline,
                deadline_text=deadline_text,
                portal_name="birac.nic.in",
                source_type="scraper",
                subject_areas=["Life Sciences", "Biotechnology"],
                status="active",
            )
            grants.append(grant)

        return grants
