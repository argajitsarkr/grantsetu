"""Add subscriptions table + users.subscription_tier.

Revision ID: 007
Revises: 006
Create Date: 2026-04-22
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = "007"
down_revision: Union[str, None] = "006"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "users",
        sa.Column(
            "subscription_tier",
            sa.String(length=20),
            nullable=False,
            server_default=sa.text("'free'"),
        ),
    )
    op.create_table(
        "subscriptions",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column(
            "user_id",
            sa.Integer(),
            sa.ForeignKey("users.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column("tier", sa.String(length=20), nullable=False, server_default=sa.text("'pro'")),
        sa.Column("razorpay_order_id", sa.String(length=64), nullable=False),
        sa.Column("razorpay_payment_id", sa.String(length=64), nullable=True),
        sa.Column("razorpay_signature", sa.String(length=128), nullable=True),
        sa.Column("amount_paise", sa.Integer(), nullable=False),
        sa.Column("currency", sa.String(length=8), nullable=False, server_default=sa.text("'INR'")),
        sa.Column("receipt", sa.String(length=64), nullable=False),
        sa.Column(
            "status", sa.String(length=20), nullable=False, server_default=sa.text("'created'")
        ),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.func.now(),
        ),
        sa.Column("starts_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("ends_at", sa.DateTime(timezone=True), nullable=True),
        sa.UniqueConstraint("razorpay_order_id", name="uq_subscriptions_razorpay_order_id"),
        sa.UniqueConstraint("receipt", name="uq_subscriptions_receipt"),
    )
    op.create_index("ix_subscriptions_user_id", "subscriptions", ["user_id"])
    op.create_index(
        "ix_subscriptions_razorpay_order_id", "subscriptions", ["razorpay_order_id"]
    )
    op.create_index("ix_subscriptions_status", "subscriptions", ["status"])


def downgrade() -> None:
    op.drop_index("ix_subscriptions_status", table_name="subscriptions")
    op.drop_index("ix_subscriptions_razorpay_order_id", table_name="subscriptions")
    op.drop_index("ix_subscriptions_user_id", table_name="subscriptions")
    op.drop_table("subscriptions")
    op.drop_column("users", "subscription_tier")
