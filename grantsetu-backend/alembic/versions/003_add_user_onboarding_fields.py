"""Add research_keywords, date_of_birth, onboarding_completed, preferred_agencies to users table.

Revision ID: 003
Revises: 002
Create Date: 2026-03-22
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import ARRAY

revision: str = "003"
down_revision: Union[str, None] = "002"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column("users", sa.Column("research_keywords", ARRAY(sa.String()), server_default="{}"))
    op.add_column("users", sa.Column("date_of_birth", sa.Date(), nullable=True))
    op.add_column("users", sa.Column("onboarding_completed", sa.Boolean(), server_default="false"))
    op.add_column("users", sa.Column("preferred_agencies", ARRAY(sa.String()), server_default="{}"))


def downgrade() -> None:
    op.drop_column("users", "preferred_agencies")
    op.drop_column("users", "onboarding_completed")
    op.drop_column("users", "date_of_birth")
    op.drop_column("users", "research_keywords")
