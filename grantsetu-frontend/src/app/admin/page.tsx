"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { API_URL } from "@/lib/constants";

interface Stats {
  grants_total: number;
  grants_active: number;
  users_total: number;
  alerts_enabled: number;
}

interface ScraperRun {
  id: number;
  agency: string;
  started_at: string | null;
  status: string;
  grants_found: number;
  grants_new: number;
  error_message: string | null;
}

export default function AdminDashboard() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<Stats | null>(null);
  const [runs, setRuns] = useState<ScraperRun[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = session?.backendToken;
    if (!token) return;
    (async () => {
      try {
        const [sRes, rRes] = await Promise.all([
          fetch(`${API_URL}/api/v1/admin/stats`, {
            headers: { Authorization: `Bearer ${token}` },
            cache: "no-store",
          }),
          fetch(`${API_URL}/api/v1/admin/scrapers/health`, {
            headers: { Authorization: `Bearer ${token}` },
            cache: "no-store",
          }),
        ]);
        if (sRes.ok) setStats(await sRes.json());
        if (rRes.ok) setRuns(await rRes.json());
      } catch (err) {
        console.error("Admin stats load failed:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [session]);

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8 py-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-8">
          <div>
            <span
              className="inline-block text-[10px] uppercase tracking-[0.2em] text-[#E9283D] font-bold mb-2"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              Admin · Control Room
            </span>
            <h1
              className="text-[2.25rem] sm:text-[3rem] font-black text-black leading-[1]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              GrantSetu <span className="text-[#E9283D]">Admin.</span>
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Grants, users, scraper health - all in one place.
            </p>
          </div>
          <Link
            href="/admin/grants/new"
            className="inline-flex items-center justify-center h-[44px] px-6 bg-[#E9283D] text-white text-[13px] font-bold rounded-lg hover:bg-[#C91E30] uppercase tracking-wider transition-colors"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            + Add Grant
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-10">
          <StatTile label="Total Grants" value={stats?.grants_total ?? "-"} />
          <StatTile label="Active Grants" value={stats?.grants_active ?? "-"} accent />
          <StatTile label="Total Users" value={stats?.users_total ?? "-"} />
          <StatTile label="Alert Subs" value={stats?.alerts_enabled ?? "-"} />
        </div>

        {/* Action tiles */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <ActionTile
            href="/admin/grants/new"
            title="Add Grant"
            desc="Manually enter a new grant using the template form."
            cta="Open form →"
            primary
          />
          <ActionTile
            href="/admin/grants"
            title="Manage Grants"
            desc="Browse, edit, or expire existing grants."
            cta="Open list →"
          />
          <ActionTile
            href="/admin/blog"
            title="Blog Posts"
            desc="Write and publish guides, deep-dives, and weekly roundups."
            cta="Open editor →"
          />
          <ActionTile
            href="/admin/users"
            title="Users"
            desc="See who's signed up, their profile fields, admin status."
            cta="Open list →"
          />
        </div>

        {/* Scraper health */}
        <section className="border-2 border-black rounded-xl overflow-hidden">
          <div className="px-5 py-3 border-b-2 border-black flex items-center justify-between">
            <h2
              className="text-[11px] uppercase tracking-[0.2em] font-bold text-black"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              Recent Scraper Runs
            </h2>
            <span
              className="text-[11px] uppercase tracking-wider text-gray-500"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              Last 20
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  {["Agency", "Started", "Status", "Found", "New", "Error"].map((h) => (
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
                    <td colSpan={6} className="px-5 py-8 text-center text-gray-400 text-sm">
                      Loading…
                    </td>
                  </tr>
                )}
                {!loading && runs.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-5 py-10 text-center text-gray-400 text-sm">
                      No scraper runs yet.
                    </td>
                  </tr>
                )}
                {runs.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50">
                    <td className="px-5 py-3 font-bold text-black">{r.agency}</td>
                    <td className="px-5 py-3 text-gray-600 text-[13px]">
                      {r.started_at ? new Date(r.started_at).toLocaleString("en-IN") : "-"}
                    </td>
                    <td className="px-5 py-3">
                      <StatusPill status={r.status} />
                    </td>
                    <td className="px-5 py-3 text-gray-700">{r.grants_found}</td>
                    <td className="px-5 py-3 text-gray-700">{r.grants_new}</td>
                    <td className="px-5 py-3 text-[#E9283D] text-xs max-w-[220px] truncate">
                      {r.error_message || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}

function StatTile({
  label,
  value,
  accent,
}: {
  label: string;
  value: number | string;
  accent?: boolean;
}) {
  const cls = accent ? "bg-black text-white border-black" : "bg-white text-black border-black";
  return (
    <div className={`${cls} border-2 rounded-xl p-4`}>
      <div
        className="text-[10px] uppercase tracking-[0.15em] opacity-80 mb-1"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        {label}
      </div>
      <div
        className="text-[2rem] font-black leading-none"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {value}
      </div>
    </div>
  );
}

function ActionTile({
  href,
  title,
  desc,
  cta,
  primary,
}: {
  href: string;
  title: string;
  desc: string;
  cta: string;
  primary?: boolean;
}) {
  const cls = primary
    ? "bg-[#E9283D] text-white border-[#E9283D]"
    : "bg-white text-black border-black";
  return (
    <Link
      href={href}
      className={`${cls} border-2 rounded-xl p-5 block hover:opacity-90 transition-opacity`}
    >
      <h3
        className="text-[1.25rem] font-black mb-1"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {title}
      </h3>
      <p className="text-[13px] opacity-80 mb-3 leading-snug">{desc}</p>
      <span
        className="text-[11px] uppercase tracking-[0.15em] font-bold"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        {cta}
      </span>
    </Link>
  );
}

function StatusPill({ status }: { status: string }) {
  const cls =
    status === "success"
      ? "bg-black text-white border-black"
      : status === "failed"
      ? "bg-[#E9283D] text-white border-[#E9283D]"
      : "bg-white text-black border-black";
  return (
    <span
      className={`${cls} inline-flex px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border`}
      style={{ fontFamily: "var(--font-mono)" }}
    >
      {status}
    </span>
  );
}
