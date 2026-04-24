"""Subscription model — Razorpay-backed Pro tier."""

from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, Integer, String, func
from sqlalchemy.orm import Mapped, mapped_column

from app.models import Base


class Subscription(Base):
    __tablename__ = "subscriptions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )
    tier: Mapped[str] = mapped_column(String(20), nullable=False, server_default="pro")
    razorpay_order_id: Mapped[str] = mapped_column(String(64), nullable=False, unique=True, index=True)
    razorpay_payment_id: Mapped[str | None] = mapped_column(String(64))
    razorpay_signature: Mapped[str | None] = mapped_column(String(128))
    amount_paise: Mapped[int] = mapped_column(Integer, nullable=False)
    currency: Mapped[str] = mapped_column(String(8), nullable=False, server_default="INR")
    receipt: Mapped[str] = mapped_column(String(64), nullable=False, unique=True)
    # status: created | attempted | paid | failed | refunded
    status: Mapped[str] = mapped_column(String(20), nullable=False, server_default="created")
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    starts_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    ends_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
