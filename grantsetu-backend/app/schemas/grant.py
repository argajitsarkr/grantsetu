"""Pydantic schemas for grant API requests and responses."""

from datetime import datetime

from pydantic import BaseModel, Field


class GrantBase(BaseModel):
    """Shared grant fields."""

    agency: str
    scheme_name: str | None = None
    title: str
    summary: str | None = None
    description: str | None = None
    deadline: datetime | None = None
    deadline_text: str | None = None
    budget_min: int | None = None
    budget_max: int | None = None
    duration_months: int | None = None
    subject_areas: list[str] = Field(default_factory=list)
    career_stages: list[str] = Field(default_factory=list)
    institution_types: list[str] = Field(default_factory=list)
    eligibility_summary: str | None = None
    age_limit: int | None = None
    url: str
    notification_url: str | None = None
    call_url: str | None = None
    apply_url: str | None = None
    pdf_url: str | None = None
    portal_name: str | None = None
    source_type: str = "scraper"
    status: str = "active"
    is_featured: bool = False


class GrantCreate(GrantBase):
    """Schema for creating a new grant."""

    raw_text: str | None = None


class GrantUpdate(BaseModel):
    """Schema for updating an existing grant. All fields optional."""

    agency: str | None = None
    scheme_name: str | None = None
    title: str | None = None
    summary: str | None = None
    description: str | None = None
    deadline: datetime | None = None
    deadline_text: str | None = None
    budget_min: int | None = None
    budget_max: int | None = None
    duration_months: int | None = None
    subject_areas: list[str] | None = None
    career_stages: list[str] | None = None
    institution_types: list[str] | None = None
    eligibility_summary: str | None = None
    age_limit: int | None = None
    url: str | None = None
    notification_url: str | None = None
    call_url: str | None = None
    apply_url: str | None = None
    pdf_url: str | None = None
    portal_name: str | None = None
    source_type: str | None = None
    raw_text: str | None = None
    status: str | None = None
    is_featured: bool | None = None


class GrantResponse(GrantBase):
    """Schema for grant API response."""

    id: int
    slug: str
    raw_text: str | None = None
    scraped_at: datetime | None = None
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class GrantListResponse(BaseModel):
    """Schema for grant in list view (lighter, no raw_text)."""

    id: int
    slug: str
    agency: str
    scheme_name: str | None = None
    title: str
    summary: str | None = None
    deadline: datetime | None = None
    deadline_text: str | None = None
    budget_min: int | None = None
    budget_max: int | None = None
    duration_months: int | None = None
    subject_areas: list[str] = Field(default_factory=list)
    career_stages: list[str] = Field(default_factory=list)
    status: str
    is_featured: bool
    url: str
    notification_url: str | None = None
    call_url: str | None = None
    apply_url: str | None = None
    pdf_url: str | None = None
    portal_name: str | None = None
    created_at: datetime

    model_config = {"from_attributes": True}


class AgencyCount(BaseModel):
    """Agency with active grant count."""

    agency: str
    count: int
