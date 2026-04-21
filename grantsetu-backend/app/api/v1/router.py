"""V1 API router — mounts all v1 sub-routers."""

from fastapi import APIRouter

from app.api.v1.admin import router as admin_router
from app.api.v1.alerts import router as alerts_router
from app.api.v1.auth import router as auth_router
from app.api.v1.blog import admin_router as blog_admin_router
from app.api.v1.blog import router as blog_router
from app.api.v1.grants import router as grants_router
from app.api.v1.health import router as health_router
from app.api.v1.users import router as users_router

v1_router = APIRouter(prefix="/api/v1")
v1_router.include_router(health_router)
v1_router.include_router(auth_router)
v1_router.include_router(grants_router)
v1_router.include_router(users_router)
v1_router.include_router(alerts_router)
v1_router.include_router(blog_router)
v1_router.include_router(admin_router)
v1_router.include_router(blog_admin_router)
