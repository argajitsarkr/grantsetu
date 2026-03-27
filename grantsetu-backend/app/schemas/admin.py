"""Pydantic schemas for admin authentication."""

from pydantic import BaseModel


class AdminLoginRequest(BaseModel):
    username: str
    password: str


class AdminTokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
