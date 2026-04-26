"""Buttondown API wrapper.

In dev (no BUTTONDOWN_API_KEY), calls are logged to stdout so local flows work
without a live account. Used to tag paying subscribers into the Pro segment
and to land newsletter signups from the public Subscribe button.
"""
from __future__ import annotations

import logging

import httpx

from app.config import settings

logger = logging.getLogger(__name__)

_BASE_URL = "https://api.buttondown.com/v1"


def _headers() -> dict[str, str]:
    return {
        "Authorization": f"Token {settings.BUTTONDOWN_API_KEY}",
        "Content-Type": "application/json",
    }


async def subscribe(email: str, tags: list[str] | None = None) -> dict:
    """Subscribe `email` to the Buttondown newsletter, optionally tagging.

    Returns:
        {"ok": True, "status": "created"}  - new subscriber inserted
        {"ok": True, "status": "existed"}  - already subscribed (tags merged if any)
        {"ok": False, "error": "..."}      - upstream failure
    """
    tags = tags or []

    if not settings.BUTTONDOWN_API_KEY:
        logger.warning(
            "[buttondown_service] BUTTONDOWN_API_KEY not set - dev mode. "
            "Would subscribe %s with tags=%s",
            email,
            tags,
        )
        return {"ok": True, "status": "created"}

    payload = {"email_address": email, "tags": tags}
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.post(
                f"{_BASE_URL}/subscribers", headers=_headers(), json=payload
            )
            if resp.status_code in (200, 201):
                return {"ok": True, "status": "created"}
            if resp.status_code == 400 and "already" in resp.text.lower():
                if tags:
                    patch = await client.patch(
                        f"{_BASE_URL}/subscribers/{email}",
                        headers=_headers(),
                        json={"tags": tags},
                    )
                    if patch.status_code not in (200, 204):
                        logger.warning(
                            "[buttondown_service] subscribe tag-merge failed (%s): %s",
                            patch.status_code,
                            patch.text[:200],
                        )
                return {"ok": True, "status": "existed"}
            logger.error(
                "[buttondown_service] subscribe failed (%s): %s",
                resp.status_code,
                resp.text[:200],
            )
            return {"ok": False, "error": f"upstream {resp.status_code}"}
    except Exception as err:  # noqa: BLE001
        logger.exception("[buttondown_service] subscribe exception: %s", err)
        return {"ok": False, "error": str(err)}


async def tag_pro(email: str) -> bool:
    """Ensure `email` exists as a Buttondown subscriber with tag `pro`.

    If subscriber doesn't exist, create them with the tag. If they exist,
    append the tag. Returns True on success (or stdout fallback).
    """
    if not settings.BUTTONDOWN_API_KEY:
        logger.warning(
            "[buttondown_service] BUTTONDOWN_API_KEY not set - dev mode. "
            "Would tag %s as 'pro'",
            email,
        )
        return True

    payload = {"email_address": email, "tags": ["pro"]}
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.post(
                f"{_BASE_URL}/subscribers", headers=_headers(), json=payload
            )
            if resp.status_code in (200, 201):
                return True
            # 400 with "already subscribed" → patch the existing subscriber to add the tag
            if resp.status_code == 400 and "already" in resp.text.lower():
                patch = await client.patch(
                    f"{_BASE_URL}/subscribers/{email}",
                    headers=_headers(),
                    json={"tags": ["pro"]},
                )
                return patch.status_code in (200, 204)
            logger.error(
                "[buttondown_service] tag_pro failed (%s): %s",
                resp.status_code,
                resp.text[:200],
            )
            return False
    except Exception as err:  # noqa: BLE001
        logger.exception("[buttondown_service] tag_pro exception: %s", err)
        return False
