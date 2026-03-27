import Link from "next/link";
import Image from "next/image";
import { AGENCIES } from "@/lib/constants";
import AgencyLogo from "@/components/AgencyLogo";

/* ── FAQ data ── */
const FAQ_DATA = [
  {
    q: "What is GrantSetu?",
    a: "GrantSetu is India's free research grant discovery platform. It aggregates active grant calls from 8 Indian government funding agencies — DBT, DST, ICMR, ANRF (formerly SERB), BIRAC, CSIR, UGC, and AYUSH — into a single searchable interface, updated daily from official portals.",
  },
  {
    q: "Which agencies does GrantSetu track?",
    a: "GrantSetu tracks grants from DBT (Department of Biotechnology), DST (Department of Science & Technology), ICMR (Indian Council of Medical Research), ANRF/SERB (Anusandhan National Research Foundation), BIRAC, CSIR, UGC (University Grants Commission), and Ministry of AYUSH.",
  },
  {
    q: "Is GrantSetu free to use?",
    a: "Yes, GrantSetu is completely free. There is no premium tier, no paywall, and no hidden charges. It was built by a PhD researcher for the Indian research community.",
  },
  {
    q: "How often is GrantSetu updated?",
    a: "GrantSetu is updated daily. Automated systems check all 8 agency portals every day for new grant calls, updated deadlines, and closed grants.",
  },
  {
    q: "Can I get email alerts for new grants?",
    a: "Yes. Visit the Alerts page to set up free email notifications. Choose your subject areas, career stage, and preferred agencies — you'll receive matching grants weekly or daily without needing an account.",
  },
  {
    q: "What types of grants are available for early career researchers in India?",
    a: "Key schemes for early career researchers include ANRF PM-ECRG (Prime Minister's Early Career Research Grant), ANRF CRG (Core Research Grant), DST INSPIRE Faculty Award, UGC Start-Up Grants for newly recruited faculty, and CSIR Extramural Research grants.",
  },
  {
    q: "Are there grants specifically for women scientists in India?",
    a: "Yes. Major women-specific schemes include DST WOS-A (Women Scientist Scheme), DBT BioCARe (Career Development Programme for Women Scientists), ANRF POWER, and ANRF SERB-SURE. GrantSetu lets you filter grants by eligibility for women scientists.",
  },
  {
    q: "What is ANRF? Is it the same as SERB?",
    a: "ANRF (Anusandhan National Research Foundation) replaced SERB (Science and Engineering Research Board) in 2023. All former SERB schemes like CRG, MATRICS, and SUPRA now operate under ANRF. The application portal is anrfonline.in.",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ_DATA.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: { "@type": "Answer", text: item.a },
  })),
};

