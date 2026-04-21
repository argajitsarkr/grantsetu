"use client";

import { useState } from "react";
import Link from "next/link";
import { API_URL } from "@/lib/constants";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch(`${API_URL}/api/v1/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
    } finally {
      setSubmitted(true);
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-5 py-16">
      <div className="max-w-[480px] w-full border-2 border-black rounded-xl p-8">
        <span
          className="inline-block text-[10px] uppercase tracking-[0.2em] text-[#E9283D] font-bold mb-2"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          Forgot password
        </span>
        <h1
          className="text-[2rem] font-black text-black leading-tight mb-3"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Reset your password.
        </h1>

        {submitted ? (
          <p className="text-sm text-gray-700 mb-4">
            If an account exists for <span className="font-semibold">{email}</span>, we&apos;ve
            emailed a reset link. Check your inbox (and spam folder).
          </p>
        ) : (
          <form onSubmit={onSubmit} className="space-y-3">
            <input
              type="email"
              required
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@institute.ac.in"
              className="w-full h-[44px] border-2 border-black rounded-lg px-4 text-sm"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full h-[44px] bg-[#E9283D] text-white text-[13px] font-bold rounded-lg hover:bg-[#C91E30] uppercase tracking-wider disabled:opacity-60"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              {loading ? "Sending…" : "Email reset link"}
            </button>
          </form>
        )}

        <div className="mt-4 text-xs text-gray-500">
          <Link href="/auth/signin" className="underline">← Back to sign in</Link>
        </div>
      </div>
    </div>
  );
}
