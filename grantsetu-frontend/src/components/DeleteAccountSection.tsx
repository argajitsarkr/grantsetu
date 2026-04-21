"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { API_URL } from "@/lib/constants";

export default function DeleteAccountSection() {
  const { data: session } = useSession();
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const token = session?.backendToken;
  if (!token) return null;

  async function onDelete() {
    setErr(null);
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/v1/users/me`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok && res.status !== 204) {
        const data = await res.json().catch(() => ({}));
        setErr(data.detail || "Could not delete account. Please try again.");
        setLoading(false);
        return;
      }
      // Wipe the NextAuth session and bounce to home.
      await signOut({ redirect: false });
      window.location.assign("/?account=deleted");
    } catch {
      setErr("Network error. Please try again.");
      setLoading(false);
    }
  }

  return (
    <section className="bg-white border-2 border-[#E9283D] rounded-2xl p-6 shadow-card">
      <h2
        className="text-lg font-semibold text-[#E9283D] mb-1"
        style={{ fontFamily: "var(--font-display)" }}
      >
        Delete Account
      </h2>
      <p className="text-brand-500 text-xs mb-4">
        Permanently remove your profile, saved grants, and alert subscriptions. This cannot be undone.
      </p>

      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="h-[40px] px-5 bg-white text-[#E9283D] border-2 border-[#E9283D] text-[12px] font-bold rounded-lg hover:bg-[#E9283D] hover:text-white uppercase tracking-wider transition-colors"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          Delete my account
        </button>
      ) : (
        <div className="space-y-3">
          <p className="text-[13px] text-black">
            Type <span className="font-mono font-bold">DELETE</span> below to confirm. Your account and all associated data will be erased immediately.
          </p>
          <input
            type="text"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="DELETE"
            className="w-full max-w-[260px] h-[40px] border-2 border-black rounded-lg px-3 text-sm font-mono"
          />
          {err && <p className="text-[13px] text-[#E9283D]">{err}</p>}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                setConfirm("");
                setErr(null);
              }}
              disabled={loading}
              className="h-[40px] px-4 bg-white text-black border-2 border-black text-[12px] font-bold rounded-lg uppercase tracking-wider"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onDelete}
              disabled={loading || confirm !== "DELETE"}
              className="h-[40px] px-5 bg-[#E9283D] text-white text-[12px] font-bold rounded-lg hover:bg-[#C91E30] uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              {loading ? "Deleting…" : "Delete forever"}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
