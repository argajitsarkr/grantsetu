"""Billing endpoints — Razorpay Pro subscription.

Flow: GET /pricing → POST /create-order (creates Razorpay order + DB row) →
client opens Razorpay Checkout → on success, client POSTs /verify with signature →
server verifies HMAC, marks subscription paid, flips user to Pro tier, tags in Buttondown.
"""
from __future__ import annotations

import logging
import time
from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy import func, select, update
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user
from app.config import settings
from app.database import get_db
from app.models.subscription import Subscription
from app.models.user import User
from app.schemas.subscription import (
    CreateOrderResponse,
    PaymentFailedRequest,
    PrefillInfo,
    PricingResponse,
    SubscriptionResponse,
    VerifyPaymentRequest,
)
from app.services import buttondown_service

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/billing", tags=["billing"])


def _razorpay_client():
    """Lazy-import Razorpay SDK so the backend can boot without the package
    installed in dev. Raises HTTPException if keys are missing."""
    if not settings.RAZORPAY_KEY_ID or not settings.RAZORPAY_KEY_SECRET:
        raise HTTPException(status_code=503, detail="Billing not configured")
    try:
        import razorpay  # type: ignore
    except ImportError as err:  # pragma: no cover
        logger.exception("razorpay SDK not installed: %s", err)
        raise HTTPException(status_code=503, detail="Billing SDK unavailable")
    return razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))


async def _count_paid(db: AsyncSession) -> int:
    result = await db.execute(
        select(func.count(Subscription.id)).where(
            Subscription.tier == "pro", Subscription.status == "paid"
        )
    )
    return int(result.scalar_one())


async def _compute_price(db: AsyncSession) -> tuple[int, bool, int]:
    """Returns (price_paise, early_bird, spots_remaining)."""
    count = await _count_paid(db)
    cap = settings.PRO_EARLY_BIRD_CAP
    if count < cap:
        return settings.PRO_EARLY_BIRD_PRICE_PAISE, True, cap - count
    return settings.PRO_REGULAR_PRICE_PAISE, False, 0


@router.get("/pricing", response_model=PricingResponse)
async def get_pricing(db: AsyncSession = Depends(get_db)) -> PricingResponse:
    price, early_bird, remaining = await _compute_price(db)
    return PricingResponse(
        price_paise=price,
        currency="INR",
        early_bird=early_bird,
        spots_remaining=remaining if early_bird else None,
        early_bird_cap=settings.PRO_EARLY_BIRD_CAP,
    )


@router.post("/create-order", response_model=CreateOrderResponse)
async def create_order(
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> CreateOrderResponse:
    now = datetime.now(timezone.utc)

    # Refuse if user already has an active Pro subscription.
    existing = await db.execute(
        select(Subscription)
        .where(
            Subscription.user_id == user.id,
            Subscription.status == "paid",
            Subscription.ends_at > now,
        )
        .order_by(Subscription.created_at.desc())
    )
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=409, detail="Already subscribed to Pro")

    price_paise, _, _ = await _compute_price(db)
    receipt = f"gs_sub_{user.id}_{int(time.time())}"

    client = _razorpay_client()
    try:
        order = client.order.create(
            {
                "amount": price_paise,
                "currency": "INR",
                "receipt": receipt,
                "notes": {
                    "user_id": str(user.id),
                    "tier": "pro",
                    "email": user.email,
                },
            }
        )
    except Exception as err:  # noqa: BLE001
        logger.exception("Razorpay order.create failed: %s", err)
        raise HTTPException(status_code=502, detail="Payment provider error")

    sub = Subscription(
        user_id=user.id,
        tier="pro",
        razorpay_order_id=order["id"],
        amount_paise=price_paise,
        currency="INR",
        receipt=receipt,
        status="created",
    )
    db.add(sub)
    await db.commit()

    return CreateOrderResponse(
        order_id=order["id"],
        amount_paise=price_paise,
        currency="INR",
        key_id=settings.RAZORPAY_KEY_ID,
        receipt=receipt,
        prefill=PrefillInfo(name=user.name, email=user.email),
    )


@router.post("/verify", response_model=SubscriptionResponse)
async def verify_payment(
    payload: VerifyPaymentRequest,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> SubscriptionResponse:
    client = _razorpay_client()

    try:
        client.utility.verify_payment_signature(
            {
                "razorpay_order_id": payload.razorpay_order_id,
                "razorpay_payment_id": payload.razorpay_payment_id,
                "razorpay_signature": payload.razorpay_signature,
            }
        )
    except Exception as err:  # noqa: BLE001
        logger.warning(
            "Signature verification failed for order %s: %s",
            payload.razorpay_order_id,
            err,
        )
        raise HTTPException(status_code=400, detail="Invalid payment signature")

    result = await db.execute(
        select(Subscription).where(Subscription.razorpay_order_id == payload.razorpay_order_id)
    )
    sub = result.scalar_one_or_none()
    if not sub:
        raise HTTPException(status_code=404, detail="Order not found")
    if sub.user_id != user.id:
        raise HTTPException(status_code=403, detail="Order does not belong to user")

    # Idempotent: already-paid orders return the existing record unchanged.
    if sub.status == "paid":
        return SubscriptionResponse.model_validate(sub)

    now = datetime.now(timezone.utc)
    sub.razorpay_payment_id = payload.razorpay_payment_id
    sub.razorpay_signature = payload.razorpay_signature
    sub.status = "paid"
    sub.starts_at = now
    sub.ends_at = now + timedelta(days=365)

    await db.execute(
        update(User).where(User.id == user.id).values(subscription_tier="pro")
    )
    await db.commit()
    await db.refresh(sub)

    # Tag in Buttondown for the Pro segment. Failures are logged, not fatal —
    # the paid subscription stands even if the newsletter tag fails.
    try:
        await buttondown_service.tag_pro(user.email)
    except Exception as err:  # noqa: BLE001
        logger.exception("Buttondown tagging failed for %s: %s", user.email, err)

    return SubscriptionResponse.model_validate(sub)


@router.post("/payment-failed", status_code=204, response_class=Response)
async def mark_payment_failed(
    payload: PaymentFailedRequest,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> None:
    """Observability-only: record a dismissed/failed checkout attempt."""
    result = await db.execute(
        select(Subscription).where(Subscription.razorpay_order_id == payload.razorpay_order_id)
    )
    sub = result.scalar_one_or_none()
    if not sub or sub.user_id != user.id:
        return
    if sub.status == "paid":
        return
    sub.status = "failed"
    await db.commit()
    logger.info(
        "Payment failed for order %s (%s): %s",
        payload.razorpay_order_id,
        payload.error_code,
        payload.error_description,
    )
