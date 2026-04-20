"use client";

import Link from "next/link";
import BlogForm from "@/components/BlogForm";

export default function NewBlogPostPage() {
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
          New <span className="text-[#E9283D]">Post.</span>
        </h1>
        <BlogForm mode="create" />
      </div>
    </div>
  );
}
