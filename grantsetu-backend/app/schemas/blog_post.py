"""Pydantic schemas for blog post API."""

from datetime import datetime

from pydantic import BaseModel


class BlogPostBase(BaseModel):
    title: str
    excerpt: str | None = None
    cover_image_url: str | None = None
    body_markdown: str
    author_name: str = "GrantSetu Team"
    category: str | None = None
    tags: list[str] = []
    status: str = "draft"
    is_featured: bool = False
    read_minutes: int | None = None


class BlogPostCreate(BlogPostBase):
    pass


class BlogPostUpdate(BaseModel):
    title: str | None = None
    excerpt: str | None = None
    cover_image_url: str | None = None
    body_markdown: str | None = None
    author_name: str | None = None
    category: str | None = None
    tags: list[str] | None = None
    status: str | None = None
    is_featured: bool | None = None
    read_minutes: int | None = None


class BlogPostResponse(BlogPostBase):
    id: int
    slug: str
    published_at: datetime | None = None
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class BlogPostListItem(BaseModel):
    id: int
    slug: str
    title: str
    excerpt: str | None = None
    cover_image_url: str | None = None
    author_name: str
    category: str | None = None
    tags: list[str] = []
    status: str
    is_featured: bool
    read_minutes: int | None = None
    published_at: datetime | None = None
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class BlogPostListResponse(BaseModel):
    total: int
    page: int
    per_page: int
    pages: int
    items: list[BlogPostListItem]
