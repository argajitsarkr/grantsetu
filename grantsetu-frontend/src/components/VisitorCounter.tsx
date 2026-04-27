"use client";

import { useEffect, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const SESSION_KEY = "gs_visit_counted";

export default function VisitorCounter() {
  const [stats, setStats] = useState<{ total: number; unique: number } | null>(null);

  useEffect(() => {
    let cancelled = false;
    const alreadyCounted = sessionStorage.getItem(SESSION_KEY) === "1";
    const path = alreadyCounted ? "/api/v1/stats/visits" : "/api/v1/stats/visit";
    const method = alreadyCounted ? "GET" : "POST";

    fetch(`${API_URL}${path}`, { method })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!cancelled && data) {
          setStats({ total: data.total ?? 0, unique: data.unique ?? 0 });
          if (!alreadyCounted) sessionStorage.setItem(SESSION_KEY, "1");
        }
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, []);

  if (!stats) return null;

  return (
    <div
      className="inline-flex items-center gap-3 px-3 py-1.5 border border-white/15 rounded-full bg-white/5"
      style={{ fontFamily: "var(--font-mono)" }}
    >
      <span className="flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-[#E9283D] animate-pulse" />
        <span className="text-[10px] uppercase tracking-wider text-white/60">Live</span>
      </span>
      <span className="text-[11px] text-white/80">
        <span className="text-white font-semibold">{stats.unique.toLocaleString("en-IN")}</span>
        <span className="text-white/50"> visitors</span>
      </span>
      <span className="text-white/20">·</span>
      <span className="text-[11px] text-white/80">
        <span className="text-white font-semibold">{stats.total.toLocaleString("en-IN")}</span>
        <span className="text-white/50"> views</span>
      </span>
    </div>
  );
}
