"""Application configuration via environment variables."""

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    DATABASE_URL: str = "postgresql+asyncpg://grantsetu:password@localhost:5432/grantsetu"
    REDIS_URL: str = "redis://localhost:6379/0"
    VLLM_BASE_URL: str = "http://localhost:8000/v1"
    RESEND_API_KEY: str = ""
    EMAIL_FROM: str = "GrantSetu <noreply@grantsetu.in>"
    FRONTEND_URL: str = "http://localhost:3000"
    ADMIN_EMAILS: str = ""
    CORS_ORIGINS: str = "http://localhost:3000"
    NEXTAUTH_SECRET: str = ""
    DEBUG: bool = False
    ADMIN_USERNAME: str = "admin"
    ADMIN_PASSWORD: str = "admin123"

    @property
    def admin_email_list(self) -> list[str]:
        return [e.strip() for e in self.ADMIN_EMAILS.split(",") if e.strip()]

    @property
    def cors_origin_list(self) -> list[str]:
        return [o.strip() for o in self.CORS_ORIGINS.split(",") if o.strip()]

    model_config = {"env_file": ".env", "env_file_encoding": "utf-8", "extra": "ignore"}


settings = Settings()
