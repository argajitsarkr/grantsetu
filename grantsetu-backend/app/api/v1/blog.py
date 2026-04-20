"""Blog post endpoints - public list/detail + admin CRUD."""

from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, Query
from slugify import slugify
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import require_admin
from app.database import get_db
from app.models.blog_post import BlogPost
from app.schemas.blog_post import (
    BlogPostCreate,
    BlogPostListResponse,
    BlogPostResponse,
    BlogPostUpdate,
)

router = APIRouter(prefix="/blog", tags=["blog"])


async def _unique_slug(db: AsyncSession, base: str, exclude_id: int | None = None) -> str:
    """Ensure slug uniqueness by appending -2, -3, ... when collisions exist."""
    candidate = base
    n = 2
    while True:
        q = select(BlogPost.id).where(BlogPost.slug == candidate)
        if exclude_id is not None:
            q = q.where(BlogPost.id != exclude_id)
        existing = (await db.execute(q)).scalar_one_or_none()
        if existing is None:
            return candidate
        candidate = f"{base}-{n}"
        n += 1


@router.get("", response_model=BlogPostListResponse)
async def list_blog_posts(
    page: int = Query(1, ge=1),
    per_page: int = Query(12, ge=1, le=100),
    category: str | None = None,
    featured: bool | None = None,
    search: str | None = None,
    include_drafts: bool = False,
    db: AsyncSession = Depends(get_db),
) -> BlogPostListResponse:
    q = select(BlogPost)
    c = select(func.count(BlogPost.id))
    if not include_drafts:
        q = q.where(BlogPost.status == "published")
        c = c.where(BlogPost.status == "published")
    if category:
        q = q.where(BlogPost.category == category)
        c = c.where(BlogPost.category == category)
    if featured is not None:
        q = q.where(BlogPost.is_featured.is_(featured))
        c = c.where(BlogPost.is_featured.is_(featured))
    if search:
        pattern = f"%{search}%"
        q = q.where(BlogPost.title.ilike(pattern))
        c = c.where(BlogPost.title.ilike(pattern))
    total = (await db.execute(c)).scalar() or 0
    q = q.order_by(
        BlogPost.is_featured.desc(),
        BlogPost.published_at.desc().nullslast(),
        BlogPost.created_at.desc(),
    ).offset((page - 1) * per_page).limit(per_page)
    items = (await db.execute(q)).scalars().all()
    pages = (total + per_page - 1) // per_page if per_page else 1
    return BlogPostListResponse(
        total=total,
        page=page,
        per_page=per_page,
        pages=max(pages, 1),
        items=items,  # type: ignore[arg-type]
    )


@router.get("/{slug}", response_model=BlogPostResponse)
async def get_blog_post(slug: str, db: AsyncSession = Depends(get_db)) -> BlogPostResponse:
    post = (
        await db.execute(select(BlogPost).where(BlogPost.slug == slug))
    ).scalar_one_or_none()
    if not post or post.status != "published":
        raise HTTPException(status_code=404, detail="Blog post not found")
    return BlogPostResponse.model_validate(post)


# -- Admin CRUD -----------------------------------------------------------

admin_router = APIRouter(prefix="/admin/blog", tags=["admin-blog"])


@admin_router.get("", response_model=BlogPostListResponse)
async def admin_list_posts(
    page: int = Query(1, ge=1),
    per_page: int = Query(25, ge=1, le=100),
    status: str | None = None,
    search: str | None = None,
    _: None = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
) -> BlogPostListResponse:
    q = select(BlogPost)
    c = select(func.count(BlogPost.id))
    if status:
        q = q.where(BlogPost.status == status)
        c = c.where(BlogPost.status == status)
    if search:
        pattern = f"%{search}%"
        q = q.where(BlogPost.title.ilike(pattern))
        c = c.where(BlogPost.title.ilike(pattern))
    total = (await db.execute(c)).scalar() or 0
    q = q.order_by(BlogPost.created_at.desc()).offset((page - 1) * per_page).limit(per_page)
    items = (await db.execute(q)).scalars().all()
    pages = (total + per_page - 1) // per_page if per_page else 1
    return BlogPostListResponse(
        total=total,
        page=page,
        per_page=per_page,
        pages=max(pages, 1),
        items=items,  # type: ignore[arg-type]
    )


@admin_router.post("", response_model=BlogPostResponse)
async def admin_create_post(
    data: BlogPostCreate,
    _: None = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
) -> BlogPostResponse:
    base_slug = slugify(data.title, max_length=280) or "post"
    slug = await _unique_slug(db, base_slug)
    post = BlogPost(slug=slug, **data.model_dump())
    if post.status == "published" and post.published_at is None:
        post.published_at = datetime.now(timezone.utc)
    db.add(post)
    await db.flush()
    await db.refresh(post)
    return BlogPostResponse.model_validate(post)


@admin_router.get("/{post_id}", response_model=BlogPostResponse)
async def admin_get_post(
    post_id: int,
    _: None = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
) -> BlogPostResponse:
    post = (
        await db.execute(select(BlogPost).where(BlogPost.id == post_id))
    ).scalar_one_or_none()
    if not post:
        raise HTTPException(status_code=404, detail="Blog post not found")
    return BlogPostResponse.model_validate(post)


@admin_router.put("/{post_id}", response_model=BlogPostResponse)
async def admin_update_post(
    post_id: int,
    data: BlogPostUpdate,
    _: None = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
) -> BlogPostResponse:
    post = (
        await db.execute(select(BlogPost).where(BlogPost.id == post_id))
    ).scalar_one_or_none()
    if not post:
        raise HTTPException(status_code=404, detail="Blog post not found")
    updates = data.model_dump(exclude_unset=True)
    if "title" in updates and updates["title"] and updates["title"] != post.title:
        base_slug = slugify(updates["title"], max_length=280) or "post"
        post.slug = await _unique_slug(db, base_slug, exclude_id=post.id)
    for key, value in updates.items():
        setattr(post, key, value)
    if post.status == "published" and post.published_at is None:
        post.published_at = datetime.now(timezone.utc)
    await db.flush()
    await db.refresh(post)
    return BlogPostResponse.model_validate(post)


@admin_router.delete("/{post_id}")
async def admin_delete_post(
    post_id: int,
    _: None = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
) -> dict:
    post = (
        await db.execute(select(BlogPost).where(BlogPost.id == post_id))
    ).scalar_one_or_none()
    if not post:
        raise HTTPException(status_code=404, detail="Blog post not found")
    await db.delete(post)
    await db.flush()
    return {"status": "removed", "id": post_id}
