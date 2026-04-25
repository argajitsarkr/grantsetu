"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import NewsletterSignup from "@/components/NewsletterSignup";

const FEATURES = [
  {
    label: "01 / Collaborate",
    title: "Multi-author live editing.",
    body: "Co-PIs, students, and collaborators write the same proposal at the same time. No more 'final-final-v7.docx' email threads.",
  },
  {
    label: "02 / Portal-ready",
    title: "Templates shaped like the agency portal.",
    body: "Sections pre-structured for DBT, BIRAC, ICMR and ANRF submission forms. Paste straight in - no reformatting.",
  },
  {
    label: "03 / Budget calculators",
    title: "Manpower, equipment, contingency, overheads.",
    body: "Indian grant budget rules built-in. Auto-totals, GST handling, fellowship slabs, and equipment depreciation - the math is done for you.",
  },
  {
    label: "04 / Auto-filled biodata",
    title: "Pull biodata + latest publications.",
    body: "Fellow co-investigator joins the doc and their CV, ORCID publications, and institutional affiliation are filled in. Stop emailing 'send me your latest biodata' again.",
  },
  {
    label: "05 / Versions + comments",
    title: "Track every change. Comment in-line.",
    body: "Full version history with diffs. Threaded comments tied to sections. Resolve them as you go, just like Google Docs - but built for grants.",
  },
  {
    label: "06 / Export ready",
    title: "One-click PDF + portal-ready output.",
    body: "Generate a formatted PDF for circulation, or export each section in the exact shape the agency portal expects. Submit faster, with fewer errors.",
  },
];

const FAQ = [
  {
    q: "When does Studio launch?",
    a: "We're targeting Q3 2026. Waitlist members get early access at least 4 weeks before public release.",
  },
  {
    q: "Will it really replace endless email drafts?",
    a: "Yes - that's the whole point. Multi-author editing, version-controlled, in-line comments. The 'final-final-v7.docx' problem is solved at the source.",
  },
  {
    q: "What about my existing data?",
    a: "Biodata, ORCID publications, institutional affiliation, and career stage are pulled from your GrantSetu /profile. Update once - reuse on every proposal.",
  },
  {
    q: "How much will it cost?",
    a: "Studio is bundled in GrantSetu Pro (₹499/year). The first 100 waitlist members lock in the early-bird price of ₹299/year for life.",
  },
];

