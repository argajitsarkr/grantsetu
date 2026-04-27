"""Public site stats - lightweight visitor counter backed by Redis.

Two keys:
  grantsetu:visits:total  - monotonic page-view count
  grantsetu:visits:unique - HyperLogLog of hashed visitor IPs (approx unique)
"""
from __future__ import annotations

import hashlib
import logging

import redis.asyncio as aioredis
from fastapi import APIRouter, Request

from app.config import settings

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/stats", tags=["stats"])

_TOTAL_KEY = "grantsetu:visits:total"
_UNIQUE_KEY = "grantsetu:visits:unique"


def _client_fingerprint(request: Request) -> str:
    ip = (
        request.headers.get("cf-connecting-ip")
        or request.headers.get("x-forwarded-for", "").split(",")[0].strip()
        or (request.client.host if request.client else "unknown")
    )
    ua = request.headers.get("user-agent", "")
    return hashlib.sha256(f"{ip}|{ua}".encode()).hexdigest()


@router.post("/visit")
async def record_visit(request: Request) -> dict:
    try:
        r = aioredis.from_url(settings.REDIS_URL, decode_responses=True)
        total = await r.incr(_TOTAL_KEY)
        await r.pfadd(_UNIQUE_KEY, _client_fingerprint(request))
        unique = await r.pfcount(_UNIQUE_KEY)
        await r.aclose()
        return {"total": int(total), "unique": int(unique)}
    except Exception as err:  # noqa: BLE001
        logger.warning("[stats] record_visit failed: %s", err)
        return {"total": 0, "unique": 0}


@router.get("/visits")
async def get_visits() -> dict:
    try:
        r = aioredis.from_url(settings.REDIS_URL, decode_responses=True)
        total = await r.get(_TOTAL_KEY)
        unique = await r.pfcount(_UNIQUE_KEY)
        await r.aclose()
        return {"total": int(total or 0), "unique": int(unique or 0)}
    except Exception as err:  # noqa: BLE001
        logger.warning("[stats] get_visits failed: %s", err)
        return {"total": 0, "unique": 0}
