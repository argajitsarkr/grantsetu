"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { API_URL } from "@/lib/constants";

function ResetInner() {
  const params = useSearchParams();
  const router = useRouter();
  const token = params.get("token") || "";
  const [pw, setPw] = useState("");
  const [confirm, setConfirm] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    if (pw.length < 8) return setErr("Password must be at least 8 characters.");
    if (pw !== confirm) return setErr("Passwords don't match.");
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/v1/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, new_password: pw }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setErr(data.detail || "This reset link is invalid or has expired.");
        setLoading(false);
        return;
      }
      router.push("/auth/signin?reset=1");
    } catch {
      setErr("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  if (!token) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-5 py-16">
        <div className="max-w-[480px] w-full border-2 border-black rounded-xl p-8">
          <h1
            className="text-[2rem] font-black text-black leading-tight mb-3"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Missing token.
          </h1>
          <p className="text-sm text-gray-600 mb-4">
            This URL is missing the reset token. Request a new link below.
          </p>
          <Link href="/auth/forgot" className="underline text-[#E9283D] text-sm">
            Request a reset link →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-5 py-16">
      <div className="max-w-[480px] w-full border-2 border-black rounded-xl p-8">
        <span
          className="inline-block text-[10px] uppercase tracking-[0.2em] text-[#E9283D] font-bold mb-2"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          Reset password
        </span>
        <h1
          className="text-[2rem] font-black text-black leading-tight mb-5"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Choose a new password.
        </h1>
        <form onSubmit={onSubmit} className="space-y-3">
          <input
            type="password"
            required
            autoFocus
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            placeholder="New password (min 8 chars)"
            className="w-full h-[44px] border-2 border-black rounded-lg px-4 text-sm"
          />
          <input
            type="password"
            required
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="Confirm new password"
            className="w-full h-[44px] border-2 border-black rounded-lg px-4 text-sm"
          />
          {err && <p className="text-[13px] text-[#E9283D]">{err}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-[44px] bg-[#E9283D] text-white text-[13px] font-bold rounded-lg hover:bg-[#C91E30] uppercase tracking-wider disabled:opacity-60"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {loading ? "Resetting…" : "Reset password"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function ResetPage() {
  return (
    <Suspense fallback={null}>
      <ResetInner />
    </Suspense>
  );
}