export default function StudioPage() {
  const { status } = useSession();
  const isAuthenticated = status === "authenticated";

  return (
    <main className="bg-white">
      {/* HERO */}
      <section className="border-b-2 border-black">
        <div className="max-w-[1200px] mx-auto px-5 sm:px-8 py-20 sm:py-28">
          <p
            className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] font-bold text-[#E9283D] mb-6"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            <span className="inline-block w-2 h-2 rounded-full bg-[#E9283D] animate-pulse" />
            SOON · COMING Q3 2026
          </p>
          <h1
            className="text-[2.5rem] sm:text-[4.5rem] leading-[0.95] font-black text-black tracking-tight"
            style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.02em" }}
          >
            THE COLLAB WORKSPACE<br />
            FOR INDIAN <span className="text-[#E9283D]">RESEARCH GRANTS</span>.
          </h1>
          <p className="mt-7 text-[16px] sm:text-[18px] leading-relaxed text-gray-700 max-w-2xl">
            Stop sending endless drafts. Stop chasing co-PIs for the latest biodata. Write your DBT, BIRAC, ICMR and ANRF proposals together, in the same doc, in the exact format the portal expects - with budget calculators that already know the rules.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <a
              href="#waitlist"
              className="inline-flex items-center justify-center h-[52px] px-8 bg-[#E9283D] text-white text-[14px] font-bold rounded-lg hover:bg-[#C91E30] uppercase tracking-wider transition-colors"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              Join the Waitlist →
            </a>
            <Link
              href="/grants"
              className="inline-flex items-center justify-center h-[52px] px-8 border-2 border-black text-black text-[14px] font-bold rounded-lg hover:bg-black hover:text-white uppercase tracking-wider transition-colors"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              Back to Grants
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="bg-black text-white border-b-2 border-[#E9283D]">
        <div className="max-w-[1200px] mx-auto px-5 sm:px-8 py-20 sm:py-28">
          <p
            className="text-[11px] uppercase tracking-[0.2em] font-bold text-[#E9283D] mb-5"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            What you get
          </p>
          <h2
            className="text-[2rem] sm:text-[3rem] font-black leading-[1] tracking-tight max-w-3xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            BUILT FOR THE WAY INDIAN GRANTS ACTUALLY GET WRITTEN.
          </h2>
          <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/10 border-2 border-white/10 rounded-2xl overflow-hidden">
            {FEATURES.map((f) => (
              <div key={f.label} className="bg-black p-8 flex flex-col gap-3">
                <p
                  className="text-[11px] uppercase tracking-[0.2em] font-bold text-[#E9283D]"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  {f.label}
                </p>
                <h3
                  className="text-[20px] sm:text-[22px] font-black leading-tight"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {f.title}
                </h3>
                <p className="text-[14px] text-white/70 leading-relaxed">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRO TEASER */}
      <section className="bg-[#E9283D] text-white border-b-2 border-black">
        <div className="max-w-[1200px] mx-auto px-5 sm:px-8 py-20 sm:py-28">
          <p
            className="text-[11px] uppercase tracking-[0.2em] font-bold text-white/80 mb-5"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            Pro feature
          </p>
          <h2
            className="text-[2rem] sm:text-[3rem] font-black leading-[1] tracking-tight max-w-3xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            STUDIO IS INCLUDED IN GRANTSETU PRO.
          </h2>
          <p className="mt-6 text-[16px] sm:text-[18px] leading-relaxed max-w-2xl text-white/90">
            One subscription unlocks the workspace, the budget calculators, the auto-fill, and every Pro feature we ship. The first 100 waitlist members lock in early-bird pricing of ₹299/year for life.
          </p>
          <ul
            className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-3xl text-[14px] font-semibold"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {[
              "Unlimited collaborative documents",
              "All agency-portal templates",
              "Built-in budget calculators",
              "Auto-filled biodata + publications",
              "Version history + in-line comments",
              "Priority email support",
            ].map((p) => (
              <li key={p} className="flex items-start gap-2 uppercase tracking-wider">
                <span className="inline-block mt-0.5">✓</span>
                <span>{p}</span>
              </li>
            ))}
          </ul>
          <div className="mt-10 flex flex-wrap gap-3">
            {isAuthenticated ? (
              <a
                href="#waitlist"
                className="inline-flex items-center justify-center h-[52px] px-8 bg-black text-white text-[14px] font-bold rounded-lg hover:bg-white hover:text-black uppercase tracking-wider transition-colors"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                Reserve your seat (free) →
              </a>
            ) : (
              <Link
                href="/auth/signin?callbackUrl=/studio"
                className="inline-flex items-center justify-center h-[52px] px-8 bg-black text-white text-[14px] font-bold rounded-lg hover:bg-white hover:text-black uppercase tracking-wider transition-colors"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                Sign in to reserve →
              </Link>
            )}
            <Link
              href="/newsletter#pro"
              className="inline-flex items-center justify-center h-[52px] px-8 border-2 border-white text-white text-[14px] font-bold rounded-lg hover:bg-white hover:text-[#E9283D] uppercase tracking-wider transition-colors"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              See Pro pricing
            </Link>
          </div>
        </div>
      </section>

      {/* WAITLIST */}
      <section id="waitlist" className="border-b-2 border-black">
        <div className="max-w-[1200px] mx-auto px-5 sm:px-8 py-20 sm:py-28">
          <p
            className="text-[11px] uppercase tracking-[0.2em] font-bold text-[#E9283D] mb-5"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            Waitlist
          </p>
          <NewsletterSignup
            variant="card"
            source="studio-waitlist"
            heading="Be first in line when Studio opens."
            subheading="We'll email you the moment Studio is ready. The first 100 waitlist members lock in ₹299/year for life. No spam - just one email when there's news."
          />
        </div>
      </section>

      {/* FAQ */}
      <section className="border-b-2 border-black">
        <div className="max-w-[900px] mx-auto px-5 sm:px-8 py-20 sm:py-28">
          <p
            className="text-[11px] uppercase tracking-[0.2em] font-bold text-[#E9283D] mb-5"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            FAQ
          </p>
          <h2
            className="text-[2rem] sm:text-[3rem] font-black text-black leading-[1] tracking-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            QUESTIONS, ANSWERED.
          </h2>
          <div className="mt-10 divide-y-2 divide-black border-y-2 border-black">
            {FAQ.map((item) => (
              <details key={item.q} className="group py-5">
                <summary className="flex items-center justify-between cursor-pointer list-none">
                  <span
                    className="text-[16px] sm:text-[18px] font-black text-black pr-4"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {item.q}
                  </span>
                  <span className="text-[#E9283D] text-[24px] font-bold transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 text-[15px] text-gray-700 leading-relaxed">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="bg-black text-white">
        <div className="max-w-[1200px] mx-auto px-5 sm:px-8 py-20 sm:py-28 text-center">
          <h2
            className="text-[2.25rem] sm:text-[3.5rem] font-black leading-[1] tracking-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            STOP EMAILING DRAFTS.<br />
            <span className="text-[#E9283D]">START WRITING TOGETHER.</span>
          </h2>
          <a
            href="#waitlist"
            className="mt-10 inline-flex items-center justify-center h-[56px] px-10 bg-[#E9283D] text-white text-[14px] font-bold rounded-lg hover:bg-[#C91E30] uppercase tracking-wider transition-colors"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            Join the waitlist →
          </a>
        </div>
      </section>
    </main>
  );
}
