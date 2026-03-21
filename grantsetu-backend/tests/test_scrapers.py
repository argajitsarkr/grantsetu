"""Tests for scraper extraction logic."""

import pytest

from app.utils.date_utils import parse_indian_date
from app.utils.slug import generate_slug


def test_parse_dd_mm_yyyy():
    """Should parse DD/MM/YYYY format."""
    dt = parse_indian_date("31/03/2026")
    assert dt is not None
    assert dt.day == 31
    assert dt.month == 3
    assert dt.year == 2026


def test_parse_dd_mm_yyyy_dash():
    """Should parse DD-MM-YYYY format."""
    dt = parse_indian_date("15-04-2026")
    assert dt is not None
    assert dt.day == 15
    assert dt.month == 4


def test_parse_natural_date():
    """Should parse natural language dates."""
    dt = parse_indian_date("31st March 2026")
    assert dt is not None
    assert dt.day == 31
    assert dt.month == 3
    assert dt.year == 2026


def test_parse_short_month():
    """Should parse abbreviated month names."""
    dt = parse_indian_date("15 Jan 2026")
    assert dt is not None
    assert dt.month == 1


def test_parse_invalid():
    """Should return None for invalid dates."""
    assert parse_indian_date("") is None
    assert parse_indian_date("not a date") is None
    assert parse_indian_date("Open / Rolling") is None


def test_generate_slug():
    """Should generate URL-friendly slugs."""
    slug = generate_slug("DBT BIO-GRID Call for Proposals", "DBT", 2026)
    assert "dbt" in slug
    assert "bio-grid" in slug
    assert "2026" in slug
    assert " " not in slug


def test_generate_slug_no_year():
    """Should work without year."""
    slug = generate_slug("ICMR Extramural Research", "ICMR")
    assert "icmr" in slug
    assert "extramural" in slug
