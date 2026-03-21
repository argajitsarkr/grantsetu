import Link from "next/link";
import Image from "next/image";
import { AGENCIES } from "@/lib/constants";
import AgencyLogo from "@/components/AgencyLogo";

export default function HomePage() {
  return (
    <div>
      {/* ── Hero — Topmate peach bg (#FFE4D6), Gilroy heading ── */}
      <section className="bg-warm-200 relative overflow-hidden">
        <div className="container-main py-28 sm:py-36 lg:py-44">
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
              {/* Eyebrow pill */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/70 backdrop-blur-sm rounded-pill border border-brand-200/60 text-sm font-medium text-brand-600 mb-8">
                <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
                Updated daily from 8+ official agency portals
              </div>

              {/* Gilroy display heading */}
              <h1 className="text-[2.75rem] sm:text-[3.5rem] lg:text-[4.5rem] font-bold text-brand-900 leading-[1] tracking-[-0.03em]">
                Never miss an Indian
                <br />
                research{" "}
                <span className="text-accent-500">grant</span>{" "}
                again
              </h1>

              <p className="mt-7 text-lg sm:text-xl text-brand-600 max-w-2xl leading-relaxed">
                GrantSetu tracks calls from DBT, DST, ICMR, ANRF, BIRAC, CSIR, UGC and more
                — all in one place.
              </p>

              {/* CTAs — pill buttons like Topmate */}
              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/grants"
                  className="inline-flex items-center gap-3 bg-brand-900 text-white px-8 py-4 rounded-pill font-semibold text-base hover:bg-brand-800 active:scale-[0.98] transition-all duration-200 group shadow-btn"
                >
                  Browse Open Grants
                  <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
                <Link
                  href="/alerts"
                  className="inline-flex items-center gap-2 border-2 border-brand-900/20 text-brand-900 bg-white/80 px-8 py-4 rounded-pill font-semibold text-base hover:border-brand-900/40 hover:bg-white active:scale-[0.98] transition-all duration-200"
                >
                  Get Weekly Alerts
                </Link>
              </div>

              {/* Social proof pills */}
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-pill text-sm font-medium text-brand-700 border border-brand-200/60">
                  <span className="text-yellow-400 tracking-tighter">★★★★★</span>
                  Free &amp; Open Access
                </span>
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-pill text-sm font-medium text-brand-700 border border-brand-200/60">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                  8+ Agencies Tracked
                </span>
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-pill text-sm font-medium text-brand-700 border border-brand-200/60">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-500" />
                  NE India Friendly
                </span>
              </div>
          </div>
        </div>
      </section>

      {/* ── How it works — Topmate pastel cards ── */}
      <section className="section-padding bg-white">
        <div className="container-main">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-display-sm sm:text-display-md font-bold text-brand-900">
              How it works
            </h2>
            <p className="mt-4 text-brand-500 text-lg leading-relaxed">
              Three simple steps to never miss a funding opportunity
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                step: "01",
                title: "Discover",
                desc: "We scrape official agency portals daily and extract grant details automatically.",
                bg: "bg-pastel-blue",
                numColor: "text-blue-600",
              },
              {
                step: "02",
                title: "Filter",
                desc: "Search by agency, subject area, career stage, budget and deadline. All filters are URL-shareable.",
                bg: "bg-pastel-lavender",
                numColor: "text-purple-600",
              },
              {
                step: "03",
                title: "Apply",
                desc: "Click through to the official portal. Never miss a deadline again.",
                bg: "bg-pastel-mint",
                numColor: "text-teal-600",
              },
            ].map((item) => (
              <div key={item.step} className={`card-pastel ${item.bg} flex flex-col`}>
                <span className={`text-5xl font-extrabold ${item.numColor} opacity-60 mb-4`}>
                  {item.step}
                </span>
                <h3 className="text-xl font-bold text-brand-900 mb-3">{item.title}</h3>
                <p className="text-brand-600 leading-relaxed text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Agency logos grid ── */}
      <section className="py-16 bg-brand-50">
        <div className="container-main">
          <p className="text-center text-xs font-semibold text-brand-400 uppercase tracking-[0.15em] mb-3">
            Tracking grants from
          </p>
          <p className="text-center text-brand-500 text-sm mb-10">
            Official portals of 8 Indian government funding agencies — aggregated daily
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {AGENCIES.map((agency) => (
              <AgencyLogo key={agency} agency={agency} variant="card" showName={true} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats strip ── */}
      <section className="py-12 bg-white border-y border-brand-100">
        <div className="container-main">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
            {[
              { value: "8+",    label: "Agencies Tracked" },
              { value: "Daily", label: "Scraping Frequency" },
              { value: "Free",  label: "Always & Forever" },
              { value: "NE ♥",  label: "India-First Focus" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-3xl font-extrabold text-brand-900 tracking-tight">{stat.value}</p>
                <p className="mt-1 text-sm text-brand-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA — dark Topmate section with grid pattern ── */}
      <section className="bg-brand-900 section-padding relative overflow-hidden">
        <div className="absolute inset-0 bg-grid" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-display-sm sm:text-display-md font-bold text-white">
            Stop checking 10 websites
            <br />
            <span className="text-accent-400">for grants</span>
          </h2>
          <p className="mt-5 text-lg text-brand-300 max-w-lg mx-auto leading-relaxed">
            Set up email alerts and get matched grants delivered to your inbox every week — completely free.
          </p>
          <Link
            href="/alerts"
            className="mt-10 inline-flex items-center gap-3 bg-white text-brand-900 px-8 py-4 rounded-pill font-semibold text-base hover:bg-warm-100 active:scale-[0.98] transition-all duration-200 group shadow-btn"
          >
            Set Up Free Alerts
            <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </section>
    </div>
  );
}
