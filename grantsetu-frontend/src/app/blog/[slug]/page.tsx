import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { API_URL } from "@/lib/constants";
import type { BlogPost } from "@/types";

export const dynamic = "force-dynamic";

async function fetchPost(slug: string): Promise<BlogPost | null> {
  try {
    const res = await fetch(`${API_URL}/api/v1/blog/${slug}`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await fetchPost(slug);
  if (!post) return { title: "Post not found - GrantSetu" };
  const url = `https://grantsetu.in/blog/${post.slug}`;
  return {
    title: `${post.title} - GrantSetu Blog`,
    description: post.excerpt || post.title,
    alternates: { canonical: url },
    openGraph: {
      title: post.title,
      description: post.excerpt || post.title,
      url,
      type: "article",
      images: post.cover_image_url ? [{ url: post.cover_image_url }] : undefined,
      publishedTime: post.published_at || post.created_at,
      modifiedTime: post.updated_at,
      authors: [post.author_name],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt || post.title,
      images: post.cover_image_url ? [post.cover_image_url] : undefined,
    },
  };
}

function formatDate(iso: string | null): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await fetchPost(slug);
  if (!post) notFound();

  const url = `https://grantsetu.in/blog/${post.slug}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt || post.title,
    image: post.cover_image_url ? [post.cover_image_url] : undefined,
    datePublished: post.published_at || post.created_at,
    dateModified: post.updated_at,
    author: { "@type": "Organization", name: post.author_name },
    publisher: {
      "@type": "Organization",
      name: "GrantSetu",
      logo: {
        "@type": "ImageObject",
        url: "https://grantsetu.in/grantsetu-logo.png",
      },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
  };

  return (
    <div className="bg-white min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="max-w-[860px] mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-24">
        <Link
          href="/blog"
          className="text-[11px] uppercase tracking-[0.15em] text-gray-500 hover:text-[#E9283D] font-bold"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          ← All posts
        </Link>

        <div className="mt-6 flex gap-2 flex-wrap">
          {post.category && (
            <span
              className="text-[10px] uppercase tracking-wider font-bold bg-[#E9283D] text-white px-2 py-1 rounded"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              {post.category}
            </span>
          )}
          {post.tags?.map((t) => (
            <span
              key={t}
              className="text-[10px] uppercase tracking-wider font-bold bg-black text-white px-2 py-1 rounded"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              {t}
            </span>
          ))}
        </div>

        <h1
          className="mt-5 text-[2rem] sm:text-[3rem] lg:text-[3.5rem] font-black text-black leading-[1.05]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {post.title}
        </h1>

        {post.excerpt && (
          <p className="mt-5 text-[17px] sm:text-[19px] text-gray-700 leading-[1.55]">
            {post.excerpt}
          </p>
        )}

        <div
          className="mt-6 flex items-center gap-3 text-[11px] uppercase tracking-wider text-gray-500"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          <span>{post.author_name}</span>
          <span>·</span>
          <span>{formatDate(post.published_at || post.created_at)}</span>
          {post.read_minutes && (
            <>
              <span>·</span>
              <span>{post.read_minutes} min read</span>
            </>
          )}
        </div>

        {post.cover_image_url && (
          <div className="mt-8 relative aspect-[16/9] border-2 border-black rounded-2xl overflow-hidden bg-[#E9283D]/10">
            <Image
              src={post.cover_image_url}
              alt={post.title}
              fill
              unoptimized
              priority
              className="object-cover"
            />
          </div>
        )}

        <div className="blog-prose mt-10">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {post.body_markdown}
          </ReactMarkdown>
        </div>

        <div className="mt-16 border-t-2 border-black pt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <Link
            href="/blog"
            className="text-[13px] uppercase tracking-wider font-bold text-black hover:text-[#E9283D]"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            ← More from the GrantSetu Blog
          </Link>
          <Link
            href="/grants"
            className="inline-flex items-center justify-center h-[44px] px-6 bg-[#E9283D] text-white text-[13px] font-bold rounded-lg hover:bg-[#C91E30] uppercase tracking-wider transition-colors"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            Browse Grants →
          </Link>
        </div>
      </article>
    </div>
  );
}
