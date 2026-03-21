"""Grant model — core table for grant calls."""

from datetime import datetime

from sqlalchemy import (
    BigInteger,
    Boolean,
    DateTime,
    Index,
    Integer,
    String,
    Text,
    func,
)
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.orm import Mapped, mapped_column

from app.models import Base


class Grant(Base):
    __tablename__ = "grants"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    slug: Mapped[str] = mapped_column(String(300), unique=True, nullable=False, index=True)
    agency: Mapped[str] = mapped_column(String(50), nullable=False, index=True)
    scheme_name: Mapped[str | None] = mapped_column(String(255))
    title: Mapped[str] = mapped_column(Text, nullable=False)
    summary: Mapped[str | None] = mapped_column(Text)
    description: Mapped[str | None] = mapped_column(Text)
    deadline: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    deadline_text: Mapped[str | None] = mapped_column(String(100))
    budget_min: Mapped[int | None] = mapped_column(BigInteger)
    budget_max: Mapped[int | None] = mapped_column(BigInteger)
    duration_months: Mapped[int | None] = mapped_column(Integer)
    subject_areas: Mapped[list[str]] = mapped_column(ARRAY(String), server_default="{}")
    career_stages: Mapped[list[str]] = mapped_column(ARRAY(String), server_default="{}")
    institution_types: Mapped[list[str]] = mapped_column(ARRAY(String), server_default="{}")
    eligibility_summary: Mapped[str | None] = mapped_column(Text)
    age_limit: Mapped[int | None] = mapped_column(Integer)
    url: Mapped[str] = mapped_column(Text, nullable=False)
    notification_url: Mapped[str | None] = mapped_column(Text)
    call_url: Mapped[str | None] = mapped_column(Text)
    apply_url: Mapped[str | None] = mapped_column(Text)
    pdf_url: Mapped[str | None] = mapped_column(Text)
    portal_name: Mapped[str | None] = mapped_column(String(100))
    source_type: Mapped[str] = mapped_column(String(20), server_default="scraper")
    raw_text: Mapped[str | None] = mapped_column(Text)
    status: Mapped[str] = mapped_column(String(20), server_default="active", index=True)
    is_featured: Mapped[bool] = mapped_column(Boolean, server_default="false")
    scraped_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    __table_args__ = (
        Index("idx_grants_deadline", "deadline"),
        Index("idx_grants_subject_areas", "subject_areas", postgresql_using="gin"),
        Index("idx_grants_career_stages", "career_stages", postgresql_using="gin"),
        Index(
            "idx_grants_search",
            func.to_tsvector(
                "english",
                func.coalesce(title, "") + " " + func.coalesce(description, "") + " " + func.coalesce(scheme_name, ""),
            ),
            postgresql_using="gin",
        ),
    )
