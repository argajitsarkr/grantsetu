"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { API_URL } from "@/lib/constants";
import type { BlogPostListItem, PaginatedResponse } from "@/types";

const STATUSES = ["", "draft", "published"];

export default function AdminBlogListPage() {
  const { data: session } = useSession();
  const [data, setData] = useState<PaginatedResponse<BlogPostListItem> | null>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const token = session?.backendToken;
    if (!token) return;
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), per_page: "25" });
    if (status) params.set("status", status);
    if (search) params.set("search", search);
    fetch(`${API_URL}/api/v1/admin/blog?${params.toString()}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => setData(d))
      .finally(() => setLoading(false));
  }, [session, status, search, page]);

  async function handleDelete(id: number, title: string) {
    if (!session?.backendToken) return;
    if (!confirm(`Delete post "${title}"? This cannot be undone.`)) return;
    const res = await fetch(`${API_URL}/api/v1/admin/blog/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${session.backendToken}` },
    });
    if (res.ok) {
      setData((d) => (d ? { ...d, items: d.items.filter((p) => p.id !== id) } : d));
    } else {
      alert("Delete failed.");
    }
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8 py-10">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
          <div>
            <Link
              href="/admin"
              className="text-[11px] uppercase tracking-[0.15em] text-gray-500 hover:text-[#E9283D] font-bold"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              ← Back to admin
            </Link>
            <h1
              className="mt-2 text-[2rem] sm:text-[2.5rem] font-black text-black leading-[1]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Blog <span className="text-[#E9283D]">Posts.</span>
            </h1>
          </div>
          <Link
            href="/admin/blog/new"
            className="inline-flex items-center justify-center h-[44px] px-6 bg-[#E9283D] text-white text-[13px] font-bold rounded-lg hover:bg-[#C91E30] uppercase tracking-wider transition-colors"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            + New Post
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          <input
            type="text"
            placeholder="Search by title…"
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
            className="sm:col-span-2 h-[44px] px-4 border-2 border-black rounded-lg text-[14px] focus:outline-none focus:border-[#E9283D]"
          />
          <select
            value={status}
            onChange={(e) => {
              setPage(1);
              setStatus(e.target.value);
            }}
            className="h-[44px] px-4 border-2 border-black rounded-lg text-[14px] font-semibold uppercase focus:outline-none focus:border-[#E9283D]"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s ? s : "All statuses"}
              </option>
            ))}
          </select>
        </div>

        <section className="border-2 border-black rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  {["Title", "Status", "Category", "Updated", ""].map((h) => (
                    <th
                      key={h}
                      className="px-5 py-3 text-left text-[11px] uppercase tracking-wider text-gray-500 font-bold"
                      style={{ fontFamily: "var(--font-mono)" }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading && (
                  <tr>
                    <td colSpan={5} className="px-5 py-8 text-center text-gray-400 text-sm">
                      Loading…
                    </td>
                  </tr>
                )}
                {!loading && data && data.items.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-5 py-10 text-center text-gray-400 text-sm">
                      No posts yet.
                    </td>
                  </tr>
                )}
                {data?.items.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="px-5 py-3 font-bold text-black">
                      <div className="flex items-center gap-2">
                        {p.is_featured && (
                          <span
                            className="text-[9px] bg-[#E9283D] text-white px-1.5 py-0.5 rounded uppercase tracking-wider"
                            style={{ fontFamily: "var(--font-mono)" }}
                          >
                            ★
                          </span>
                        )}
                        <span className="line-clamp-1">{p.title}</span>
                      </div>
                      <div className="text-[11px] text-gray-500 mt-0.5">/blog/{p.slug}</div>
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${
                          p.status === "published"
                            ? "bg-black text-white border-black"
                            : "bg-white text-black border-black"
                        }`}
                        style={{ fontFamily: "var(--font-mono)" }}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-gray-700 text-[13px]">{p.category || "-"}</td>
                    <td className="px-5 py-3 text-gray-600 text-[13px]">
                      {new Date(p.updated_at).toLocaleDateString("en-IN")}
                    </td>
                    <td className="px-5 py-3 text-right whitespace-nowrap">
                      {p.status === "published" && (
                        <Link
                          href={`/blog/${p.slug}`}
                          target="_blank"
                          className="text-[12px] text-gray-600 hover:text-[#E9283D] font-bold uppercase tracking-wider mr-3"
                          style={{ fontFamily: "var(--font-mono)" }}
                        >
                          View
                        </Link>
                      )}
                      <Link
                        href={`/admin/blog/${p.id}/edit`}
                        className="text-[12px] text-black hover:text-[#E9283D] font-bold uppercase tracking-wider mr-3"
                        style={{ fontFamily: "var(--font-mono)" }}
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(p.id, p.title)}
                        className="text-[12px] text-[#E9283D] hover:underline font-bold uppercase tracking-wider"
                        style={{ fontFamily: "var(--font-mono)" }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {data && data.pages > 1 && (
          <div className="mt-6 flex items-center justify-between">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              className="h-[40px] px-4 border-2 border-black rounded-lg text-[12px] font-bold uppercase tracking-wider disabled:opacity-40"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              ← Prev
            </button>
            <span className="text-[12px] text-gray-500" style={{ fontFamily: "var(--font-mono)" }}>
              Page {data.page} / {data.pages}
            </span>
            <button
              disabled={page >= data.pages}
              onClick={() => setPage((p) => p + 1)}
              className="h-[40px] px-4 border-2 border-black rounded-lg text-[12px] font-bold uppercase tracking-wider disabled:opacity-40"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
