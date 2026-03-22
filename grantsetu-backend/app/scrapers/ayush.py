"""AYUSH (Ministry of Ayush) scraper."""

import logging
from urllib.parse import urljoin

from bs4 import BeautifulSoup

from app.scrapers.base import BaseScraper
from app.schemas.grant import GrantCreate
from app.utils.date_utils import parse_indian_date

logger = logging.getLogger(__name__)

KNOWN_SCHEMES = {
    "EMR": "Extramural Research",
    "Intramural": "Intramural Research",
    "CCRAS": "CCRAS Research",
    "CCRYN": "CCRYN Research",
    "CCRUM": "CCRUM Research",
    "CCRH": "CCRH Research",
    "CCRS": "CCRS Research",
}


class AYUSHScraper(BaseScraper):
    """Scraper for Ministry of AYUSH research grants.

    AYUSH funds research in Ayurveda, Yoga, Naturopathy, Unani,
    Siddha, and Homeopathy.
    """

    agency = "AYUSH"
    portal_url = "https://main.ayush.gov.in/research"

    FALLBACK_URLS = [
        "https://main.ayush.gov.in/tenders-and-notices",
        "https://ccras.nic.in/content/ongoing-research-projects",
    ]

    async def scrape(self) -> list[GrantCreate]:
        """Scrape AYUSH portals for active grant calls."""
        grants: list[GrantCreate] = []

        for url in [self.portal_url] + self.FALLBACK_URLS:
            try:
                html = await self.fetch_dynamic_page(url)
                found = self._parse_page(html, url)
                grants.extend(found)
            except Exception as e:
                logger.warning(f"[AYUSH] Failed to fetch {url}: {e}")
                continue

        # Deduplicate by URL
        seen_urls: set[str] = set()
        unique_grants: list[GrantCreate] = []
        for g in grants:
            if g.url not in seen_urls:
                seen_urls.add(g.url)
                unique_grants.append(g)

        logger.info(f"[AYUSH] Found {len(unique_grants)} grant calls")
        return unique_grants

    def _parse_page(self, html: str, base_url: str) -> list[GrantCreate]:
        """Parse AYUSH page for grant-related links."""
        grants: list[GrantCreate] = []
        soup = BeautifulSoup(html, "lxml")

        keywords = ["grant", "call", "proposal", "scheme", "research",
                     "funding", "fellowship", "extramural", "emr",
                     "tender", "notification", "apply"]

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
                    agency="AYUSH",
                    title=title,
                    url=url,
                    pdf_url=pdf_url,
                    deadline=deadline,
                    deadline_text=deadline_text,
                    subject_areas=["AYUSH", "Traditional Medicine"],
                    portal_name="ayush.gov.in",
                    source_type="scraper",
                    status="active",
                ))

        # Check content links
        content = soup.find("div", class_="field-items") or \
                  soup.find("main") or soup.find("article") or soup

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
                agency="AYUSH",
                title=title,
                scheme_name=scheme_name,
                url=full_url,
                pdf_url=full_url if full_url.endswith(".pdf") else None,
                subject_areas=["AYUSH", "Traditional Medicine"],
                portal_name="ayush.gov.in",
                source_type="scraper",
                status="active",
            ))

        return grants
