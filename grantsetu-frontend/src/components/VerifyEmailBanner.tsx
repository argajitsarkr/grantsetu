"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { API_URL } from "@/lib/constants";

type UiStatus = "idle" | "sending" | "sent" | "error";

export default function VerifyEmailBanner() {
  const { data: session } = useSession();
  const [status, setStatus] = useState<UiStatus>("idle");
  // Ground truth from /users/me. null = unknown (don't render yet).
  const [verified, setVerified] = useState<boolean | null>(null);

  useEffect(() => {
    const token = session?.backendToken;
    if (!token) {
      setVerified(null);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`${API_URL}/api/v1/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
        });
        if (!res.ok) {
          if (!cancelled) setVerified(true); // hide banner on error - safer than nagging verified users
          return;
        }
        const data = await res.json();
        if (!cancelled) setVerified(Boolean(data.email_verified));
      } catch {
        if (!cancelled) setVerified(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [session?.backendToken]);

  if (!session?.user?.email) return null;
  if (verified !== false) return null;

  async function resend() {
    if (!session?.user?.email) return;
    setStatus("sending");
    try {
      const res = await fetch(`${API_URL}/api/v1/auth/send-verification`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: session.user.email }),
      });
      setStatus(res.ok ? "sent" : "error");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="bg-[#FFF5CC] border-b-2 border-black px-5 py-3">
      <div className="max-w-[1400px] mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <p className="text-[13px] text-black">
          <span
            className="inline-block text-[10px] uppercase tracking-[0.15em] text-[#E9283D] font-bold mr-2"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            Action needed
          </span>
          Please verify your email to unlock newsletter + alerts.
        </p>
        <button
          onClick={resend}
          disabled={status === "sending" || status === "sent"}
          className="h-[32px] px-4 bg-black text-white text-[11px] font-bold rounded-md uppercase tracking-wider disabled:opacity-60"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          {status === "sending"
            ? "Sending…"
            : status === "sent"
            ? "Email sent ✓"
            : status === "error"
            ? "Try again"
            : "Resend email"}
        </button>
      </div>
    </div>
  );
}
