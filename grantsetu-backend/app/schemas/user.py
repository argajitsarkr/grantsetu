"""Pydantic schemas for user API requests and responses."""

from datetime import date, datetime

from pydantic import BaseModel, EmailStr, Field


class UserSync(BaseModel):
    """Schema for syncing user from NextAuth."""

    name: str
    email: EmailStr
    image_url: str | None = None
    auth_provider: str = "google"


class UserUpdate(BaseModel):
    """Schema for updating user profile."""

    name: str | None = None
    institution: str | None = None
    department: str | None = None
    designation: str | None = None
    career_stage: str | None = None
    subject_areas: list[str] | None = None
    institution_type: str | None = None
    state: str | None = None
    research_keywords: list[str] | None = None
    date_of_birth: date | None = None
    preferred_agencies: list[str] | None = None
    onboarding_completed: bool | None = None
    alert_enabled: bool | None = None
    alert_frequency: str | None = None
    alert_agencies: list[str] | None = None


class UserResponse(BaseModel):
    """Schema for user API response."""

    id: int
    name: str
    email: str
    image_url: str | None = None
    institution: str | None = None
    department: str | None = None
    designation: str | None = None
    career_stage: str | None = None
    subject_areas: list[str] = Field(default_factory=list)
    institution_type: str | None = None
    state: str | None = None
    research_keywords: list[str] = Field(default_factory=list)
    date_of_birth: date | None = None
    onboarding_completed: bool
    preferred_agencies: list[str] = Field(default_factory=list)
    alert_enabled: bool
    alert_frequency: str
    alert_agencies: list[str] = Field(default_factory=list)
    is_admin: bool
    email_verified: bool = False
    created_at: datetime

    model_config = {"from_attributes": True}


class AlertSubscribe(BaseModel):
    """Schema for alert signup/update."""

    email: EmailStr
    subject_areas: list[str] = Field(default_factory=list)
    career_stage: str | None = None
    agencies: list[str] = Field(default_factory=list)
    frequency: str = "weekly"  # "daily" or "weekly"
