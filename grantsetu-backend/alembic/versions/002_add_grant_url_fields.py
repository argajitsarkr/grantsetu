"""Add notification_url, call_url, apply_url to grants table.

Revision ID: 002
Revises: 001
Create Date: 2026-03-21
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = "002"
down_revision: Union[str, None] = "001"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column("grants", sa.Column("notification_url", sa.Text()))
    op.add_column("grants", sa.Column("call_url", sa.Text()))
    op.add_column("grants", sa.Column("apply_url", sa.Text()))


def downgrade() -> None:
    op.drop_column("grants", "apply_url")
    op.drop_column("grants", "call_url")
    op.drop_column("grants", "notification_url")