export default function HomePage() {
  return (
    <div>
      {/* ── Hero — indicium.ai: full-screen video background, centered text ── */}
      <section className="relative -mt-[var(--nav-height)] min-h-screen flex flex-col items-center justify-center overflow-hidden">
        {/* Background video */}
        <div className="hero-video-wrap">
          <video
            autoPlay
            loop
            muted
            playsInline
            poster="/images/hero-poster.avif"
            className="w-full h-full object-cover"
          >
            <source src="https://cdn.prod.website-files.com/695fda9a67d79f8741c387ba%2F698b52840203b97b117c8e5c_backplate-copmressed_mp4.mp4" type="video/mp4" />
            <source src="https://cdn.prod.website-files.com/695fda9a67d79f8741c387ba%2F698b52840203b97b117c8e5c_backplate-copmressed_webm.webm" type="video/webm" />
          </video>
        </div>
        {/* Overlay */}
        <div className="hero-video-overlay" />

        {/* Hero content */}
        <div className="relative z-10 max-w-[900px] mx-auto px-4 sm:px-6 text-center">
          {/* Pill label */}
          <div className="mb-8 opacity-0 animate-fade-in-up" style={{ animationDelay: "0.2s", animationFillMode: "forwards" }}>
            <span className="label-pill">
              India&apos;s Grant Discovery Platform
            </span>
          </div>

          {/* Main heading */}
          <h1
            className="text-[2.75rem] sm:text-[3.5rem] lg:text-[4.5rem] text-white leading-[1.05] tracking-[-0.03em] opacity-0 animate-fade-in-up"
            style={{ fontFamily: "var(--font-display)", animationDelay: "0.4s", animationFillMode: "forwards" }}
          >
            Research Grants,{" "}
            <br className="hidden sm:block" />
            Discovered
          </h1>

          {/* Subtitle */}
          <p
            className="mt-6 text-[17px] sm:text-[19px] text-white/60 max-w-[580px] mx-auto leading-[1.6] opacity-0 animate-fade-in-up"
            style={{ animationDelay: "0.6s", animationFillMode: "forwards" }}
          >
            Aggregating active grant calls from DBT, DST, ICMR, ANRF, BIRAC, CSIR, UGC & AYUSH — so you never miss a funding opportunity.
          </p>

          {/* CTAs — indicium.ai: solid + outline */}
          <div
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 opacity-0 animate-fade-in-up"
            style={{ animationDelay: "0.8s", animationFillMode: "forwards" }}
          >
            <Link href="/grants" className="btn-primary w-full sm:w-auto">
              Browse Grants
            </Link>
            <Link href="/alerts" className="btn-secondary w-full sm:w-auto">
              Set Up Alerts
            </Link>
          </div>
        </div>

        {/* Bottom text — indicium.ai "Trusted by..." */}
        <div className="absolute bottom-8 left-0 right-0 z-10 text-center opacity-0 animate-fade-in" style={{ animationDelay: "1.2s", animationFillMode: "forwards" }}>
          <p className="text-[13px] text-white/40 tracking-wide" style={{ fontFamily: "var(--font-mono)" }}>
            Tracking grants from 8+ official Indian government agency portals.
          </p>
        </div>
      </section>

      {/* ── Keyline separator ── */}
      <div className="keyline" />

      {/* ── Trusted agencies — logo strip with dark bg ── */}
      <section className="bg-[#05073F] py-16 sm:py-20">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <p
            className="text-center text-[11px] tracking-[0.15em] uppercase mb-10 text-white/30"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            Aggregating grants from official Indian government portals
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
            {AGENCIES.map((agency) => (
              <AgencyLogo key={agency} agency={agency} variant="card" showName={true} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Statement section — indicium.ai scroll-reveal style ── */}
      <section className="bg-white py-24 sm:py-32">
        <div className="max-w-[900px] mx-auto px-4 sm:px-6 text-center">
          <span className="label-pill mb-8 inline-flex">How It Works</span>
          <h2
            className="text-[2rem] sm:text-[2.75rem] lg:text-[3.25rem] leading-[1.1] tracking-[-0.02em] text-[#05073F]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Stop checking 10 websites.{" "}
            <span className="text-[#BBBAFB]">
              We aggregate every active grant call from India&apos;s top funding agencies
            </span>{" "}
            into one searchable platform.
          </h2>
        </div>
      </section>

      {/* ── How it works — 4 cards on navy ── */}
      <section className="bg-[#05073F] py-24 sm:py-32 dot-grid-bg">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="text-center max-w-[600px] mx-auto mb-16">
            <span className="label-pill mb-6 inline-flex">Process</span>
            <h2
              className="text-[2rem] sm:text-[2.5rem] text-white leading-tight tracking-[-0.02em]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              From Search to Application
            </h2>
            <p className="mt-4 text-white/50 text-[17px] leading-relaxed">
              Four simple steps to never miss a funding opportunity
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { num: "01", title: "Discover", desc: "We aggregate grant calls from 8+ official government agency portals — updated daily.", icon: "M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" },
              { num: "02", title: "Filter & Match", desc: "Search by agency, subject area, career stage, budget, and deadline.", icon: "M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z" },
              { num: "03", title: "Get Alerts", desc: "Set up free email alerts — matched grants delivered to your inbox.", icon: "M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" },
              { num: "04", title: "Apply", desc: "Click through to the official portal. Never miss a deadline again.", icon: "M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" },
            ].map((step) => (
              <div key={step.num} className="card-dark">
                <div className="w-12 h-12 rounded-xl bg-[#2451F3]/10 border border-[#2451F3]/20 text-[#2451F3] flex items-center justify-center mb-5">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={step.icon} />
                  </svg>
                </div>
                <span className="text-[11px] tracking-[0.1em] text-[#BBBAFB]/60 uppercase" style={{ fontFamily: "var(--font-mono)" }}>
                  Step {step.num}
                </span>
                <h3 className="text-lg font-medium text-white mt-1.5 mb-3" style={{ fontFamily: "var(--font-display)" }}>{step.title}</h3>
                <p className="text-white/40 text-[14px] leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features — 2x2 grid on white ── */}
      <section className="py-24 sm:py-32">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="text-center max-w-[600px] mx-auto mb-16">
            <span className="label-pill mb-6 inline-flex">Features</span>
            <h2
              className="text-[2rem] sm:text-[2.5rem] text-[#05073F] leading-tight tracking-[-0.02em]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Built for Indian Researchers
            </h2>
            <p className="mt-4 text-gray-500 text-[17px] leading-relaxed">
              Everything you need to discover and apply for government research grants
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              { title: "8+ Agencies, One Search", desc: "DBT, DST, ICMR, ANRF, BIRAC, CSIR, UGC, AYUSH — stop checking 10 different websites.", icon: "M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" },
              { title: "Free Email Alerts", desc: "Get matched grants in your inbox — choose your subject, career stage, and frequency.", icon: "M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" },
              { title: "NE India Friendly", desc: "Built by a PhD researcher from Tripura. Special focus on grants for Northeast India institutions.", icon: "M15 10.5a3 3 0 11-6 0 3 3 0 016 0z M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" },
              { title: "Always Updated", desc: "Automated daily checks across all agency portals. Deadlines refresh automatically.", icon: "M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" },
            ].map((feature) => (
              <div key={feature.title} className="group rounded-2xl p-8 border border-gray-100 hover:border-[#2451F3]/20 hover:shadow-xl transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-[#05073F] text-[#BBBAFB] flex items-center justify-center mb-5 group-hover:bg-[#2451F3] group-hover:text-white transition-colors duration-300">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={feature.icon} />
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-[#05073F] mb-2" style={{ fontFamily: "var(--font-display)" }}>{feature.title}</h3>
                <p className="text-gray-500 text-[15px] leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats — on navy ── */}
      <section className="bg-[#05073F] py-20 sm:py-24">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="keyline mb-16" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
            {[
              { value: "8+", label: "Agencies Tracked" },
              { value: "Daily", label: "Update Frequency" },
              { value: "Free", label: "Always & Forever" },
              { value: "NE", label: "India-First Focus" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-4xl sm:text-5xl font-medium text-white tracking-tight" style={{ fontFamily: "var(--font-display)" }}>{stat.value}</p>
                <p className="mt-2 text-[12px] tracking-[0.1em] uppercase text-white/40" style={{ fontFamily: "var(--font-mono)" }}>{stat.label}</p>
              </div>
            ))}
          </div>
          <div className="keyline mt-16" />
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-24 sm:py-32">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="text-center max-w-[600px] mx-auto mb-14">
            <span className="label-pill mb-6 inline-flex">FAQ</span>
            <h2
              className="text-[2rem] sm:text-[2.5rem] text-[#05073F] leading-tight tracking-[-0.02em]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Frequently Asked Questions
            </h2>
          </div>
          <div className="max-w-3xl mx-auto divide-y divide-gray-100">
            {FAQ_DATA.map((item, i) => (
              <details key={i} className="group py-6">
                <summary className="flex items-center justify-between cursor-pointer list-none">
                  <h3 className="text-[15px] font-medium text-[#05073F] pr-4">{item.q}</h3>
                  <svg className="h-5 w-5 text-[#BBBAFB] flex-shrink-0 transition-transform duration-200 group-open:rotate-180" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12.53 16.28a.75.75 0 01-1.06 0l-7.5-7.5a.75.75 0 011.06-1.06L12 14.69l6.97-6.97a.75.75 0 111.06 1.06l-7.5 7.5z" clipRule="evenodd" />
                  </svg>
                </summary>
                <p className="mt-3 text-gray-500 leading-relaxed text-[14px]">{item.a}</p>
              </details>
            ))}
          </div>
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
        </div>
      </section>

      {/* ── CTA — full navy with dot grid ── */}
      <section className="bg-[#05073F] py-24 sm:py-32 dot-grid-bg">
        <div className="max-w-[700px] mx-auto px-4 sm:px-6 text-center">
          <span className="label-pill mb-8 inline-flex">Get Started</span>
          <h2
            className="text-[2rem] sm:text-[2.5rem] text-white leading-tight tracking-[-0.02em]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Stop Checking 10 Websites for Grants
          </h2>
          <p className="mt-5 text-[17px] text-white/50 max-w-[500px] mx-auto leading-relaxed">
            Set up email alerts and get matched grants delivered to your inbox every week — completely free.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/grants" className="btn-primary w-full sm:w-auto">
              Browse Grants
            </Link>
            <Link href="/alerts" className="btn-secondary w-full sm:w-auto">
              Set Up Alerts
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
