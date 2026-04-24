"use client";

import { FormEvent, useState } from "react";

const BUTTONDOWN_USERNAME =
  process.env.NEXT_PUBLIC_BUTTONDOWN_USERNAME || "grantsetu";
const BUTTONDOWN_ACTION = `https://buttondown.com/api/emails/embed-subscribe/${BUTTONDOWN_USERNAME}`;

interface NewsletterSignupProps {
  variant?: "inline" | "footer" | "card";
  source?: string;
  heading?: string;
  subheading?: string;
}

export default function NewsletterSignup({
  variant = "inline",
  source,
  heading,
  subheading,
}: NewsletterSignupProps) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubscribe(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = e.currentTarget;
    try {
      const body = new FormData(form);
      if (source) body.append("tag", source);
      await fetch(BUTTONDOWN_ACTION, { method: "POST", mode: "no-cors", body });
      setSubmitted(true);
    } catch {
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  }

  if (variant === "footer") {
    if (submitted) {
      return (
        <p className="text-[13px] text-white/70">
          ✓ Subscribed. Check your inbox.
        </p>
      );
    }
    return (
      <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
        {source && <input type="hidden" name="tag" value={source} />}
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
          {loading ? "Subscribing…" : "Subscribe free"}
        </button>
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
            <span className="inline-block h-5 w-5 rounded-full bg-[#E9283D] text-white text-center leading-5">✓</span>
            Subscribed. First issue arrives Monday 7 AM IST.
          </div>
        ) : (
          <form
            onSubmit={handleSubscribe}
            className="mt-5 flex flex-col sm:flex-row gap-3"
          >
            {source && <input type="hidden" name="tag" value={source} />}
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
              {loading ? "Subscribing…" : "Subscribe free →"}
            </button>
          </form>
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
        ✓ Subscribed. Check your inbox for the confirmation email.
      </div>
    );
  }
  return (
    <form
      onSubmit={handleSubscribe}
      className="flex flex-col sm:flex-row gap-2 items-stretch"
    >
      {source && <input type="hidden" name="tag" value={source} />}
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
        {loading ? "Subscribing…" : "Get weekly digest"}
      </button>
    </form>
  );
}
