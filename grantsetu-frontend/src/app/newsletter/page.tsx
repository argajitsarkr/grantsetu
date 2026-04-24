"use client";

import { FormEvent, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import RazorpayCheckout from "@/components/RazorpayCheckout";
import { API_URL } from "@/lib/constants";

interface Pricing {
  price_paise: number;
  currency: string;
  early_bird: boolean;
  spots_remaining: number | null;
  early_bird_cap: number;
}

/* ── Buttondown username - set via env or override here ── */
const BUTTONDOWN_USERNAME =
  process.env.NEXT_PUBLIC_BUTTONDOWN_USERNAME || "grantsetu";
const BUTTONDOWN_ACTION = `https://buttondown.com/api/emails/embed-subscribe/${BUTTONDOWN_USERNAME}`;

/* ── FAQ ── */
const FAQ = [
  {
    q: "Is this AI-generated?",
    a: "No. Every issue is curated manually by a human who actually applies to these grants. There's no AI writing the commentary. That's the whole point.",
  },
  {
    q: "What if I don't want Pro?",
    a: "Free tier is free forever. Every open call, every Monday. Pro is for people who want filtering and budget templates.",
  },
  {
    q: "Can my institution sponsor this for our faculty?",
    a: "Yes. Reply to any email. I'll set up an institutional subscription for your Sponsored Research Cell.",
  },
  {
    q: "How do I pay? I'm in India.",
    a: "Razorpay. UPI, netbanking, cards, wallets - all Indian payment methods work. You'll get a proper tax invoice.",
  },
];

export default function NewsletterPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pricing, setPricing] = useState<Pricing | null>(null);
  const [proSuccess, setProSuccess] = useState(false);
  const [proError, setProError] = useState<string | null>(null);
  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();

  useEffect(() => {
    fetch(`${API_URL}/api/v1/billing/pricing`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data) setPricing(data);
      })
      .catch(() => {
        // Silent — UI falls back to the static ₹299 copy.
      });
  }, []);

  /* ── Buttondown embed submission - posts to their form endpoint ── */
  async function handleSubscribe(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = e.currentTarget;
    try {
      await fetch(BUTTONDOWN_ACTION, {
        method: "POST",
        mode: "no-cors",
        body: new FormData(form),
      });
      setSubmitted(true);
    } catch {
      // no-cors hides errors; we optimistically mark success.
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      {/* ── Hero ── */}
      <section className="relative bg-white pt-10 pb-10 sm:pt-14 sm:pb-14 overflow-hidden">
        <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className="mb-5 opacity-0 animate-fade-in-up"
            style={{ animationDelay: "0.1s", animationFillMode: "forwards" }}
          >
            <span className="label-pill">Weekly Newsletter · Free</span>
          </div>

          <h1
            className="heading-display text-[1.75rem] sm:text-[3rem] lg:text-[4.25rem] text-black opacity-0 animate-fade-in-up leading-[0.95]"
            style={{ animationDelay: "0.2s", animationFillMode: "forwards" }}
          >
            Every open Indian
            <br />
            research grant call.
            <br />
            <span className="text-[#E9283D]">One email.</span> Every Monday.
          </h1>

          <p
            className="mt-5 text-[15px] sm:text-[18px] text-gray-600 max-w-[680px] leading-[1.5] opacity-0 animate-fade-in-up"
            style={{
              animationDelay: "0.4s",
              animationFillMode: "forwards",
              fontFamily: "var(--font-body)",
            }}
          >
            Built by a PhD researcher from India who got tired of missing funding calls.
          </p>

          {/* ── Buttondown subscribe form ── */}
          <div
            className="mt-6 opacity-0 animate-fade-in-up"
            style={{ animationDelay: "0.5s", animationFillMode: "forwards" }}
          >
            {submitted ? (
              <div className="inline-flex items-center gap-3 border-2 border-black bg-black text-white rounded-xl px-6 py-4">
                <div className="w-8 h-8 rounded-full bg-[#E9283D] flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p
                    className="text-[13px] font-bold uppercase tracking-wider"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    Subscribed
                  </p>
                  <p className="text-[14px] text-white/70 mt-0.5">
                    Check your inbox to confirm. First issue arrives Monday 7 AM IST.
                  </p>
                </div>
              </div>
            ) : (
              <form
                onSubmit={handleSubscribe}
                action={BUTTONDOWN_ACTION}
                method="post"
                target="popupwindow"
                className="flex flex-col sm:flex-row items-stretch gap-3 max-w-xl"
              >
                <input
                  type="email"
                  name="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@institute.ac.in"
                  className="flex-1 border-2 border-black rounded-lg px-5 py-3.5 text-[15px] text-black placeholder:text-gray-400 focus:ring-2 focus:ring-[#E9283D]/30 outline-none"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary whitespace-nowrap disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? "Subscribing…" : "Subscribe Free →"}
                </button>
              </form>
            )}
            <p
              className="mt-3 text-[12px] uppercase tracking-[0.15em] text-gray-500"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              No spam · One email a week · Unsubscribe anytime
            </p>
          </div>
        </div>
      </section>

      {/* ── What you get - free tier ── */}
      <section className="bg-black py-24 sm:py-32 border-t-2 border-b-2 border-black">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <p
                className="text-[11px] tracking-[0.2em] uppercase text-[#E9283D] mb-3 font-semibold"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                What You Get · Free
              </p>
              <h2 className="heading-display text-[2rem] sm:text-[3rem] text-white leading-[1]">
                Every Monday,
                <br />
                7 AM IST.
              </h2>
            </div>
            <p className="text-white/60 text-[15px] max-w-sm">
              Curated tight. Easy to read in 3 minutes. Zero filler.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-t-2 border-white/20">
            {[
              {
                t: "Curated grant calls",
                d: "Every open call across DBT, DST, ICMR, ANRF, CSIR, BIRAC, UGC, AYUSH, and state agencies.",
              },
              {
                t: "Pre-filtered by urgency",
                d: "You won't miss the ones closing this week. Closing-soon calls get pinned to the top.",
              },
              {
                t: "Direct portal links",
                d: "No more hunting through 12 websites. One click from the email to the exact application page.",
              },
              {
                t: "Plain-English commentary",
                d: "What's worth applying to, what's a long shot - written by someone who has actually submitted proposals.",
              },
            ].map((item, i) => (
              <div
                key={item.t}
                className={`p-8 sm:p-10 border-b-2 border-white/20 ${i % 2 === 0 ? "md:border-r-2" : ""} border-white/20`}
              >
                <div className="w-3 h-3 rounded-full bg-[#E9283D] mb-5" />
                <h3 className="heading-display text-[1.5rem] sm:text-[1.75rem] text-white mb-2.5">
                  {item.t}
                </h3>
                <p className="text-white/70 text-[15px] leading-relaxed">{item.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Paid Pro tier ── */}
      <section className="bg-[#E9283D] py-24 sm:py-32">
        <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <p
                className="text-[11px] tracking-[0.2em] uppercase text-white/80 mb-3 font-semibold"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {pricing && !pricing.early_bird
                  ? "Pro Annual Subscription"
                  : `Launch Price · First ${pricing?.early_bird_cap ?? 100} Subscribers`}
              </p>
              <h2 className="heading-display text-[2rem] sm:text-[3.25rem] text-white leading-[1]">
                GrantSetu Weekly
                <br />
                <span className="underline decoration-white decoration-4 underline-offset-4">Pro.</span>
              </h2>
              {pricing?.early_bird && pricing.spots_remaining !== null && (
                <p
                  className="mt-4 text-[13px] uppercase tracking-wider text-white font-semibold"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  {pricing.spots_remaining} of {pricing.early_bird_cap} early-bird spots left
                </p>
              )}
            </div>
            <div className="text-right">
              <p className="heading-display text-[3rem] sm:text-[4.5rem] text-white leading-[0.9]">
                ₹{pricing ? Math.round(pricing.price_paise / 100) : 299}
              </p>
              <p
                className="text-[13px] uppercase tracking-wider text-white/80 font-semibold"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                per year
              </p>
            </div>
          </div>

          <div className="border-t-2 border-white/40">
            <p
              className="py-6 text-[14px] uppercase tracking-[0.15em] text-white/80 font-semibold border-b-2 border-white/40"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              Everything in Free, plus:
            </p>
            {[
              {
                t: "Filtered to your field",
                d: "Only the calls you're actually eligible for - by subject area, career stage, and institution type.",
              },
              {
                t: "Monthly budget template pack",
                d: "DBT, ICMR, ANRF formats with current JRF/SRF rates and overhead calculations already done for you.",
              },
              {
                t: "Quarterly deep-dive",
                d: "\"State of Indian Research Funding\" - what's getting funded, what's not, what to pitch next quarter.",
              },
              {
                t: "Reply directly to any email",
                d: "You get an actual human who has written a ₹4.61 Cr DBT proposal. Not a chatbot.",
              },
            ].map((item) => (
              <div
                key={item.t}
                className="py-8 border-b-2 border-white/40 flex flex-col sm:flex-row gap-4 sm:gap-8"
              >
                <div className="sm:w-12 flex-shrink-0">
                  <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="heading-display text-[1.375rem] sm:text-[1.625rem] text-white mb-2">
                    {item.t}
                  </h3>
                  <p className="text-white/85 text-[15px] leading-relaxed">{item.d}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 flex flex-col sm:flex-row items-start sm:items-center gap-6" id="pro-checkout">
            {proSuccess ? (
              <div className="inline-flex items-center gap-3 bg-white text-black px-6 py-4 rounded-lg">
                <span className="inline-flex items-center justify-center h-7 w-7 rounded-full bg-[#E9283D] text-white font-bold">✓</span>
                <div>
                  <p className="font-bold text-[15px]">You&apos;re Pro for 1 year.</p>
                  <p className="text-[13px] text-gray-600 mt-0.5">Check your inbox — Monday digest + Pro deep-dives are on the way.</p>
                </div>
              </div>
            ) : sessionStatus === "authenticated" && session?.backendToken ? (
              <RazorpayCheckout
                token={session.backendToken as string}
                onSuccess={() => {
                  setProSuccess(true);
                  setProError(null);
                }}
                onError={(msg) => setProError(msg)}
              />
            ) : (
              <button
                type="button"
                onClick={() => router.push("/auth/signin?callbackUrl=/newsletter%23pro-checkout")}
                className="inline-flex items-center justify-center bg-white text-[#E9283D] px-10 py-4 rounded-lg font-bold text-[14px] uppercase tracking-wider hover:bg-black hover:text-white transition-colors"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                Sign in to upgrade →
              </button>
            )}
            <p className="text-white/90 text-[14px] max-w-sm leading-relaxed">
              ~₹25/month. Less than one filter coffee. One extra week of awareness on a grant call pays for a decade of subscriptions.
            </p>
          </div>
          {proError && (
            <p className="mt-4 text-[13px] text-white bg-black/20 rounded-lg px-4 py-3 max-w-md">
              {proError}
            </p>
          )}
        </div>
      </section>

      {/* ── Why this exists ── */}
      <section className="bg-white py-24 sm:py-32">
        <div className="max-w-[900px] mx-auto px-4 sm:px-6">
          <span className="label-pill mb-8 inline-flex">Why This Exists</span>
          <h2 className="heading-display text-[2rem] sm:text-[3rem] text-black mb-10 leading-[1.05]">
            I&apos;m Argajit. I got tired of
            <br />
            missing grant calls.
          </h2>
          <div
            className="space-y-5 text-[17px] sm:text-[18px] text-gray-700 leading-[1.7]"
            style={{ fontFamily: "var(--font-body)" }}
          >
            <p>
              I&apos;m a second-year PhD candidate in Molecular Biology and Bioinformatics at Tripura University, Northeast India. Last year I co-wrote a{" "}
              <span className="font-bold text-black">₹4.61 Cr DBT BIO-GRID proposal</span>{" "}
              through the eProMIS portal.
            </p>
            <p>
              The hardest part was never the science. It was knowing which calls were even open, what the current budget norms were, and whether we were eligible.
            </p>
            <p>
              Colleagues across Indian universities routinely miss grant calls they would have won - not because they didn&apos;t qualify, but because the information is scattered across{" "}
              <span className="font-bold text-black">15+ government websites</span>{" "}
              that nobody has time to check weekly.
            </p>
            <p className="border-l-4 border-[#E9283D] pl-6 italic text-black font-medium">
              GrantSetu Weekly is the email I wish existed two years ago.
            </p>
          </div>
        </div>
      </section>

      {/* ── Who this is for / NOT for ── */}
      <section className="bg-black py-24 sm:py-32 border-t-2 border-b-2 border-black">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
            {/* For */}
            <div>
              <p
                className="text-[11px] tracking-[0.2em] uppercase text-[#E9283D] mb-4 font-semibold"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                Who This Is For
              </p>
              <h3 className="heading-display text-[2rem] sm:text-[2.5rem] text-white mb-8 leading-[1.05]">
                Built for Indian
                <br />
                researchers.
              </h3>
              <ul className="space-y-4">
                {[
                  "Assistant and Associate Professors applying to ANRF, DBT, ICMR, DST.",
                  "PostDocs trying to land their first independent grant.",
                  "Senior PhD students planning the fellowship-to-faculty transition.",
                  "Sponsored Research Cells wanting a single source of truth.",
                ].map((item) => (
                  <li key={item} className="flex gap-3 items-start text-white/85 text-[15px] leading-relaxed">
                    <span className="text-[#E9283D] font-bold flex-shrink-0 mt-0.5">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Not for */}
            <div>
              <p
                className="text-[11px] tracking-[0.2em] uppercase text-white/60 mb-4 font-semibold"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                Who This Is NOT For
              </p>
              <h3 className="heading-display text-[2rem] sm:text-[2.5rem] text-white mb-8 leading-[1.05]">
                Not an
                <br />
                everyone tool.
              </h3>
              <ul className="space-y-4">
                {[
                  "International researchers applying to non-Indian agencies.",
                  "People looking for NIH, NSF, or ERC grants.",
                  "Anyone who wants a 50-page daily digest.",
                ].map((item) => (
                  <li key={item} className="flex gap-3 items-start text-white/60 text-[15px] leading-relaxed">
                    <span className="text-white/40 font-bold flex-shrink-0 mt-0.5">✗</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-24 sm:py-32 bg-white">
        <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <span className="label-pill mb-6 inline-flex">FAQ</span>
            <h2 className="heading-display text-[2.25rem] sm:text-[3rem] text-black">
              Questions, answered.
            </h2>
          </div>
          <div className="max-w-4xl border-t-2 border-black">
            {FAQ.map((item, i) => (
              <details key={i} className="group border-b-2 border-black">
                <summary className="flex items-center justify-between cursor-pointer list-none py-6">
                  <h3 className="heading-display text-[1.125rem] sm:text-[1.375rem] text-black pr-4">
                    {item.q}
                  </h3>
                  <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center flex-shrink-0 group-open:bg-[#E9283D] transition-colors">
                    <svg className="h-4 w-4 transition-transform duration-200 group-open:rotate-180" fill="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" d="M12.53 16.28a.75.75 0 01-1.06 0l-7.5-7.5a.75.75 0 011.06-1.06L12 14.69l6.97-6.97a.75.75 0 111.06 1.06l-7.5 7.5z" clipRule="evenodd" />
                    </svg>
                  </div>
                </summary>
                <p className="pb-6 pr-12 text-gray-600 leading-relaxed text-[15px]">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="bg-[#E9283D] py-24 sm:py-32">
        <div className="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="heading-display text-[2.25rem] sm:text-[4rem] lg:text-[5rem] text-white leading-[0.95]">
            One email.
            <br />
            Every Monday.
            <br />
            Never miss a call.
          </h2>
          <p className="mt-8 text-[17px] sm:text-[19px] text-white/90 max-w-[560px] mx-auto leading-relaxed">
            Join Indian researchers already getting their weekly funding brief.
          </p>

          {!submitted && (
            <form
              onSubmit={handleSubscribe}
              action={BUTTONDOWN_ACTION}
              method="post"
              target="popupwindow"
              className="mt-10 flex flex-col sm:flex-row items-stretch gap-3 max-w-lg mx-auto"
            >
              <input
                type="email"
                name="email"
                required
                autoComplete="email"
                placeholder="you@institute.ac.in"
                className="flex-1 border-2 border-white rounded-lg px-5 py-3.5 text-[15px] text-black bg-white placeholder:text-gray-400 focus:ring-2 focus:ring-white/50 outline-none"
              />
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center bg-black text-white px-8 py-3.5 rounded-lg font-bold text-[14px] uppercase tracking-wider hover:bg-white hover:text-black transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {loading ? "Subscribing…" : "Subscribe Free →"}
              </button>
            </form>
          )}

          <p
            className="mt-6 text-[11px] uppercase tracking-[0.15em] text-white/70"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            No spam · One email a week · Unsubscribe anytime
          </p>
        </div>
      </section>
    </div>
  );
}
