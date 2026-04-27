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


async def _send_confirmation(client: httpx.AsyncClient, email: str) -> bool:
    """Trigger Buttondown's confirmation/reminder email immediately.

    API-created `unactivated` subscribers don't get a confirmation email
    automatically - they'd wait for the 24h "Subscription reminder" cron.
    This forces it to fire now. Tries the documented send-reminder endpoint,
    then a couple of known alternates so we survive minor API changes.
    Always non-fatal: failures are logged but don't break the subscribe flow.
    """
    candidates = [
        ("POST", f"{_BASE_URL}/subscribers/{email}/send-reminder", None),
        ("POST", f"{_BASE_URL}/subscribers/{email}/emails", {"type": "reminder"}),
        ("POST", f"{_BASE_URL}/subscribers/{email}/emit-event", {"event": "remind"}),
    ]
    for method, url, body in candidates:
        try:
            r = await client.request(method, url, headers=_headers(), json=body)
            if r.status_code in (200, 201, 202, 204):
                logger.info(
                    "[buttondown_service] confirmation email triggered for %s via %s",
                    email,
                    url.rsplit("/", 1)[-1],
                )
                return True
            logger.warning(
                "[buttondown_service] confirmation attempt %s -> %s: %s",
                url.rsplit("/", 1)[-1],
                r.status_code,
                r.text[:200],
            )
        except Exception as err:  # noqa: BLE001
            logger.warning(
                "[buttondown_service] confirmation attempt %s exception: %s",
                url.rsplit("/", 1)[-1],
                err,
            )
    logger.error(
        "[buttondown_service] all confirmation-email attempts failed for %s", email
    )
    return False


async def subscribe(
    email: str,
    tags: list[str] | None = None,
    ip_address: str | None = None,
    referrer_url: str | None = None,
) -> dict:
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

    # type="unactivated" forces Buttondown to send the double opt-in
    # confirmation email. Without this, API-created subscribers default to
    # "regular" (already-confirmed) and no confirmation mail is dispatched.
    payload: dict = {"email_address": email, "tags": tags, "type": "unactivated"}
    if ip_address:
        payload["ip_address"] = ip_address
    if referrer_url:
        payload["referrer_url"] = referrer_url
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.post(
                f"{_BASE_URL}/subscribers", headers=_headers(), json=payload
            )
            if resp.status_code in (200, 201):
                await _send_confirmation(client, email)
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
                # Re-send confirmation in case they're stuck unactivated.
                # Buttondown returns 4xx if they're already confirmed - non-fatal.
                await _send_confirmation(client, email)
                return {"ok": True, "status": "existed"}
            logger.error(
                "[buttondown_service] subscribe failed status=%s body=%s payload=%s",
                resp.status_code,
                resp.text[:500],
                payload,
            )
            return {
                "ok": False,
                "error": f"upstream {resp.status_code}: {resp.text[:200]}",
            }
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
