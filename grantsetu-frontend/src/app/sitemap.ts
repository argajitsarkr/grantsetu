import { MetadataRoute } from "next";

const SITE_URL = "https://grantsetu.in";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface GrantSitemapItem {
  slug: string;
  updated_at?: string;
}

async function getGrantSlugs(): Promise<GrantSitemapItem[]> {
  try {
    const res = await fetch(`${API_URL}/api/v1/grants?per_page=500&status=active`, {
      next: { revalidate: 3600 }, // Re-generate sitemap every hour
    });
    if (!res.ok) return [];
    const data = await res.json();
    return (data.items || []).map((g: { slug: string; updated_at?: string }) => ({
      slug: g.slug,
      updated_at: g.updated_at,
    }));
  } catch {
    return [];
  }
}

async function getBlogSlugs(): Promise<GrantSitemapItem[]> {
  try {
    const res = await fetch(`${API_URL}/api/v1/blog?per_page=500`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return (data.items || []).map((p: { slug: string; updated_at?: string }) => ({
      slug: p.slug,
      updated_at: p.updated_at,
    }));
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [grants, posts] = await Promise.all([getGrantSlugs(), getBlogSlugs()]);
  const now = new Date().toISOString();

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/grants`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.95,
    },
    {
      url: `${SITE_URL}/blog`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${SITE_URL}/newsletter`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/auth/signin`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.3,
    },
  ];

  // Dynamic grant pages
  const grantPages: MetadataRoute.Sitemap = grants.map((grant) => ({
    url: `${SITE_URL}/grants/${grant.slug}`,
    lastModified: grant.updated_at || now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const blogPages: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${SITE_URL}/blog/${p.slug}`,
    lastModified: p.updated_at || now,
    changeFrequency: "weekly" as const,
    priority: 0.75,
  }));

  return [...staticPages, ...grantPages, ...blogPages];
}
