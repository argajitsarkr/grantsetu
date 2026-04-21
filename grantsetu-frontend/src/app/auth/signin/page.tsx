"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useState } from "react";
import { signIn } from "next-auth/react";

export default function SignInPage() {
  return (
    <Suspense fallback={<div className="min-h-[calc(100vh-200px)] bg-white" />}>
      <SignInForm />
    </Suspense>
  );
}

function SignInForm() {
  const router = useRouter();
  const search = useSearchParams();
  const callbackUrl = search.get("callbackUrl") || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleEmailSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl,
    });
    setSubmitting(false);
    if (!res || res.error) {
      setError("Invalid email or password.");
      return;
    }
    router.push(res.url || callbackUrl);
    router.refresh();
  }

  return (
    <div className="min-h-[calc(100vh-200px)] bg-white py-16 sm:py-20 px-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <span className="label-pill mb-6 inline-flex">Sign In</span>
          <h1 className="heading-display text-[2.25rem] sm:text-[3rem] text-black leading-[1]">
            Welcome <span className="text-[#E9283D]">back.</span>
          </h1>
          <p
            className="mt-4 text-[15px] text-gray-600 leading-relaxed"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Sign in to track saved grants, set up alerts, and get personalised recommendations.
          </p>
        </div>

        {/* Card */}
        <div className="bg-white border-2 border-black rounded-xl p-6 sm:p-8 space-y-5">
          {/* Google */}
          <button
            type="button"
            onClick={() => signIn("google", { callbackUrl })}
            className="w-full flex items-center justify-center gap-3 bg-white border-2 border-black rounded-lg px-4 py-3 text-[14px] font-bold uppercase tracking-wider text-black hover:bg-black hover:text-white transition-colors"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Continue with Google
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-200" />
            <span
              className="text-[11px] uppercase tracking-[0.2em] text-gray-500"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              or with email
            </span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Email form */}
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-[11px] uppercase tracking-[0.15em] text-black font-bold mb-1.5"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 text-[15px] text-black focus:border-[#E9283D] focus:ring-2 focus:ring-[#E9283D]/20 outline-none transition-colors"
                placeholder="you@institute.ac.in"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-[11px] uppercase tracking-[0.15em] text-black font-bold mb-1.5"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 text-[15px] text-black focus:border-[#E9283D] focus:ring-2 focus:ring-[#E9283D]/20 outline-none transition-colors"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <p
                className="text-[13px] text-[#E9283D] font-semibold"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-[#E9283D] text-white px-7 py-3.5 rounded-lg font-bold text-[14px] uppercase tracking-wider hover:bg-[#C91E30] disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              {submitting ? "Signing in…" : "Sign in →"}
            </button>
            <div className="text-center">
              <Link href="/auth/forgot" className="text-[12px] text-gray-600 hover:text-[#E9283D] hover:underline">
                Forgot password? →
              </Link>
            </div>
          </form>

          <p className="text-center text-[13px] text-gray-600 pt-2 border-t border-gray-100">
            Don&apos;t have an account?{" "}
            <Link
              href={`/auth/signup${callbackUrl !== "/dashboard" ? `?callbackUrl=${encodeURIComponent(callbackUrl)}` : ""}`}
              className="text-[#E9283D] font-bold hover:underline"
            >
              Create one
            </Link>
          </p>
        </div>

        <p
          className="mt-6 text-center text-[11px] uppercase tracking-[0.15em] text-gray-500"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          Your data stays private. No spam.
        </p>
      </div>
    </div>
  );
}
