import asyncio
import logging
from app.scrapers.base import BaseScraper

logging.basicConfig(level=logging.INFO)

class TestScraper(BaseScraper):
    agency = "TEST"
    
    async def scrape(self):
        url = "https://example.com"
        logging.info(f"Fetching {url} dynamically...")
        html = await self.fetch_dynamic_page(url)
        logging.info(f"Fetched {len(html)} bytes of HTML.")
        return []

async def main():
    scraper = TestScraper()
    await scraper.scrape()

if __name__ == "__main__":
    asyncio.run(main())
