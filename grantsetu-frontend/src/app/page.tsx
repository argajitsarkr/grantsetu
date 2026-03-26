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
      {/* ── Hero — ChatSpark exact: muted label, huge heading, subtitle, single CTA ── */}
      <section className="pt-12 pb-6 sm:pt-20 sm:pb-10">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center">
            {/* Small muted label */}
            <div className="mb-4">
              <span className="text-gray-400 text-[15px] font-medium">Meet GrantSetu.</span>
            </div>

            {/* Main heading — ChatSpark: very large, extrabold, tight */}
            <h1 className="max-w-[800px] text-[2.5rem] sm:text-[3.25rem] lg:text-[4rem] font-extrabold text-gray-900 leading-[1.06] tracking-[-0.025em]">
              Your Research Grant Discovery.{" "}
              <br className="hidden sm:block" />
              All in One Place.
            </h1>

            {/* Subtitle — ChatSpark centered, wider */}
            <p className="mt-6 text-[17px] sm:text-[19px] text-gray-500 max-w-[560px] leading-[1.6]">
              Aggregates active grant calls from DBT, DST, ICMR, ANRF, BIRAC, CSIR, UGC, and AYUSH — so you don&apos;t have to check 10 websites. Instantly.
            </p>

            {/* Single CTA — ChatSpark blue rounded pill */}
            <div className="mt-8">
              <Link
                href="/grants"
                className="inline-flex items-center justify-center h-[52px] px-10 bg-blue-500 text-white text-[16px] font-semibold rounded-full hover:bg-blue-600 active:bg-blue-700 transition-all duration-150 shadow-[0_4px_14px_rgba(37,99,235,0.35)]"
              >
                Get Started Free
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Hero image — ChatSpark: full-width gradient with rounded corners ── */}
      <section className="pb-16 sm:pb-24">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative w-full rounded-xl sm:rounded-2xl lg:rounded-3xl overflow-hidden bg-gradient-to-br from-[#c7e8f3] via-[#dce4f8] to-[#e8d5f5]">
            {/* Aspect ratio container — 16:9 */}
            <div className="relative" style={{ paddingBottom: "56.25%" }}>
              <div className="absolute inset-0 flex items-center justify-center p-5 sm:p-8 lg:p-12">
                {/* Grant discovery mockup — wider, more prominent */}
                <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl w-full max-w-[520px] overflow-hidden border border-white/50">
                  {/* Mockup header */}
                  <div className="bg-gray-50 border-b border-gray-100 px-5 py-3 flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <span className="w-3 h-3 rounded-full bg-red-400" />
                      <span className="w-3 h-3 rounded-full bg-yellow-400" />
                      <span className="w-3 h-3 rounded-full bg-green-400" />
                    </div>
                    <span className="text-[12px] text-gray-400 ml-2">grantsetu.in/grants</span>
                  </div>
                  {/* Mockup search */}
                  <div className="px-5 pt-4 pb-3">
                    <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2.5 border border-gray-200">
                      <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      <span className="text-[13px] text-gray-400">Search grants by keyword, agency...</span>
                    </div>
                  </div>
                  {/* Mockup grant cards */}
                  {[
                    { agency: "ANRF", title: "PM Early Career Research Grant", deadline: "Open", color: "bg-emerald-500" },
                    { agency: "DBT", title: "BioCARe Women Scientists Programme", deadline: "15 Apr 2026", color: "bg-blue-500" },
                    { agency: "DST", title: "FIST Infrastructure Grant", deadline: "30 May 2026", color: "bg-purple-500" },
                  ].map((grant, i) => (
                    <div key={i} className="mx-5 mb-3 p-3 border border-gray-100 rounded-xl hover:border-blue-200 transition-colors">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`${grant.color} text-white text-[10px] font-bold px-2 py-0.5 rounded-full`}>{grant.agency}</span>
                            <span className="text-[11px] text-gray-400">{grant.deadline}</span>
                          </div>
                          <p className="text-[13px] font-semibold text-gray-900 truncate">{grant.title}</p>
                        </div>
                        <svg className="w-4 h-4 text-gray-300 flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  ))}
                  <div className="px-5 pb-4">
                    <div className="text-center text-[12px] text-blue-500 font-medium cursor-pointer hover:underline">View all grants →</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Trusted by — agency logos strip ── */}
      <section className="py-12 border-y border-gray-100">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
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

      {/* ── How it works — ChatSpark workflow section ── */}
      <section className="py-20 sm:py-28 bg-gray-50">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="text-center max-w-[600px] mx-auto mb-16">
            <p className="text-blue-600 text-sm font-semibold mb-3 uppercase tracking-wider">How It Works</p>
            <h2 className="text-[2rem] sm:text-[2.5rem] font-extrabold text-gray-900 leading-tight">
              From Search to Application in Minutes
            </h2>
            <p className="mt-4 text-gray-500 text-[17px] leading-relaxed">
              Four simple steps to never miss a funding opportunity
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { num: "01", title: "Discover", desc: "We aggregate grant calls from 8+ official Indian government agency portals — updated daily.", icon: "M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" },
              { num: "02", title: "Filter & Match", desc: "Search by agency, subject area, career stage, budget, and deadline.", icon: "M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z" },
              { num: "03", title: "Get Alerts", desc: "Set up free email alerts — get matched grants delivered to your inbox.", icon: "M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" },
              { num: "04", title: "Apply", desc: "Click through to the official portal. Never miss a deadline again.", icon: "M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" },
            ].map((step) => (
              <div key={step.num} className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg hover:border-gray-200 transition-all duration-200">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={step.icon} />
                  </svg>
                </div>
                <span className="text-[11px] font-bold text-gray-300 uppercase tracking-wider">Step {step.num}</span>
                <h3 className="text-lg font-bold text-gray-900 mt-1 mb-2">{step.title}</h3>
                <p className="text-gray-500 text-[14px] leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features — 2x2 grid ── */}
      <section className="py-20 sm:py-28">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="text-center max-w-[600px] mx-auto mb-16">
            <p className="text-blue-600 text-sm font-semibold mb-3 uppercase tracking-wider">Features</p>
            <h2 className="text-[2rem] sm:text-[2.5rem] font-extrabold text-gray-900 leading-tight">
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
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
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

      {/* ── FAQ ── */}
      <section className="py-20 sm:py-28">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="text-center max-w-[600px] mx-auto mb-14">
            <p className="text-blue-600 text-sm font-semibold mb-3 uppercase tracking-wider">FAQ</p>
            <h2 className="text-[2rem] sm:text-[2.5rem] font-extrabold text-gray-900 leading-tight">
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
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
        </div>
      </section>

      {/* ── CTA — dark section ── */}
      <section className="bg-[#0F172A] py-20 sm:py-24">
        <div className="max-w-[700px] mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-[2rem] sm:text-[2.5rem] font-extrabold text-white leading-tight">
            Stop Checking 10 Websites for Grants
          </h2>
          <p className="mt-5 text-[17px] text-gray-400 max-w-[500px] mx-auto leading-relaxed">
            Set up email alerts and get matched grants delivered to your inbox every week — completely free.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/grants"
              className="inline-flex items-center justify-center h-[52px] px-10 bg-blue-500 text-white text-[16px] font-semibold rounded-full hover:bg-blue-600 transition-all duration-150 shadow-[0_4px_14px_rgba(37,99,235,0.35)] w-full sm:w-auto"
            >
              Get Started Free
            </Link>
            <Link
              href="/alerts"
              className="inline-flex items-center justify-center h-[52px] px-10 border border-gray-600 text-gray-300 text-[16px] font-semibold rounded-full hover:bg-white/5 transition-all duration-150 w-full sm:w-auto"
            >
              Set Up Alerts
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
