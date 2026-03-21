"""Update existing grants with notification_url, call_url, apply_url fields."""

import asyncio
import sys

sys.path.insert(0, ".")

from sqlalchemy import select, update
from app.database import async_session
from app.models.grant import Grant

# Map: url -> {notification_url, call_url, apply_url}
URL_UPDATES = {
    "https://dbtindia.gov.in/schemes-programmes/research-development/bio-grid": {
        "notification_url": "https://dbtindia.gov.in/schemes-programmes/research-development/bio-grid",
        "call_url": "https://dbtindia.gov.in/schemes-programmes/research-development/bio-grid",
        "apply_url": "https://epromis.dbt.gov.in",
    },
    "https://dbtindia.gov.in/schemes-programmes/building-capacities/biocare": {
        "notification_url": "https://dbtindia.gov.in/schemes-programmes/building-capacities/biocare",
        "call_url": "https://dbtindia.gov.in/schemes-programmes/building-capacities/biocare",
        "apply_url": "https://epromis.dbt.gov.in",
    },
    "https://dst.gov.in/scientific-programmes/scientific-engineering-research/women-scientists-programs": {
        "notification_url": "https://dst.gov.in/scientific-programmes/scientific-engineering-research/women-scientists-programs",
        "call_url": "https://dst.gov.in/scientific-programmes/scientific-engineering-research/women-scientists-programs",
        "apply_url": "https://onlinedst.gov.in",
    },
    "https://dst.gov.in/scientific-programmes/scientific-engineering-research/fund-improvement-st-infrastructure-universities-higher-educational": {
        "notification_url": "https://dst.gov.in/scientific-programmes/scientific-engineering-research/fund-improvement-st-infrastructure-universities-higher-educational",
        "call_url": "https://dst.gov.in/scientific-programmes/scientific-engineering-research/fund-improvement-st-infrastructure-universities-higher-educational",
        "apply_url": "https://onlinedst.gov.in",
    },
    "https://dst.gov.in/scientific-programmes/scientific-engineering-research/promotion-university-research-scientific-excellence": {
        "notification_url": "https://dst.gov.in/scientific-programmes/scientific-engineering-research/promotion-university-research-scientific-excellence",
        "call_url": "https://dst.gov.in/scientific-programmes/scientific-engineering-research/promotion-university-research-scientific-excellence",
        "apply_url": "https://onlinedst.gov.in",
    },
    "https://www.icmr.gov.in/grants-funding-overview": {
        "notification_url": "https://www.icmr.gov.in/grants-funding-overview",
        "call_url": "https://www.icmr.gov.in/grants-funding-overview",
        "apply_url": "https://epms.icmr.org.in",
    },
    "https://www.icmr.gov.in/schemes/anveshan": {
        "notification_url": "https://www.icmr.gov.in/schemes/anveshan",
        "call_url": "https://www.icmr.gov.in/schemes/anveshan",
        "apply_url": "https://epms.icmr.org.in",
    },
    "https://anrf.gov.in/page/english/research_grants": {
        "notification_url": "https://anrf.gov.in/page/english/research_grants#PM-ECRG",
        "call_url": "https://anrf.gov.in/page/english/research_grants#ANRF%20Prime%20Minister%27s%20Early%20Career%20Research%20Grant",
        "apply_url": "https://anrfonline.in",
    },
    "https://anrf.gov.in/page/english/core_research_grant": {
        "notification_url": "https://anrf.gov.in/page/english/core_research_grant",
        "call_url": "https://anrf.gov.in/page/english/research_grants#ANRF%20Core%20Research%20Grant",
        "apply_url": "https://anrfonline.in",
    },
    "https://serb.gov.in/page/english/matrics": {
        "notification_url": "https://serb.gov.in/page/english/matrics",
        "call_url": "https://anrf.gov.in/page/english/research_grants#MATRICS",
        "apply_url": "https://anrfonline.in",
    },
    "https://serb.gov.in/page/english/serb-sure": {
        "notification_url": "https://serb.gov.in/page/english/serb-sure",
        "call_url": "https://anrf.gov.in/page/english/research_grants#SERB-SURE",
        "apply_url": "https://anrfonline.in",
    },
    "https://birac.nic.in/big.php": {
        "notification_url": "https://birac.nic.in/big.php",
        "call_url": "https://birac.nic.in/big.php",
        "apply_url": "https://birac.nic.in/login.php",
    },
    "https://birac.nic.in/bipp.php": {
        "notification_url": "https://birac.nic.in/bipp.php",
        "call_url": "https://birac.nic.in/bipp.php",
        "apply_url": "https://birac.nic.in/login.php",
    },
    "https://csirhrdg.res.in/Home/Index/1/Default/2046/57": {
        "notification_url": "https://csirhrdg.res.in/Home/Index/1/Default/2046/57",
        "call_url": "https://csirhrdg.res.in/Home/Index/1/Default/2046/57",
        "apply_url": "https://csirhrdg.res.in",
    },
    "https://www.ugc.gov.in/majorresearchproject": {
        "notification_url": "https://www.ugc.gov.in/majorresearchproject",
        "call_url": "https://www.ugc.gov.in/majorresearchproject",
        "apply_url": "https://ugc.gov.in/login",
    },
    "https://www.ugc.gov.in/startupgrant": {
        "notification_url": "https://www.ugc.gov.in/startupgrant",
        "call_url": "https://www.ugc.gov.in/startupgrant",
        "apply_url": "https://ugc.gov.in/login",
    },
    "https://main.ayush.gov.in/research": {
        "notification_url": "https://main.ayush.gov.in/research",
        "call_url": "https://main.ayush.gov.in/research",
        "apply_url": "https://main.ayush.gov.in",
    },
    "https://anrf.gov.in/page/english/arg_ne": {
        "notification_url": "https://anrf.gov.in/page/english/arg_ne",
        "call_url": "https://anrf.gov.in/page/english/research_grants#ARG-NE",
        "apply_url": "https://anrfonline.in",
    },
    "https://birac.nic.in/pace.php": {
        "notification_url": "https://birac.nic.in/pace.php",
        "call_url": "https://birac.nic.in/pace.php",
        "apply_url": "https://birac.nic.in/login.php",
    },
}


async def update_urls():
    async with async_session() as session:
        updated = 0
        for url, fields in URL_UPDATES.items():
            result = await session.execute(
                update(Grant)
                .where(Grant.url == url)
                .values(**fields)
            )
            if result.rowcount:
                updated += result.rowcount
                print(f"  Updated: {url}")
            else:
                print(f"  Not found: {url}")

        await session.commit()
        print(f"\nUpdated {updated} grants with new URL fields.")


if __name__ == "__main__":
    asyncio.run(update_urls())
