import Link from "next/link";
import Image from "next/image";
import { AGENCIES, AGENCY_META } from "@/lib/constants";
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

/* ── How it works steps ── */
const STEPS = [
  {
    num: "01",
    title: "Discover",
    desc: "We aggregate grant calls from 8+ official Indian government agency portals — updated daily.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
      </svg>
    ),
  },
  {
    num: "02",
    title: "Filter & Match",
    desc: "Search by agency, subject area, career stage, budget, and deadline. All filters are URL-shareable.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z" />
      </svg>
    ),
  },
  {
    num: "03",
    title: "Get Alerts",
    desc: "Set up free email alerts — get matched grants delivered to your inbox weekly or daily.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
      </svg>
    ),
  },
  {
    num: "04",
    title: "Apply",
    desc: "Click through to the official portal. Never miss a deadline again.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
      </svg>
    ),
  },
];

/* ── Features ── */
const FEATURES = [
  {
    title: "8+ Agencies, One Search",
    desc: "DBT, DST, ICMR, ANRF, BIRAC, CSIR, UGC, AYUSH — stop checking 10 different websites.",
    icon: "M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21",
  },
  {
    title: "Free Email Alerts",
    desc: "Get matched grants in your inbox — choose your subject, career stage, and frequency.",
    icon: "M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75",
  },
  {
    title: "NE India Friendly",
    desc: "Built by a PhD researcher from Tripura. Special focus on grants available to Northeast India institutions.",
    icon: "M15 10.5a3 3 0 11-6 0 3 3 0 016 0z M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z",
  },
  {
    title: "Always Updated",
    desc: "Automated daily checks across all agency portals. Deadlines refresh automatically.",
    icon: "M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182",
  },
];

