"""FastAPI application entry point."""

from contextlib import asynccontextmanager

import bcrypt
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.router import v1_router
from app.config import settings
from app.database import engine

# Module-level storage for the hashed admin password.
# Populated at startup; plaintext is never retained beyond the hash call.
_admin_password_hash: str = ""


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Manage application lifecycle — hash admin password on startup, dispose engine on shutdown."""
    global _admin_password_hash
    _admin_password_hash = bcrypt.hashpw(
        settings.ADMIN_PASSWORD.encode(), bcrypt.gensalt()
    ).decode()
    yield
    await engine.dispose()


app = FastAPI(
    title="GrantSetu API",
    description="Indian Research Grant Discovery Platform",
    version="0.1.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(v1_router)
