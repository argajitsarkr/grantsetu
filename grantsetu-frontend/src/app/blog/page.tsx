import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { API_URL } from "@/lib/constants";
import type { BlogPostListItem } from "@/types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Blog - GrantSetu",
  description:
    "Guides, deep-dives, and weekly roundups on Indian life-sciences and biotechnology research funding. DBT, BIRAC, ICMR insights from the GrantSetu team.",
  alternates: { canonical: "https://grantsetu.in/blog" },
  openGraph: {
    title: "GrantSetu Blog - Life Sciences & Biotech Research Funding in India",
    description:
      "Guides, deep-dives, and weekly roundups on Indian life-sciences and biotechnology research funding.",
    url: "https://grantsetu.in/blog",
  },
};

async function fetchPosts(): Promise<{ items: BlogPostListItem[] }> {
  try {
    const res = await fetch(`${API_URL}/api/v1/blog?per_page=50`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return { items: [] };
    return await res.json();
  } catch {
    return { items: [] };
  }
}

function formatDate(iso: string | null): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function BlogIndexPage() {
  const { items } = await fetchPosts();
  const featured = items.find((p) => p.is_featured) || items[0];
  const rest = items.filter((p) => !featured || p.id !== featured.id);

  return (
    <div className="bg-white min-h-screen">
      <section className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-8">
        <span className="label-pill">Blog</span>
        <h1
          className="heading-display mt-5 text-[2.25rem] sm:text-[3.5rem] lg:text-[4.5rem] text-black leading-[1.02]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Grant craft, <span className="text-[#E9283D]">unpacked.</span>
        </h1>
        <p className="mt-5 text-[16px] sm:text-[18px] text-gray-600 max-w-[720px]">
          Guides, deep-dives, and weekly roundups on Indian life-sciences and biotechnology research funding.
        </p>
      </section>

      {items.length === 0 ? (
        <section className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 pb-24">
          <div className="border-2 border-black rounded-2xl p-10 text-center">
            <p className="text-[16px] text-gray-600">
              No posts yet. Check back soon - the first deep-dive drops this month.
            </p>
          </div>
        </section>
      ) : (
        <>
          {featured && (
            <section className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 pb-12">
              <Link
                href={`/blog/${featured.slug}`}
                className="group block border-2 border-black rounded-2xl overflow-hidden hover:shadow-[8px_8px_0_0_#E9283D] transition-shadow"
              >
                <div className="grid md:grid-cols-2">
                  <div className="relative bg-[#E9283D]/10 aspect-[16/10] md:aspect-auto">
                    {featured.cover_image_url ? (
                      <Image
                        src={featured.cover_image_url}
                        alt={featured.title}
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span
                          className="text-[#E9283D] text-[5rem] font-black"
                          style={{ fontFamily: "var(--font-display)" }}
                        >
                          GS
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-8 sm:p-10">
                    <div className="flex gap-2 flex-wrap">
                      {featured.category && (
                        <span
                          className="text-[10px] uppercase tracking-wider font-bold bg-[#E9283D] text-white px-2 py-1 rounded"
                          style={{ fontFamily: "var(--font-mono)" }}
                        >
                          {featured.category}
                        </span>
                      )}
                      <span
                        className="text-[10px] uppercase tracking-wider font-bold bg-black text-white px-2 py-1 rounded"
                        style={{ fontFamily: "var(--font-mono)" }}
                      >
                        Featured
                      </span>
                    </div>
                    <h2
                      className="mt-4 text-[1.75rem] sm:text-[2.25rem] font-black text-black leading-[1.1] group-hover:text-[#E9283D] transition-colors"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {featured.title}
                    </h2>
                    {featured.excerpt && (
                      <p className="mt-3 text-[15px] text-gray-600 line-clamp-3">
                        {featured.excerpt}
                      </p>
                    )}
                    <div
                      className="mt-5 flex items-center gap-3 text-[11px] uppercase tracking-wider text-gray-500"
                      style={{ fontFamily: "var(--font-mono)" }}
                    >
                      <span>{featured.author_name}</span>
                      <span>·</span>
                      <span>{formatDate(featured.published_at || featured.created_at)}</span>
                      {featured.read_minutes && (
                        <>
                          <span>·</span>
                          <span>{featured.read_minutes} min read</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            </section>
          )}

          {rest.length > 0 && (
            <section className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 pb-24">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {rest.map((post) => (
                  <Link
                    key={post.id}
                    href={`/blog/${post.slug}`}
                    className="group border-2 border-black rounded-xl overflow-hidden hover:shadow-[6px_6px_0_0_#E9283D] transition-shadow"
                  >
                    <div className="relative aspect-[16/10] bg-[#E9283D]/10">
                      {post.cover_image_url ? (
                        <Image
                          src={post.cover_image_url}
                          alt={post.title}
                          fill
                          unoptimized
                          className="object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span
                            className="text-[#E9283D] text-[3rem] font-black"
                            style={{ fontFamily: "var(--font-display)" }}
                          >
                            GS
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      {post.category && (
                        <span
                          className="text-[10px] uppercase tracking-wider font-bold bg-[#E9283D] text-white px-2 py-1 rounded inline-block"
                          style={{ fontFamily: "var(--font-mono)" }}
                        >
                          {post.category}
                        </span>
                      )}
                      <h3
                        className="mt-3 text-[1.15rem] font-black text-black leading-[1.2] group-hover:text-[#E9283D] transition-colors line-clamp-3"
                        style={{ fontFamily: "var(--font-display)" }}
                      >
                        {post.title}
                      </h3>
                      {post.excerpt && (
                        <p className="mt-2 text-[13px] text-gray-600 line-clamp-2">
                          {post.excerpt}
                        </p>
                      )}
                      <div
                        className="mt-4 flex items-center gap-2 text-[10px] uppercase tracking-wider text-gray-500"
                        style={{ fontFamily: "var(--font-mono)" }}
                      >
                        <span>{formatDate(post.published_at || post.created_at)}</span>
                        {post.read_minutes && (
                          <>
                            <span>·</span>
                            <span>{post.read_minutes} min</span>
                          </>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
