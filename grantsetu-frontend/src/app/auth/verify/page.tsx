"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { API_URL } from "@/lib/constants";

type Status = "idle" | "ok" | "error" | "resending" | "resent";

function VerifyInner() {
  const params = useSearchParams();
  const { update } = useSession();
  const token = params.get("token");
  const ok = params.get("ok");
  const error = params.get("error");
  const [status, setStatus] = useState<Status>(
    error ? "error" : ok ? "ok" : token ? "idle" : "error"
  );
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (ok) {
      // Await the session refresh, then hard-reload so every page (banner,
      // middleware, SSR) sees emailVerified=true on the next request.
      (async () => {
        try {
          await update({ emailVerified: true });
        } catch {
          // ignore - we'll still redirect
        }
        setTimeout(() => {
          window.location.assign("/dashboard");
        }, 1200);
      })();
      return;
    }
    if (token && !error) {
      // Hand off to the backend which verifies + redirects back with ?ok=1 or ?error=...
      window.location.replace(
        `${API_URL}/api/v1/auth/verify?token=${encodeURIComponent(token)}`
      );
    }
  }, [ok, token, error, update]);

  if (token && !ok && !error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-5 py-16">
        <p className="text-sm text-gray-600">Verifying your email…</p>
      </div>
    );
  }

  async function resend(e: React.FormEvent) {
    e.preventDefault();
    setStatus("resending");
    try {
      await fetch(`${API_URL}/api/v1/auth/send-verification`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setStatus("resent");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-5 py-16">
      <div className="max-w-[480px] w-full border-2 border-black rounded-xl p-8 bg-white">
        <span
          className="inline-block text-[10px] uppercase tracking-[0.2em] text-[#E9283D] font-bold mb-2"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          Email verification
        </span>
        {status === "ok" && (
          <>
            <h1
              className="text-[2rem] font-black text-black leading-tight mb-3"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Email verified <span className="text-[#E9283D]">✓</span>
            </h1>
            <p className="text-sm text-gray-600 mb-6">
              Your account is confirmed. You can now receive grant alerts.
            </p>
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center h-[44px] px-6 bg-[#E9283D] text-white text-[13px] font-bold rounded-lg hover:bg-[#C91E30] uppercase tracking-wider"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              Go to dashboard →
            </Link>
          </>
        )}
        {status !== "ok" && (
          <>
            <h1
              className="text-[2rem] font-black text-black leading-tight mb-3"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Link {error === "invalid" ? "invalid" : "expired"}.
            </h1>
            <p className="text-sm text-gray-600 mb-5">
              Enter your email and we&apos;ll send a fresh verification link.
            </p>
            <form onSubmit={resend} className="space-y-3">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@institute.ac.in"
                className="w-full h-[44px] border-2 border-black rounded-lg px-4 text-sm"
              />
              <button
                type="submit"
                disabled={status === "resending"}
                className="w-full h-[44px] bg-[#E9283D] text-white text-[13px] font-bold rounded-lg hover:bg-[#C91E30] uppercase tracking-wider disabled:opacity-60"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {status === "resending" ? "Sending…" : status === "resent" ? "Check your inbox" : "Resend link"}
              </button>
            </form>
            <div className="mt-4 text-xs text-gray-500">
              <Link href="/dashboard" className="underline">← Back to dashboard</Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={null}>
      <VerifyInner />
    </Suspense>
  );
}
