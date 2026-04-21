"""Add email verification + password reset fields.

Revision ID: 006
Revises: 005
Create Date: 2026-04-21
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = "006"
down_revision: Union[str, None] = "005"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "users",
        sa.Column("email_verified", sa.Boolean(), nullable=False, server_default=sa.text("false")),
    )
    op.add_column("users", sa.Column("email_verification_token", sa.String(length=64), nullable=True))
    op.add_column(
        "users",
        sa.Column("email_verification_sent_at", sa.DateTime(timezone=True), nullable=True),
    )
    op.add_column("users", sa.Column("password_reset_token", sa.String(length=64), nullable=True))
    op.add_column(
        "users",
        sa.Column("password_reset_expires_at", sa.DateTime(timezone=True), nullable=True),
    )
    op.create_index(
        "ix_users_email_verification_token",
        "users",
        ["email_verification_token"],
        unique=False,
    )
    op.create_index(
        "ix_users_password_reset_token",
        "users",
        ["password_reset_token"],
        unique=False,
    )
    # Existing Google OAuth users are already verified by Google.
    op.execute("UPDATE users SET email_verified = true WHERE auth_provider = 'google'")


def downgrade() -> None:
    op.drop_index("ix_users_password_reset_token", table_name="users")
    op.drop_index("ix_users_email_verification_token", table_name="users")
    op.drop_column("users", "password_reset_expires_at")
    op.drop_column("users", "password_reset_token")
    op.drop_column("users", "email_verification_sent_at")
    op.drop_column("users", "email_verification_token")
    op.drop_column("users", "email_verified")