export default function HomePage() {
  return (
    <div>
      {/* ── Hero — ChatSpark style: clean white, large heading ── */}
      <section className="py-20 sm:py-28 lg:py-32">
        <div className="container-main">
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
            {/* Eyebrow pill */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 rounded-full text-[13px] font-medium text-blue-700 mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
              Updated daily from 8+ official agency portals
            </div>

            {/* Main heading */}
            <h1 className="text-[2.5rem] sm:text-[3.25rem] lg:text-[4rem] font-extrabold text-gray-900 leading-[1.05] tracking-tight">
              <span className="text-gray-500">Discover Indian Research Grants.</span>
              {" "}All in One Place.
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-gray-500 max-w-xl leading-relaxed">
              GrantSetu aggregates active grant calls from DBT, DST, ICMR, ANRF, BIRAC, CSIR, UGC, and AYUSH — so you don&apos;t have to check 10 websites.
            </p>

            {/* CTAs */}
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/grants"
                className="inline-flex items-center justify-center h-12 px-8 bg-blue-500 text-white text-[15px] font-semibold rounded-lg hover:bg-blue-600 active:bg-blue-700 transition-all duration-150 w-full sm:w-auto"
              >
                Get Started Free
              </Link>
              <Link
                href="/alerts"
                className="inline-flex items-center justify-center h-12 px-8 border border-gray-200 text-gray-800 text-[15px] font-semibold rounded-lg hover:bg-gray-50 transition-all duration-150 w-full sm:w-auto"
              >
                Set Up Email Alerts
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="mt-8 flex flex-wrap justify-center gap-4 text-[13px] text-gray-400">
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                </svg>
                100% Free
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                </svg>
                No account required
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                </svg>
                8+ agencies tracked
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Agency logos — ChatSpark trusted-by strip ── */}
      <section className="py-12 border-y border-gray-100">
        <div className="container-main">
          <p className="text-center text-xs font-semibold text-gray-400 uppercase tracking-[0.15em] mb-8">
            Aggregating grants from official Indian government portals
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
            {AGENCIES.map((agency) => (
              <AgencyLogo key={agency} agency={agency} variant="card" showName={true} />
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works — 4-step process (ChatSpark workflow style) ── */}
      <section className="section-padding bg-gray-50">
        <div className="container-main">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-blue-600 text-sm font-semibold mb-3 uppercase tracking-wider">How It Works</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
              From Search to Application in Minutes
            </h2>
            <p className="mt-4 text-gray-500 text-lg">
              Four simple steps to never miss a funding opportunity
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {STEPS.map((step) => (
              <div key={step.num} className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg hover:border-gray-200 transition-all duration-200">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                  {step.icon}
                </div>
                <span className="text-xs font-bold text-gray-300 uppercase tracking-wider">Step {step.num}</span>
                <h3 className="text-lg font-bold text-gray-900 mt-1 mb-2">{step.title}</h3>
                <p className="text-gray-500 text-[14px] leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features grid — ChatSpark spotlight cards ── */}
      <section className="section-padding">
        <div className="container-main">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-blue-600 text-sm font-semibold mb-3 uppercase tracking-wider">Features</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
              Your Research, Only Smarter
            </h2>
            <p className="mt-4 text-gray-500 text-lg">
              Everything you need to discover and apply for Indian research grants
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {FEATURES.map((feature) => (
              <div key={feature.title} className="bg-gray-50 rounded-2xl p-8 hover:bg-gray-100/80 transition-colors duration-200">
                <div className="w-10 h-10 rounded-xl bg-white border border-gray-200 text-gray-700 flex items-center justify-center mb-5">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={feature.icon} />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-500 text-[15px] leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="py-16 bg-gray-50 border-y border-gray-100">
        <div className="container-main">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
            {[
              { value: "8+", label: "Agencies Tracked" },
              { value: "Daily", label: "Update Frequency" },
              { value: "Free", label: "Always & Forever" },
              { value: "NE", label: "India-First Focus" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-4xl font-extrabold text-gray-900 tracking-tight">{stat.value}</p>
                <p className="mt-1 text-sm text-gray-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ — ChatSpark accordion style ── */}
      <section className="section-padding">
        <div className="container-main">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="text-blue-600 text-sm font-semibold mb-3 uppercase tracking-wider">FAQ</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
              Frequently Asked Questions
            </h2>
          </div>
          <div className="max-w-3xl mx-auto divide-y divide-gray-100">
            {FAQ_DATA.map((item, i) => (
              <details key={i} className="group py-5">
                <summary className="flex items-center justify-between cursor-pointer list-none">
                  <h3 className="text-[15px] font-semibold text-gray-900 pr-4">{item.q}</h3>
                  <svg className="h-5 w-5 text-gray-400 flex-shrink-0 transition-transform duration-200 group-open:rotate-180" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12.53 16.28a.75.75 0 01-1.06 0l-7.5-7.5a.75.75 0 011.06-1.06L12 14.69l6.97-6.97a.75.75 0 111.06 1.06l-7.5 7.5z" clipRule="evenodd" />
                  </svg>
                </summary>
                <p className="mt-3 text-gray-500 leading-relaxed text-[14px]">{item.a}</p>
              </details>
            ))}
          </div>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
          />
        </div>
      </section>

      {/* ── CTA — ChatSpark dark section ── */}
      <section className="bg-[#0F172A] py-20 sm:py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Stop Checking 10 Websites for Grants
          </h2>
          <p className="mt-5 text-lg text-gray-400 max-w-lg mx-auto leading-relaxed">
            Set up email alerts and get matched grants delivered to your inbox every week — completely free.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/grants"
              className="inline-flex items-center justify-center h-12 px-8 bg-blue-500 text-white text-[15px] font-semibold rounded-lg hover:bg-blue-600 transition-all duration-150 w-full sm:w-auto"
            >
              Get Started Free
            </Link>
            <Link
              href="/alerts"
              className="inline-flex items-center justify-center h-12 px-8 border border-gray-600 text-gray-300 text-[15px] font-semibold rounded-lg hover:bg-white/5 transition-all duration-150 w-full sm:w-auto"
            >
              Set Up Alerts
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
