"""User model."""

from datetime import date, datetime

from sqlalchemy import Boolean, Date, DateTime, Integer, String, Text, func
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.orm import Mapped, mapped_column

from app.models import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False, index=True)
    image_url: Mapped[str | None] = mapped_column(Text)
    institution: Mapped[str | None] = mapped_column(String(255))
    department: Mapped[str | None] = mapped_column(String(255))
    designation: Mapped[str | None] = mapped_column(String(100))
    career_stage: Mapped[str | None] = mapped_column(String(50))
    subject_areas: Mapped[list[str]] = mapped_column(ARRAY(String), server_default="{}")
    institution_type: Mapped[str | None] = mapped_column(String(50))
    state: Mapped[str | None] = mapped_column(String(50))
    research_keywords: Mapped[list[str]] = mapped_column(ARRAY(String), server_default="{}")
    date_of_birth: Mapped[date | None] = mapped_column(Date)
    onboarding_completed: Mapped[bool] = mapped_column(Boolean, server_default="false")
    preferred_agencies: Mapped[list[str]] = mapped_column(ARRAY(String), server_default="{}")
    alert_enabled: Mapped[bool] = mapped_column(Boolean, server_default="false")
    alert_frequency: Mapped[str] = mapped_column(String(20), server_default="weekly")
    alert_agencies: Mapped[list[str]] = mapped_column(ARRAY(String), server_default="{}")
    auth_provider: Mapped[str | None] = mapped_column(String(20))
    password_hash: Mapped[str | None] = mapped_column(String(255))
    is_admin: Mapped[bool] = mapped_column(Boolean, server_default="false")
    email_verified: Mapped[bool] = mapped_column(Boolean, server_default="false", nullable=False)
    email_verification_token: Mapped[str | None] = mapped_column(String(64), index=True)
    email_verification_sent_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    password_reset_token: Mapped[str | None] = mapped_column(String(64), index=True)
    password_reset_expires_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )
