"""Pydantic schemas for subscription + billing endpoints."""

from datetime import datetime

from pydantic import BaseModel


class PricingResponse(BaseModel):
    price_paise: int
    currency: str = "INR"
    early_bird: bool
    spots_remaining: int | None
    early_bird_cap: int


class PrefillInfo(BaseModel):
    name: str
    email: str


class CreateOrderResponse(BaseModel):
    order_id: str
    amount_paise: int
    currency: str
    key_id: str
    receipt: str
    prefill: PrefillInfo


class VerifyPaymentRequest(BaseModel):
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str


class PaymentFailedRequest(BaseModel):
    razorpay_order_id: str
    error_code: str | None = None
    error_description: str | None = None


class SubscriptionResponse(BaseModel):
    id: int
    tier: str
    status: str
    amount_paise: int
    currency: str
    starts_at: datetime | None
    ends_at: datetime | None
    created_at: datetime

    model_config = {"from_attributes": True}
