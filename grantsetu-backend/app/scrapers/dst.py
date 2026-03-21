"""DST (Department of Science & Technology) scraper."""

import logging
from urllib.parse import urljoin

from bs4 import BeautifulSoup

from app.scrapers.base import BaseScraper
from app.schemas.grant import GrantCreate
from app.utils.date_utils import parse_indian_date

logger = logging.getLogger(__name__)


class DSTScraper(BaseScraper):
    """Scraper for DST call-for-proposals page.

    DST has a server-rendered HTML table (DataTables) with all rows in the DOM.
    """

    agency = "DST"
    portal_url = "https://dst.gov.in/call-for-proposals"

    async def scrape(self) -> list[GrantCreate]:
        """Scrape DST portal for active grant calls."""
        grants = []

        html = await self.fetch_page(self.portal_url)
        soup = BeautifulSoup(html, "lxml")

        # DST typically has a table with columns: S.No, Title, Opening Date, Deadline
        table = soup.find("table")
        if not table:
            # Try alternate selectors
            table = soup.find("div", class_="view-content")
            if not table:
                logger.warning("[DST] No table found on page")
                return grants

        rows = table.find_all("tr")

        for row in rows[1:]:  # Skip header row
            cells = row.find_all(["td", "th"])
            if len(cells) < 2:
                continue

            # Extract title and link
            title_cell = cells[1] if len(cells) > 1 else cells[0]
            link = title_cell.find("a", href=True)
            title = title_cell.get_text(strip=True)

            if not title or len(title) < 5:
                continue

            url = ""
            if link:
                url = urljoin(self.portal_url, link["href"])
            else:
                url = self.portal_url

            # Extract deadline if available
            deadline = None
            deadline_text = None
            if len(cells) >= 4:
                deadline_text = cells[3].get_text(strip=True)
                deadline = parse_indian_date(deadline_text)
            elif len(cells) >= 3:
                deadline_text = cells[2].get_text(strip=True)
                deadline = parse_indian_date(deadline_text)

            pdf_url = None
            for cell in cells:
                pdf_link = cell.find("a", href=lambda h: h and h.endswith(".pdf"))
                if pdf_link:
                    pdf_url = urljoin(self.portal_url, pdf_link["href"])
                    break

            grant = GrantCreate(
                agency="DST",
                title=title,
                url=url,
                pdf_url=pdf_url,
                deadline=deadline,
                deadline_text=deadline_text,
                portal_name="onlinedst.gov.in",
                source_type="scraper",
                status="active",
            )
            grants.append(grant)

        logger.info(f"[DST] Found {len(grants)} grant calls")
        return grants
