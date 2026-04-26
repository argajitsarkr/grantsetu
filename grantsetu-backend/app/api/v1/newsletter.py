"""Public newsletter subscribe endpoint - lands signups in Buttondown."""
from __future__ import annotations

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr

from app.services import buttondown_service

router = APIRouter(prefix="/newsletter", tags=["newsletter"])


class SubscribeRequest(BaseModel):
    email: EmailStr
    source: str | None = None


class SubscribeResponse(BaseModel):
    status: str  # "created" or "existed"


@router.post("/subscribe", response_model=SubscribeResponse)
async def subscribe(data: SubscribeRequest) -> SubscribeResponse:
    tags = [data.source] if data.source else []
    result = await buttondown_service.subscribe(str(data.email), tags=tags)
    if not result["ok"]:
        raise HTTPException(
            status_code=502,
            detail=result.get("error", "Newsletter subscribe failed"),
        )
    return SubscribeResponse(status=result["status"])
