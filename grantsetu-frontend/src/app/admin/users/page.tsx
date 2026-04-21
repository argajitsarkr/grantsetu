"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { API_URL } from "@/lib/constants";

interface AdminUser {
  id: number;
  email: string;
  name: string;
  institution: string | null;
  career_stage: string | null;
  is_admin: boolean;
  onboarding_completed: boolean;
  auth_provider: string | null;
  created_at: string | null;
}

interface UsersResponse {
  total: number;
  page: number;
  per_page: number;
  items: AdminUser[];
}

export default function AdminUsersPage() {
  const { data: session } = useSession();
  const [data, setData] = useState<UsersResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const token = session?.backendToken;
    if (!token) return;
    setLoading(true);
    fetch(`${API_URL}/api/v1/admin/users?page=${page}&per_page=50`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    })
      .then((r) => (r.ok ? r.json() : Promise.reject(r.statusText)))
      .then((d) => setData(d as UsersResponse))
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, [session, page]);

  const pages = data ? Math.max(1, Math.ceil(data.total / data.per_page)) : 1;

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8 py-10">
        <Link
          href="/admin"
          className="text-[11px] uppercase tracking-[0.15em] text-gray-500 hover:text-[#E9283D] font-bold"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          ← Back to admin
        </Link>
        <h1
          className="mt-2 text-[2rem] sm:text-[2.5rem] font-black text-black leading-[1.05] mb-6"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Users <span className="text-[#E9283D]">({data?.total ?? "…"}).</span>
        </h1>

        <div className="border-2 border-black rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  {["Email", "Name", "Institution", "Stage", "Provider", "Admin", "Onboarded", "Joined"].map(
                    (h) => (
                      <th
                        key={h}
                        className="px-4 py-3 text-left text-[11px] uppercase tracking-wider text-gray-500 font-bold"
                        style={{ fontFamily: "var(--font-mono)" }}
                      >
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading && (
                  <tr>
                    <td colSpan={8} className="px-4 py-10 text-center text-gray-400">
                      Loading…
                    </td>
                  </tr>
                )}
                {!loading && data?.items.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-4 py-10 text-center text-gray-400">
                      No users yet.
                    </td>
                  </tr>
                )}
                {data?.items.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50">
                    <td
                      className="px-4 py-3 text-[13px] font-bold text-black"
                      style={{ fontFamily: "var(--font-mono)" }}
                    >
                      {u.email}
                    </td>
                    <td className="px-4 py-3 text-[13px] text-black">{u.name}</td>
                    <td className="px-4 py-3 text-[12px] text-gray-600 max-w-[220px] truncate">
                      {u.institution || "-"}
                    </td>
                    <td
                      className="px-4 py-3 text-[11px] uppercase tracking-wider text-gray-500"
                      style={{ fontFamily: "var(--font-mono)" }}
                    >
                      {u.career_stage || "-"}
                    </td>
                    <td
                      className="px-4 py-3 text-[11px] uppercase tracking-wider text-gray-500"
                      style={{ fontFamily: "var(--font-mono)" }}
                    >
                      {u.auth_provider || "-"}
                    </td>
                    <td className="px-4 py-3">
                      {u.is_admin ? (
                        <span
                          className="bg-[#E9283D] text-white px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider"
                          style={{ fontFamily: "var(--font-mono)" }}
                        >
                          Admin
                        </span>
                      ) : (
                        <span className="text-gray-400 text-[11px]">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-[11px]">
                      {u.onboarding_completed ? (
                        <span className="text-black font-bold">✓</span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td
                      className="px-4 py-3 text-[11px] uppercase text-gray-500"
                      style={{ fontFamily: "var(--font-mono)" }}
                    >
                      {u.created_at
                        ? new Date(u.created_at).toLocaleDateString("en-IN", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {data && pages > 1 && (
          <div className="flex items-center justify-between mt-5">
            <span
              className="text-[11px] uppercase tracking-wider text-gray-500"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              Page {data.page} of {pages} · {data.total} users
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
                disabled={page >= pages}
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
