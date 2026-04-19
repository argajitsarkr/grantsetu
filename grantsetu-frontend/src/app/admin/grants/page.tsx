"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { fetchGrants } from "@/lib/api";
import { API_URL, AGENCIES, formatDate } from "@/lib/constants";
import type { GrantListItem, PaginatedResponse } from "@/types";

const STATUSES = ["", "active", "draft", "expired"];

export default function AdminGrantsListPage() {
  const { data: session } = useSession();
  const [data, setData] = useState<PaginatedResponse<GrantListItem> | null>(null);
  const [loading, setLoading] = useState(true);
  const [agency, setAgency] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    setLoading(true);
    fetchGrants({
      agency: agency ? [agency] : undefined,
      status: status || undefined,
      search: search || undefined,
      page,
      per_page: 25,
      sort: "newest",
    })
      .then((d) => setData(d))
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, [agency, status, search, page]);

  async function handleExpire(id: number, title: string) {
    if (!session?.backendToken) return;
    if (!confirm(`Expire grant "${title}"? This sets status to expired.`)) return;
    const res = await fetch(`${API_URL}/api/v1/admin/grants/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${session.backendToken}` },
    });
    if (res.ok) {
      setData((d) =>
        d ? { ...d, items: d.items.filter((g) => g.id !== id) } : d
      );
    } else {
      alert("Expire failed.");
    }
  }

  async function handleHardDelete(id: number, title: string) {
    if (!session?.backendToken) return;
    if (!confirm(`Permanently DELETE "${title}"? This removes the row and cannot be undone.`)) return;
    const res = await fetch(`${API_URL}/api/v1/admin/grants/${id}?hard=true`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${session.backendToken}` },
    });
    if (res.ok) {
      setData((d) =>
        d ? { ...d, items: d.items.filter((g) => g.id !== id) } : d
      );
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
              className="mt-2 text-[2rem] sm:text-[2.5rem] font-black text-black leading-[1.05]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Manage <span className="text-[#E9283D]">Grants.</span>
            </h1>
          </div>
          <Link
            href="/admin/grants/new"
            className="inline-flex items-center justify-center h-[44px] px-6 bg-[#E9283D] text-white text-[13px] font-bold rounded-lg hover:bg-[#C91E30] uppercase tracking-wider transition-colors"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            + Add Grant
          </Link>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-5">
          <input
            placeholder="Search title…"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="border-2 border-black rounded-lg px-3 py-2 text-[14px] min-w-[200px]"
          />
          <select
            value={agency}
            onChange={(e) => {
              setAgency(e.target.value);
              setPage(1);
            }}
            className="border-2 border-black rounded-lg px-3 py-2 text-[14px]"
          >
            <option value="">All agencies</option>
            {AGENCIES.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
            className="border-2 border-black rounded-lg px-3 py-2 text-[14px]"
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s || "All statuses"}
              </option>
            ))}
          </select>
        </div>

        <div className="border-2 border-black rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  {["Title", "Agency", "Deadline", "Status", "Source", "Actions"].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left text-[11px] uppercase tracking-wider text-gray-500 font-bold"
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
                    <td colSpan={6} className="px-4 py-10 text-center text-gray-400">
                      Loading…
                    </td>
                  </tr>
                )}
                {!loading && data?.items.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-10 text-center text-gray-400">
                      No grants match those filters.
                    </td>
                  </tr>
                )}
                {data?.items.map((g) => (
                  <tr key={g.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 max-w-[420px]">
                      <Link
                        href={`/grants/${g.slug}`}
                        target="_blank"
                        className="font-bold text-black hover:text-[#E9283D] line-clamp-2"
                      >
                        {g.title}
                      </Link>
                    </td>
                    <td
                      className="px-4 py-3 font-bold text-[#E9283D] text-[12px] uppercase"
                      style={{ fontFamily: "var(--font-mono)" }}
                    >
                      {g.agency}
                    </td>
                    <td
                      className="px-4 py-3 text-gray-600 text-[12px]"
                      style={{ fontFamily: "var(--font-mono)" }}
                    >
                      {g.deadline ? formatDate(g.deadline) : g.deadline_text || "-"}
                    </td>
                    <td className="px-4 py-3">
                      <StatusPill status={g.status} />
                    </td>
                    <td
                      className="px-4 py-3 text-[11px] uppercase text-gray-500"
                      style={{ fontFamily: "var(--font-mono)" }}
                    >
                      {g.slug.split("-")[0]}
                    </td>
                    <td className="px-4 py-3 flex gap-3">
                      <Link
                        href={`/admin/grants/${g.id}/edit`}
                        className="text-[11px] uppercase tracking-wider font-bold text-black hover:text-[#E9283D]"
                        style={{ fontFamily: "var(--font-mono)" }}
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleExpire(g.id, g.title)}
                        className="text-[11px] uppercase tracking-wider font-bold text-black hover:text-[#E9283D]"
                        style={{ fontFamily: "var(--font-mono)" }}
                      >
                        Expire
                      </button>
                      <button
                        onClick={() => handleHardDelete(g.id, g.title)}
                        className="text-[11px] uppercase tracking-wider font-bold text-[#E9283D] hover:underline"
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
        </div>

        {data && data.pages > 1 && (
          <div className="flex items-center justify-between mt-5">
            <span
              className="text-[11px] uppercase tracking-wider text-gray-500"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              Page {data.page} of {data.pages} · {data.total} total
            </span>
            <div className="flex gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="border-2 border-black px-4 py-2 rounded-lg text-[12px] font-bold uppercase tracking-wider disabled:opacity-40 hover:bg-black hover:text-white transition-colors"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                ← Prev
              </button>
              <button
                disabled={page >= data.pages}
                onClick={() => setPage((p) => p + 1)}
                className="border-2 border-black px-4 py-2 rounded-lg text-[12px] font-bold uppercase tracking-wider disabled:opacity-40 hover:bg-black hover:text-white transition-colors"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const cls =
    status === "active"
      ? "bg-black text-white border-black"
      : status === "draft"
      ? "bg-white text-black border-black"
      : "bg-[#E9283D] text-white border-[#E9283D]";
  return (
    <span
      className={`${cls} inline-flex px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border`}
      style={{ fontFamily: "var(--font-mono)" }}
    >
      {status}
    </span>
  );
}
