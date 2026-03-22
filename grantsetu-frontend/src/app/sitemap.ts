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

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const grants = await getGrantSlugs();
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
      url: `${SITE_URL}/alerts`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
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

  return [...staticPages, ...grantPages];
}
