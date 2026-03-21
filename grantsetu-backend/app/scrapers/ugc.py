"""UGC (University Grants Commission) scraper."""

import logging
from urllib.parse import urljoin

from bs4 import BeautifulSoup

from app.scrapers.base import BaseScraper
from app.schemas.grant import GrantCreate
from app.utils.date_utils import parse_indian_date

logger = logging.getLogger(__name__)

KNOWN_SCHEMES = {
    "MRP": "Major Research Project",
    "Minor Research": "Minor Research Project",
    "Start-Up": "Start-Up Grant for Newly Recruited Faculty",
    "BSR": "Basic Scientific Research",
    "RGNF": "Rajiv Gandhi National Fellowship",
    "MANF": "Maulana Azad National Fellowship",
    "NET-JRF": "NET Junior Research Fellowship",
    "Post Doctoral": "Post Doctoral Fellowship",
    "Mid-Career": "Mid-Career Award",
    "STRIDE": "STRIDE (Scheme for Trans-disciplinary Research)",
    "PARAMARSH": "PARAMARSH Mentorship Scheme",
}


class UGCScraper(BaseScraper):
    """Scraper for UGC grants and fellowships.

    UGC lists grants/fellowships on ugc.gov.in.
    """

    agency = "UGC"
    portal_url = "https://www.ugc.gov.in/subpage/Scholarships-and-Fellowships.aspx"

    FALLBACK_URLS = [
        "https://www.ugc.gov.in/pdfnews/WhatsNew.aspx",
        "https://www.ugc.gov.in/subpage/UGC-Schemes.aspx",
    ]

    async def scrape(self) -> list[GrantCreate]:
        """Scrape UGC portal for active grant/fellowship calls."""
        grants: list[GrantCreate] = []

        for url in [self.portal_url] + self.FALLBACK_URLS:
            try:
                html = await self.fetch_page(url)
                found = self._parse_page(html, url)
                grants.extend(found)
            except Exception as e:
                logger.warning(f"[UGC] Failed to fetch {url}: {e}")
                continue

        # Deduplicate by URL
        seen_urls: set[str] = set()
        unique_grants: list[GrantCreate] = []
        for g in grants:
            if g.url not in seen_urls:
                seen_urls.add(g.url)
                unique_grants.append(g)

        logger.info(f"[UGC] Found {len(unique_grants)} grant/fellowship calls")
        return unique_grants

    def _parse_page(self, html: str, base_url: str) -> list[GrantCreate]:
        """Parse UGC page for grant/fellowship links."""
        grants: list[GrantCreate] = []
        soup = BeautifulSoup(html, "lxml")

        keywords = ["grant", "call", "fellowship", "scheme", "proposal",
                     "research project", "funding", "scholarship", "stride",
                     "paramarsh", "apply", "notification"]

        # Check tables
        for table in soup.find_all("table"):
            rows = table.find_all("tr")
            for row in rows[1:]:
                cells = row.find_all(["td", "th"])
                if len(cells) < 2:
                    continue

                title_cell = cells[1] if len(cells) > 1 else cells[0]
                title = title_cell.get_text(strip=True)

                if not title or len(title) < 5:
                    continue

                link = title_cell.find("a", href=True)
                url = urljoin(base_url, link["href"]) if link else base_url

                deadline = None
                deadline_text = None
                for cell in cells[2:]:
                    text = cell.get_text(strip=True)
                    parsed = parse_indian_date(text)
                    if parsed:
                        deadline = parsed
                        deadline_text = text
                        break

                pdf_url = None
                for cell in cells:
                    pdf_link = cell.find("a", href=lambda h: h and ".pdf" in h.lower())
                    if pdf_link:
                        pdf_url = urljoin(base_url, pdf_link["href"])
                        break

                grants.append(GrantCreate(
                    agency="UGC",
                    title=title,
                    url=url,
                    pdf_url=pdf_url,
                    deadline=deadline,
                    deadline_text=deadline_text,
                    subject_areas=["All Disciplines"],
                    career_stages=["Faculty", "Researcher"],
                    portal_name="ugc.gov.in",
                    source_type="scraper",
                    status="active",
                ))

        # Check content area links
        content = soup.find("div", {"id": "ContentPlaceHolder1_pnlinner"}) or \
                  soup.find("div", class_="content_area") or \
                  soup.find("main") or soup

        for link in content.find_all("a", href=True):
            text = link.get_text(strip=True).lower()
            href = link["href"]

            if not any(kw in text for kw in keywords):
                continue
            if len(link.get_text(strip=True)) < 5:
                continue
            if href.startswith("#") or href.startswith("javascript:"):
                continue

            full_url = urljoin(base_url, href)
            if any(g.url == full_url for g in grants):
                continue

            title = link.get_text(strip=True)

            scheme_name = None
            for abbr, full in KNOWN_SCHEMES.items():
                if abbr.lower() in text:
                    scheme_name = full
                    break

            grants.append(GrantCreate(
                agency="UGC",
                title=title,
                scheme_name=scheme_name,
                url=full_url,
                pdf_url=full_url if full_url.endswith(".pdf") else None,
                subject_areas=["All Disciplines"],
                career_stages=["Faculty", "Researcher"],
                portal_name="ugc.gov.in",
                source_type="scraper",
                status="active",
            ))

        return grants
