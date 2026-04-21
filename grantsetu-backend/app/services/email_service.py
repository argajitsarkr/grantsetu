"""Transactional email helpers (Resend).

In dev (no RESEND_API_KEY), emails are logged to stdout with the action link
so the local flow is still testable without live sends.
"""
from __future__ import annotations

import logging

from app.config import settings

logger = logging.getLogger(__name__)

_BRAND_LOGO = "https://grantsetu.in/grantsetu-logo.png"
_RED = "#E9283D"


def _button_html(url: str, label: str) -> str:
    return (
        f'<a href="{url}" style="display:inline-block;background:{_RED};color:#fff;'
        f'font-weight:700;text-decoration:none;padding:14px 24px;border-radius:10px;'
        f'font-family:Arial,sans-serif;font-size:14px;letter-spacing:0.5px;">{label}</a>'
    )


def _wrap(body_html: str) -> str:
    return f"""<!doctype html>
<html><body style="margin:0;background:#f6f6f6;font-family:Arial,sans-serif;color:#000;">
  <div style="max-width:560px;margin:0 auto;padding:32px 20px;">
    <div style="background:#fff;border:2px solid #000;border-radius:14px;padding:32px;">
      <img src="{_BRAND_LOGO}" alt="GrantSetu" height="32" style="height:32px;margin-bottom:24px;" />
      {body_html}
      <hr style="border:none;border-top:1px solid #eee;margin:28px 0 16px;" />
      <p style="font-size:12px;color:#777;line-height:1.5;margin:0;">
        GrantSetu - Indian research grants, curated.<br/>
        If you did not request this email, you can safely ignore it.
      </p>
    </div>
  </div>
</body></html>"""


def _send(to: str, subject: str, html: str, text: str) -> bool:
    if not settings.RESEND_API_KEY:
        logger.warning(
            "[email_service] RESEND_API_KEY not set - dev mode. Would send to %s:\n"
            "Subject: %s\n%s",
            to,
            subject,
            text,
        )
        return True
    try:
        import resend  # type: ignore

        resend.api_key = settings.RESEND_API_KEY
        resend.Emails.send(
            {
                "from": settings.EMAIL_FROM,
                "to": [to],
                "subject": subject,
                "html": html,
                "text": text,
            }
        )
        return True
    except Exception as err:  # noqa: BLE001
        logger.exception("Resend send failed to %s: %s", to, err)
        return False


def send_verification_email(to: str, name: str, token: str) -> bool:
    link = f"{settings.FRONTEND_URL}/auth/verify?token={token}"
    subject = "Confirm your GrantSetu account"
    body = (
        f'<h1 style="font-size:22px;margin:0 0 12px;">Hi {name},</h1>'
        f'<p style="font-size:15px;line-height:1.6;margin:0 0 20px;">'
        "Welcome to GrantSetu. Please confirm your email to unlock grant alerts "
        "and the full dashboard.</p>"
        f'<p style="margin:24px 0;">{_button_html(link, "VERIFY EMAIL")}</p>'
        f'<p style="font-size:12px;color:#666;">Or paste this link into your browser:<br/>'
        f'<a href="{link}" style="color:{_RED};word-break:break-all;">{link}</a></p>'
    )
    text = f"Hi {name},\n\nConfirm your GrantSetu email: {link}\n"
    return _send(to, subject, _wrap(body), text)


def send_password_reset_email(to: str, name: str, token: str) -> bool:
    link = f"{settings.FRONTEND_URL}/auth/reset?token={token}"
    subject = "Reset your GrantSetu password"
    body = (
        f'<h1 style="font-size:22px;margin:0 0 12px;">Hi {name},</h1>'
        f'<p style="font-size:15px;line-height:1.6;margin:0 0 20px;">'
        "We received a request to reset your GrantSetu password. "
        "This link is valid for 1 hour.</p>"
        f'<p style="margin:24px 0;">{_button_html(link, "RESET PASSWORD")}</p>'
        f'<p style="font-size:12px;color:#666;">If you did not ask for this, ignore this email - '
        "your password will not change.</p>"
    )
    text = f"Hi {name},\n\nReset your GrantSetu password (valid 1 hour): {link}\n"
    return _send(to, subject, _wrap(body), text)


def send_password_changed_notice(to: str, name: str) -> bool:
    subject = "Your GrantSetu password was changed"
    body = (
        f'<h1 style="font-size:22px;margin:0 0 12px;">Hi {name},</h1>'
        f'<p style="font-size:15px;line-height:1.6;margin:0 0 20px;">'
        "This is a confirmation that your GrantSetu password was just changed. "
        "If this was not you, reply to this email immediately.</p>"
    )
    text = f"Hi {name},\n\nYour GrantSetu password was just changed.\n"
    return _send(to, subject, _wrap(body), text)
