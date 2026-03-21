"""Celery application configuration."""

from celery import Celery
from celery.schedules import crontab

from app.config import settings

celery_app = Celery(
    "grantsetu",
    broker=settings.REDIS_URL,
    backend=settings.REDIS_URL,
)

celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="Asia/Kolkata",
    enable_utc=True,
    task_track_started=True,
    task_acks_late=True,
    worker_prefetch_multiplier=1,
    worker_max_tasks_per_child=100,
)

celery_app.conf.beat_schedule = {
    "scrape-all-daily": {
        "task": "app.tasks.scraper_tasks.run_all_scrapers",
        "schedule": crontab(hour=6, minute=0),  # 6 AM IST
    },
    "send-daily-digest": {
        "task": "app.tasks.alert_tasks.send_daily_digest",
        "schedule": crontab(hour=8, minute=0),  # 8 AM IST
    },
    "send-weekly-digest": {
        "task": "app.tasks.alert_tasks.send_weekly_digest",
        "schedule": crontab(hour=9, minute=0, day_of_week=1),  # Monday 9 AM IST
    },
}

celery_app.autodiscover_tasks(["app.tasks"])
