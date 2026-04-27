"""Public newsletter subscribe endpoint - lands signups in Buttondown."""
from __future__ import annotations

from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel, EmailStr

from app.services import buttondown_service

router = APIRouter(prefix="/newsletter", tags=["newsletter"])


class SubscribeRequest(BaseModel):
    email: EmailStr
    source: str | None = None


class SubscribeResponse(BaseModel):
    status: str  # "created" or "existed"


def _client_ip(request: Request) -> str | None:
    cf = request.headers.get("cf-connecting-ip")
    if cf:
        return cf.strip()
    xff = request.headers.get("x-forwarded-for")
    if xff:
        return xff.split(",")[0].strip()
    return request.client.host if request.client else None


@router.post("/subscribe", response_model=SubscribeResponse)
async def subscribe(data: SubscribeRequest, request: Request) -> SubscribeResponse:
    tags = [data.source] if data.source else []
    result = await buttondown_service.subscribe(
        str(data.email),
        tags=tags,
        ip_address=_client_ip(request),
        referrer_url=request.headers.get("referer"),
    )
    if not result["ok"]:
        raise HTTPException(
            status_code=502,
            detail=result.get("error", "Newsletter subscribe failed"),
        )
    return SubscribeResponse(status=result["status"])
