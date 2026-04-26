"use client";

import { FormEvent, useState } from "react";
import { API_URL } from "@/lib/constants";

interface NewsletterSignupProps {
  variant?: "inline" | "footer" | "card";
  source?: string;
  heading?: string;
  subheading?: string;
}

type Status = "idle" | "loading" | "created" | "existed" | "error";

export default function NewsletterSignup({
  variant = "inline",
  source,
  heading,
  subheading,
}: NewsletterSignupProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubscribe(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch(`${API_URL}/api/v1/newsletter/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: source || null }),
      });
      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(txt.slice(0, 200) || `Subscribe failed (${res.status})`);
      }
      const data = (await res.json()) as { status?: string };
      setStatus(data.status === "existed" ? "existed" : "created");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Subscribe failed.");
    }
  }

  const submitted = status === "created" || status === "existed";
  const loading = status === "loading";

  const successCopy =
    status === "existed"
      ? "Already on the list - thanks!"
      : "Subscribed. Check your inbox to confirm.";

  if (variant === "footer") {
    if (submitted) {
      return <p className="text-[13px] text-white/70">✓ {successCopy}</p>;
    }
    return (
      <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
        <input
          type="email"
          name="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@institute.ac.in"
          className="w-full rounded-md bg-white/10 border border-white/20 px-3 py-2 text-[13px] text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#E9283D]/50"
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-[#E9283D] px-3 py-2 text-[13px] font-semibold text-white hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? "Subscribing..." : "Subscribe free"}
        </button>
        {status === "error" && (
          <p className="text-[12px] text-[#E9283D]">{errorMsg}</p>
        )}
      </form>
    );
  }

  if (variant === "card") {
    return (
      <div className="rounded-2xl border-2 border-black bg-white p-6 sm:p-8 max-w-2xl">
        {heading && (
          <h3
            className="text-[22px] sm:text-[28px] font-black text-black leading-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {heading}
          </h3>
        )}
        {subheading && (
          <p className="mt-2 text-[14px] sm:text-[15px] text-gray-600 leading-relaxed">
            {subheading}
          </p>
        )}
        {submitted ? (
          <div className="mt-5 inline-flex items-center gap-2 text-[14px] font-semibold text-black">
            <span className="inline-block h-5 w-5 rounded-full bg-[#E9283D] text-white text-center leading-5">
              ✓
            </span>
            {successCopy}
          </div>
        ) : (
          <form
            onSubmit={handleSubscribe}
            className="mt-5 flex flex-col sm:flex-row gap-3"
          >
            <input
              type="email"
              name="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@institute.ac.in"
              className="flex-1 border-2 border-black rounded-lg px-4 py-3 text-[14px] text-black placeholder:text-gray-400 focus:ring-2 focus:ring-[#E9283D]/30 outline-none"
            />
            <button
              type="submit"
              disabled={loading}
              className="btn-primary whitespace-nowrap disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Subscribing..." : "Subscribe free →"}
            </button>
          </form>
        )}
        {status === "error" && (
          <p className="mt-3 text-[13px] text-[#E9283D] font-semibold">
            {errorMsg}
          </p>
        )}
        <p
          className="mt-3 text-[11px] uppercase tracking-[0.15em] text-gray-500"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          No spam · One email a week · Unsubscribe anytime
        </p>
      </div>
    );
  }

  // inline
  if (submitted) {
    return (
      <div className="rounded-lg border border-brand-100 bg-brand-50 px-4 py-3 text-sm text-brand-600">
        ✓ {successCopy}
      </div>
    );
  }
  return (
    <div className="space-y-2">
      <form
        onSubmit={handleSubscribe}
        className="flex flex-col sm:flex-row gap-2 items-stretch"
      >
        <input
          type="email"
          name="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@institute.ac.in"
          className="flex-1 rounded-md border border-brand-200 px-3 py-2 text-sm text-brand-600 placeholder:text-brand-300 focus:outline-none focus:ring-2 focus:ring-accent-500/30"
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-black px-4 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap"
        >
          {loading ? "Subscribing..." : "Get weekly digest"}
        </button>
      </form>
      {status === "error" && (
        <p className="text-[12px] text-[#E9283D] font-semibold">{errorMsg}</p>
      )}
    </div>
  );
}
