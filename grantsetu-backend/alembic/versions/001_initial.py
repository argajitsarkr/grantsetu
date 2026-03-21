"""Initial migration — create all tables.

Revision ID: 001
Revises: None
Create Date: 2026-03-19
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision: str = "001"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "grants",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("slug", sa.String(300), unique=True, nullable=False),
        sa.Column("agency", sa.String(50), nullable=False),
        sa.Column("scheme_name", sa.String(255)),
        sa.Column("title", sa.Text(), nullable=False),
        sa.Column("summary", sa.Text()),
        sa.Column("description", sa.Text()),
        sa.Column("deadline", sa.DateTime(timezone=True)),
        sa.Column("deadline_text", sa.String(100)),
        sa.Column("budget_min", sa.BigInteger()),
        sa.Column("budget_max", sa.BigInteger()),
        sa.Column("duration_months", sa.Integer()),
        sa.Column("subject_areas", postgresql.ARRAY(sa.String()), server_default="{}"),
        sa.Column("career_stages", postgresql.ARRAY(sa.String()), server_default="{}"),
        sa.Column("institution_types", postgresql.ARRAY(sa.String()), server_default="{}"),
        sa.Column("eligibility_summary", sa.Text()),
        sa.Column("age_limit", sa.Integer()),
        sa.Column("url", sa.Text(), nullable=False),
        sa.Column("pdf_url", sa.Text()),
        sa.Column("portal_name", sa.String(100)),
        sa.Column("source_type", sa.String(20), server_default="scraper"),
        sa.Column("raw_text", sa.Text()),
        sa.Column("status", sa.String(20), server_default="active"),
        sa.Column("is_featured", sa.Boolean(), server_default="false"),
        sa.Column("scraped_at", sa.DateTime(timezone=True)),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
    )
    op.create_index("idx_grants_agency", "grants", ["agency"])
    op.create_index("idx_grants_status", "grants", ["status"])
    op.create_index("idx_grants_deadline", "grants", ["deadline"])
    op.create_index("idx_grants_slug", "grants", ["slug"])
    op.create_index(
        "idx_grants_subject_areas", "grants", ["subject_areas"], postgresql_using="gin"
    )
    op.create_index(
        "idx_grants_career_stages", "grants", ["career_stages"], postgresql_using="gin"
    )
    op.execute(
        """CREATE INDEX idx_grants_search ON grants USING GIN(
            to_tsvector('english', coalesce(title, '') || ' ' || coalesce(description, '') || ' ' || coalesce(scheme_name, ''))
        )"""
    )

    op.create_table(
        "users",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("name", sa.String(255), nullable=False),
        sa.Column("email", sa.String(255), unique=True, nullable=False),
        sa.Column("image_url", sa.Text()),
        sa.Column("institution", sa.String(255)),
        sa.Column("department", sa.String(255)),
        sa.Column("designation", sa.String(100)),
        sa.Column("career_stage", sa.String(50)),
        sa.Column("subject_areas", postgresql.ARRAY(sa.String()), server_default="{}"),
        sa.Column("institution_type", sa.String(50)),
        sa.Column("state", sa.String(50)),
        sa.Column("alert_enabled", sa.Boolean(), server_default="false"),
        sa.Column("alert_frequency", sa.String(20), server_default="weekly"),
        sa.Column("alert_agencies", postgresql.ARRAY(sa.String()), server_default="{}"),
        sa.Column("auth_provider", sa.String(20)),
        sa.Column("is_admin", sa.Boolean(), server_default="false"),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
    )
    op.create_index("idx_users_email", "users", ["email"])

    op.create_table(
        "saved_grants",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("user_id", sa.Integer(), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
        sa.Column("grant_id", sa.Integer(), sa.ForeignKey("grants.id", ondelete="CASCADE"), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.UniqueConstraint("user_id", "grant_id"),
    )

    op.create_table(
        "alert_log",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("user_id", sa.Integer(), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
        sa.Column("grant_id", sa.Integer(), sa.ForeignKey("grants.id", ondelete="CASCADE"), nullable=False),
        sa.Column("sent_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column("channel", sa.String(20), server_default="email"),
    )

    op.create_table(
        "scraper_runs",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("agency", sa.String(50), nullable=False),
        sa.Column("started_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column("finished_at", sa.DateTime(timezone=True)),
        sa.Column("status", sa.String(20), server_default="running"),
        sa.Column("grants_found", sa.Integer(), server_default="0"),
        sa.Column("grants_new", sa.Integer(), server_default="0"),
        sa.Column("error_message", sa.Text()),
        sa.Column("log", sa.Text()),
    )


def downgrade() -> None:
    op.drop_table("scraper_runs")
    op.drop_table("alert_log")
    op.drop_table("saved_grants")
    op.drop_table("users")
    op.drop_index("idx_grants_search", "grants")
    op.drop_table("grants")
