"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import BlogForm from "@/components/BlogForm";
import { API_URL } from "@/lib/constants";
import type { BlogPost } from "@/types";

export default function EditBlogPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: session } = useSession();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = session?.backendToken;
    if (!token) return;
    fetch(`${API_URL}/api/v1/admin/blog/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => setPost(d))
      .finally(() => setLoading(false));
  }, [session, id]);

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8 py-10">
        <Link
          href="/admin/blog"
          className="text-[11px] uppercase tracking-[0.15em] text-gray-500 hover:text-[#E9283D] font-bold"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          ← All posts
        </Link>
        <h1
          className="mt-2 mb-8 text-[2rem] sm:text-[2.5rem] font-black text-black leading-[1]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Edit <span className="text-[#E9283D]">Post.</span>
        </h1>
        {loading && <p className="text-gray-500">Loading…</p>}
        {!loading && !post && <p className="text-[#E9283D]">Post not found.</p>}
        {!loading && post && (
          <BlogForm mode="edit" postId={post.id} initial={post} />
        )}
      </div>
    </div>
  );
}
