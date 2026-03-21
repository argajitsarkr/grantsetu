"""Tests for grants API endpoints."""

import pytest
from httpx import ASGITransport, AsyncClient

from app.main import app


@pytest.mark.asyncio
async def test_list_grants():
    """List grants endpoint should return paginated response."""
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as client:
        response = await client.get("/api/v1/grants")
        assert response.status_code == 200
        data = response.json()
        assert "items" in data
        assert "total" in data
        assert "page" in data
        assert "per_page" in data
        assert "pages" in data


@pytest.mark.asyncio
async def test_list_grants_with_filters():
    """Grants endpoint should accept filter params."""
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as client:
        response = await client.get(
            "/api/v1/grants?agency=DBT&sort=deadline_asc&page=1&per_page=10"
        )
        assert response.status_code == 200


@pytest.mark.asyncio
async def test_list_agencies():
    """Agencies endpoint should return list."""
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as client:
        response = await client.get("/api/v1/grants/agencies")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)


@pytest.mark.asyncio
async def test_grant_not_found():
    """Non-existent grant slug should return 404."""
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as client:
        response = await client.get("/api/v1/grants/nonexistent-slug-12345")
        assert response.status_code == 404
