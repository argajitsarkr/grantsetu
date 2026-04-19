import Link from "next/link";
import { AGENCIES, PRIMARY_AGENCIES } from "@/lib/constants";
import AgencyLogo from "@/components/AgencyLogo";

/* ── FAQ data - Life Sci / Biotech focus ── */
const FAQ_DATA = [
  {
    q: "What is GrantSetu?",
    a: "GrantSetu is India's #1 free grant discovery platform for Life Sciences and Biotechnology researchers. It aggregates active grant calls from DBT, BIRAC, ICMR and allied agencies - the agencies that fund biotech, biomedical, and life science research in India - into a single searchable interface, updated daily.",
  },
  {
    q: "Which agencies does GrantSetu track?",
    a: "GrantSetu focuses on agencies relevant to Life Sciences and Biotechnology: DBT (Department of Biotechnology - primary), BIRAC (Biotech Industry Research Assistance Council - primary), ICMR (Indian Council of Medical Research - primary), CSIR (biosciences labs), Ministry of AYUSH, DST (life-sci programmes), and ANRF (cross-disciplinary).",
  },
  {
    q: "Is GrantSetu free to use?",
    a: "Yes, GrantSetu is completely free. There is no premium tier, no paywall, and no hidden charges. It was built by a PhD researcher for the Indian life sciences community.",
  },
  {
    q: "What fields are covered?",
    a: "Molecular Biology, Genetics & Genomics, Cell Biology, Microbiology, Biochemistry, Biotechnology, Immunology, Pharmacology, Neuroscience, Structural Biology, Bioinformatics, Systems Biology, Plant Sciences, Agricultural Biotech, Medical & Clinical Research, Public Health, Drug Discovery, Vaccine Research, Infectious Diseases, Cancer Biology, Stem Cell Research, Synthetic Biology, and Ayurveda / Traditional Medicine.",
  },
  {
    q: "How often is GrantSetu updated?",
    a: "GrantSetu is updated daily. Automated systems check all tracked agency portals every day for new grant calls, updated deadlines, and closed grants.",
  },
  {
    q: "Can I get email alerts for new grants?",
    a: "Yes. Visit the Alerts page to set up free email notifications. Choose your subject areas, career stage, and preferred agencies - you'll receive matching grants weekly or daily.",
  },
  {
    q: "What grants exist for early career life sciences researchers?",
    a: "Key schemes include DBT Ramalingaswami Re-entry Fellowship, DBT-Wellcome India Alliance Early Career Fellowship, BIRAC BIG (Biotechnology Ignition Grant), ICMR Research Associate, ANRF PM-ECRG (Prime Minister's Early Career Research Grant), and DST INSPIRE Faculty Award.",
  },
  {
    q: "Are there grants specifically for women in biotech?",
    a: "Yes. Major schemes include DBT BioCARe (Career Development Programme for Women Scientists), DST WOS-A (Women Scientist Scheme), DBT-Wellcome India Alliance Women in Science programme, and ANRF POWER. GrantSetu lets you filter by eligibility for women scientists.",
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
      {/* ── Hero - NUUK: huge bold black on white ── */}
      <section className="relative bg-white pt-6 pb-10 sm:pt-14 sm:pb-16 overflow-hidden">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Label pill */}
          <div className="mb-4 sm:mb-5 opacity-0 animate-fade-in-up" style={{ animationDelay: "0.1s", animationFillMode: "forwards" }}>
            <span className="label-pill">Life Sciences · Biotechnology</span>
          </div>

          {/* Giant display heading - NUUK style */}
          <h1
            className="heading-display text-[1.85rem] sm:text-[3.5rem] lg:text-[5rem] text-black opacity-0 animate-fade-in-up"
            style={{ animationDelay: "0.2s", animationFillMode: "forwards" }}
          >
            India&apos;s <span className="text-[#E9283D]">Grant Engine</span>
            <br />
            for Life Sciences
            <br />
            &amp; Biotech.
          </h1>

          {/* Subtitle */}
          <p
            className="mt-4 sm:mt-6 text-[14px] sm:text-[18px] text-gray-600 max-w-[680px] leading-[1.5] opacity-0 animate-fade-in-up"
            style={{ animationDelay: "0.4s", animationFillMode: "forwards", fontFamily: "var(--font-body)" }}
          >
            Every active grant call from <span className="font-bold text-black">DBT, BIRAC, ICMR</span> and allied
            agencies - curated daily for biotech, biomedical &amp; life science researchers.
          </p>

          {/* CTAs */}
          <div
            className="mt-5 sm:mt-7 flex flex-col sm:flex-row items-start gap-3 sm:gap-4 opacity-0 animate-fade-in-up"
            style={{ animationDelay: "0.6s", animationFillMode: "forwards" }}
          >
            <Link href="/grants" className="btn-primary">
              Browse Grants →
            </Link>
            <Link href="/newsletter" className="btn-secondary">
              Get Weekly Newsletter
            </Link>
          </div>

          {/* Mono tagline bottom */}
          <div
            className="mt-10 flex flex-col sm:flex-row items-start gap-6 sm:items-center sm:gap-12 opacity-0 animate-fade-in"
            style={{ animationDelay: "1s", animationFillMode: "forwards" }}
          >
            <div>
              <p className="text-[11px] uppercase tracking-[0.2em] text-gray-500 mb-1" style={{ fontFamily: "var(--font-mono)" }}>
                Primary Agencies
              </p>
              <p className="text-[15px] font-bold text-black" style={{ fontFamily: "var(--font-mono)" }}>
                DBT · BIRAC · ICMR
              </p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.2em] text-gray-500 mb-1" style={{ fontFamily: "var(--font-mono)" }}>
                Updated
              </p>
              <p className="text-[15px] font-bold text-black" style={{ fontFamily: "var(--font-mono)" }}>
                Every 24 Hours
              </p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.2em] text-gray-500 mb-1" style={{ fontFamily: "var(--font-mono)" }}>
                Cost
              </p>
              <p className="text-[15px] font-bold text-[#E9283D]" style={{ fontFamily: "var(--font-mono)" }}>
                Always Free
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Agencies strip - NUUK black band ── */}
      <section className="bg-black py-20 border-t-2 border-b-2 border-black">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <p
                className="text-[11px] tracking-[0.2em] uppercase text-[#E9283D] mb-3 font-semibold"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                Agencies Tracked
              </p>
              <h2
                className="heading-display text-[2rem] sm:text-[3rem] text-white"
              >
                Life Sci funders,
                <br />
                under one roof.
              </h2>
            </div>
            <p className="text-white/60 text-[15px] max-w-sm">
              Prioritised by relevance to life sciences and biotechnology - not by alphabet.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {AGENCIES.map((agency) => (
              <div
                key={agency}
                className={`relative bg-white rounded-lg p-6 flex flex-col items-center justify-center min-h-[110px] ${
                  PRIMARY_AGENCIES.includes(agency) ? "ring-2 ring-[#E9283D]" : ""
                }`}
              >
                {PRIMARY_AGENCIES.includes(agency) && (
                  <span
                    className="absolute -top-2 right-2 text-[9px] uppercase tracking-wider bg-[#E9283D] text-white px-1.5 py-0.5 rounded-full font-bold"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    Primary
                  </span>
                )}
                <AgencyLogo agency={agency} variant="card" showName={true} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Statement - NUUK oversized quote ── */}
      <section className="bg-white py-28 sm:py-40">
        <div className="max-w-[1100px] mx-auto px-4 sm:px-6">
          <span className="label-pill mb-10 inline-flex">Why GrantSetu</span>
          <h2
            className="heading-display text-[2.25rem] sm:text-[3.5rem] lg:text-[4.5rem] text-black"
          >
            Stop checking <span className="text-[#E9283D]">10 websites</span>.
            Stop missing <span className="text-[#E9283D]">deadlines</span>.
            Start applying to grants that <span className="underline decoration-[#E9283D] decoration-4 underline-offset-4">actually match</span> your research.
          </h2>
        </div>
      </section>

      {/* ── Process - 4 steps, NUUK grid on red ── */}
      <section className="bg-[#E9283D] py-24 sm:py-32">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div>
              <p
                className="text-[11px] tracking-[0.2em] uppercase text-white/80 mb-3 font-semibold"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                Process
              </p>
              <h2 className="heading-display text-[2.25rem] sm:text-[3.25rem] text-white">
                From search to
                <br />
                submission.
              </h2>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0 border-t-2 border-white/30">
            {[
              { num: "01", title: "Discover", desc: "We aggregate grant calls from DBT, BIRAC, ICMR & allied agencies - daily." },
              { num: "02", title: "Filter & Match", desc: "Filter by subject area, career stage, budget, deadline - all life-sci tuned." },
              { num: "03", title: "Get Alerts", desc: "Email alerts for matching grants - weekly or daily, your choice." },
              { num: "04", title: "Apply", desc: "Direct link to the official portal. Never miss a deadline again." },
            ].map((step, i) => (
              <div
                key={step.num}
                className={`p-8 border-b-2 border-white/30 ${i < 3 ? "lg:border-r-2" : ""} ${i !== 3 ? "sm:border-r-2 lg:border-r-2" : ""} border-white/30`}
              >
                <span
                  className="text-[11px] tracking-[0.2em] uppercase text-white/70 font-semibold"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  Step {step.num}
                </span>
                <h3
                  className="heading-display text-[1.75rem] text-white mt-3 mb-3"
                >
                  {step.title}
                </h3>
                <p className="text-white/80 text-[14px] leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features - NUUK 2x2 on white ── */}
      <section className="py-24 sm:py-32 bg-white">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div>
              <span className="label-pill mb-6 inline-flex">Features</span>
              <h2 className="heading-display text-[2.25rem] sm:text-[3.25rem] text-black">
                Built for Indian
                <br />
                biotech researchers.
              </h2>
            </div>
            <p className="text-gray-600 text-[16px] max-w-sm">
              Everything you need to discover, match, and apply for life sciences research grants in India.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-0 border-2 border-black">
            {[
              { title: "Life Sci · Biotech Focus", desc: "DBT, BIRAC, ICMR prioritised - with 24 life sciences subject areas from genomics to synthetic biology." },
              { title: "Free Email Alerts", desc: "Get matched grants in your inbox - choose your subject, career stage, and frequency." },
              { title: "NE India Friendly", desc: "Built by a PhD researcher from Tripura. Special focus on grants for Northeast India institutions." },
              { title: "Daily Updates", desc: "Automated daily checks across all tracked agency portals. Deadlines refresh automatically." },
            ].map((feature, i) => (
              <div
                key={feature.title}
                className={`p-10 border-black ${i < 2 ? "sm:border-b-2" : ""} ${i % 2 === 0 ? "sm:border-r-2" : ""} ${i < 2 && i === 2 - 1 ? "" : ""} border-b-2 sm:border-b-2 group hover:bg-black transition-colors`}
              >
                <div className="w-3 h-3 rounded-full bg-[#E9283D] mb-6" />
                <h3 className="heading-display text-[1.5rem] sm:text-[1.875rem] text-black group-hover:text-white mb-3 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-600 group-hover:text-white/70 text-[15px] leading-relaxed transition-colors">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats - NUUK red band ── */}
      <section className="bg-black py-20 sm:py-24">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-0 border-t-2 border-b-2 border-white/20 divide-x-2 divide-white/20">
            {[
              { value: "7", label: "Agencies Tracked" },
              { value: "24", label: "Life Sci Subjects" },
              { value: "24h", label: "Update Cycle" },
              { value: "₹0", label: "Cost. Forever." },
            ].map((stat) => (
              <div key={stat.label} className="py-12 px-4 text-center">
                <p
                  className="heading-display text-[3rem] sm:text-[4.5rem] text-[#E9283D]"
                >
                  {stat.value}
                </p>
                <p
                  className="mt-2 text-[11px] tracking-[0.2em] uppercase text-white/60 font-semibold"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-24 sm:py-32 bg-white">
        <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-14">
            <span className="label-pill mb-6 inline-flex">FAQ</span>
            <h2 className="heading-display text-[2.25rem] sm:text-[3.25rem] text-black">
              Questions, answered.
            </h2>
          </div>
          <div className="max-w-4xl border-t-2 border-black">
            {FAQ_DATA.map((item, i) => (
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
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
        </div>
      </section>

      {/* ── CTA - NUUK red full-bleed ── */}
      <section className="bg-[#E9283D] py-28 sm:py-36">
        <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="heading-display text-[2.5rem] sm:text-[4.5rem] lg:text-[6rem] text-white">
            Never miss a
            <br />
            biotech grant again.
          </h2>
          <p className="mt-10 text-[18px] sm:text-[20px] text-white/90 max-w-[600px] mx-auto leading-relaxed">
            Join the weekly newsletter and get matched grants delivered every Monday - completely free, forever.
          </p>
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/newsletter"
              className="inline-flex items-center justify-center bg-white text-[#E9283D] px-10 py-4 rounded-lg font-bold text-[15px] uppercase tracking-wider transition-all duration-200 hover:bg-black hover:text-white"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              Subscribe →
            </Link>
            <Link
              href="/grants"
              className="btn-outline-white"
            >
              Browse Grants
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
