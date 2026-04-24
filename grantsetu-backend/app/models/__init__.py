"""SQLAlchemy models."""

from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    """Base class for all models."""
    pass


from app.models.grant import Grant  # noqa: E402, F401
from app.models.user import User  # noqa: E402, F401
from app.models.saved_grant import SavedGrant  # noqa: E402, F401
from app.models.alert_log import AlertLog  # noqa: E402, F401
from app.models.scraper_run import ScraperRun  # noqa: E402, F401
from app.models.blog_post import BlogPost  # noqa: E402, F401
from app.models.subscription import Subscription  # noqa: E402, F401
