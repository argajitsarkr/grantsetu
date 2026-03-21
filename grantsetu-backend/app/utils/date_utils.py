"""Indian date parsing utilities."""

import re
from datetime import datetime, timezone

# Common Indian date formats
DATE_PATTERNS = [
    (r"(\d{2})/(\d{2})/(\d{4})", "%d/%m/%Y"),         # DD/MM/YYYY
    (r"(\d{2})-(\d{2})-(\d{4})", "%d-%m-%Y"),         # DD-MM-YYYY
    (r"(\d{2})\.(\d{2})\.(\d{4})", "%d.%m.%Y"),       # DD.MM.YYYY
    (r"(\d{4})-(\d{2})-(\d{2})", "%Y-%m-%d"),         # YYYY-MM-DD (ISO)
]

MONTH_NAMES = {
    "january": 1, "february": 2, "march": 3, "april": 4,
    "may": 5, "june": 6, "july": 7, "august": 8,
    "september": 9, "october": 10, "november": 11, "december": 12,
    "jan": 1, "feb": 2, "mar": 3, "apr": 4,
    "jun": 6, "jul": 7, "aug": 8, "sep": 9, "sept": 9,
    "oct": 10, "nov": 11, "dec": 12,
}


def parse_indian_date(text: str) -> datetime | None:
    """Parse various Indian date formats into a timezone-aware datetime.

    Handles: DD/MM/YYYY, DD-MM-YYYY, "31st March 2026", "15 Jan 2026", etc.
    Returns None if parsing fails.
    """
    if not text:
        return None

    text = text.strip()

    # Try standard patterns first
    for pattern, fmt in DATE_PATTERNS:
        match = re.search(pattern, text)
        if match:
            try:
                dt = datetime.strptime(match.group(), fmt)
                return dt.replace(tzinfo=timezone.utc)
            except ValueError:
                continue

    # Try natural language: "31st March 2026", "15 Jan 2026"
    natural = re.search(
        r"(\d{1,2})(?:st|nd|rd|th)?\s+([A-Za-z]+)\s+(\d{4})", text
    )
    if natural:
        day = int(natural.group(1))
        month_str = natural.group(2).lower()
        year = int(natural.group(3))
        month = MONTH_NAMES.get(month_str)
        if month:
            try:
                return datetime(year, month, day, tzinfo=timezone.utc)
            except ValueError:
                pass

    return None
