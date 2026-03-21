"""URL slug generation for grants."""

from slugify import slugify


def generate_slug(title: str, agency: str, year: int | None = None) -> str:
    """Generate a URL-friendly slug from grant title and agency.

    Example: "Biotechnology Career Advancement" + "DBT" + 2026
             -> "dbt-biotechnology-career-advancement-2026"
    """
    parts = [agency.lower(), title]
    if year:
        parts.append(str(year))
    raw = " ".join(parts)
    return slugify(raw, max_length=290)
