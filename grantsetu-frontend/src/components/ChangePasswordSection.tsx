"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { API_URL } from "@/lib/constants";

export default function ChangePasswordSection() {
  const { data: session } = useSession();
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const token = session?.backendToken;
  if (!token) return null;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    if (next.length < 8) return setMsg({ kind: "err", text: "New password must be at least 8 characters." });
    if (next !== confirm) return setMsg({ kind: "err", text: "New passwords don't match." });
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/v1/auth/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ current_password: current, new_password: next }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setMsg({
          kind: "err",
          text: data.detail || "Could not change password. Try again.",
        });
      } else {
        setMsg({ kind: "ok", text: "Password updated." });
        setCurrent("");
        setNext("");
        setConfirm("");
      }
    } catch {
      setMsg({ kind: "err", text: "Network error. Try again." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="bg-white border border-brand-200 rounded-2xl p-6 shadow-card">
      <h2
        className="text-lg font-semibold text-[#0A0A0A] mb-1"
        style={{ fontFamily: "var(--font-display)" }}
      >
        Change Password
      </h2>
      <p className="text-brand-500 text-xs mb-4">
        Google sign-in users should manage their password at myaccount.google.com.
      </p>
      <form onSubmit={onSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-brand-700 mb-1">Current password</label>
          <input
            type="password"
            autoComplete="current-password"
            value={current}
            onChange={(e) => setCurrent(e.target.value)}
            className="w-full border border-brand-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent-500/40 focus:border-accent-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-brand-700 mb-1">New password</label>
          <input
            type="password"
            autoComplete="new-password"
            value={next}
            onChange={(e) => setNext(e.target.value)}
            className="w-full border border-brand-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent-500/40 focus:border-accent-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-brand-700 mb-1">Confirm new password</label>
          <input
            type="password"
            autoComplete="new-password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="w-full border border-brand-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent-500/40 focus:border-accent-500"
          />
        </div>
        <div className="sm:col-span-2 flex items-center justify-between gap-3">
          {msg ? (
            <p className={`text-[13px] ${msg.kind === "ok" ? "text-green-700" : "text-[#E9283D]"}`}>
              {msg.text}
            </p>
          ) : <span />}
          <button
            type="submit"
            disabled={loading || !current || !next}
            className="h-[40px] px-5 bg-[#E9283D] text-white text-[12px] font-bold rounded-lg hover:bg-[#C91E30] uppercase tracking-wider disabled:opacity-60"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {loading ? "Updating…" : "Update password"}
          </button>
        </div>
      </form>
    </section>
  );
}
