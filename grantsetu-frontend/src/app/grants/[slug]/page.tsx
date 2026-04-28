import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { fetchGrant } from "@/lib/api";
import AgencyBadge from "@/components/AgencyBadge";
import AgencyLogo from "@/components/AgencyLogo";
import DeadlineBadge from "@/components/DeadlineBadge";
import ShareButton from "@/components/ShareButton";
import NewsletterSignup from "@/components/NewsletterSignup";
import { formatINR, formatDate, daysUntil, AGENCY_META } from "@/lib/constants";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const grant = await fetchGrant(slug);
    const desc = grant.summary || `${grant.agency} grant call - ${grant.title}`;
    return {
      title: `${grant.title} - ${grant.agency} Grant`,
      description: desc,
      openGraph: {
        title: `${grant.title} - ${grant.agency}`,
        description: desc,
        type: "article",
        url: `https://grantsetu.in/grants/${slug}`,
        siteName: "GrantSetu",
        images: [{ url: "https://grantsetu.in/og-image.png" }],
      },
      twitter: {
        card: "summary_large_image",
        title: `${grant.title} - ${grant.agency}`,
        description: desc,
        images: ["https://grantsetu.in/og-image.png"],
      },
      alternates: {
        canonical: `https://grantsetu.in/grants/${slug}`,
      },
    };
  } catch {
    return { title: "Grant Not Found" };
  }
}

export default async function GrantDetailPage({ params }: PageProps) {
  const { slug } = await params;
  let grant;

  try {
    grant = await fetchGrant(slug);
  } catch {
    notFound();
  }

  const deadlineDays = grant.deadline ? daysUntil(grant.deadline) : null;

  return (
    <div className="roobert-scope container-main py-8">
      <div className="max-w-4xl">
        {/* Breadcrumb */}
        <nav className="text-sm text-brand-400 mb-6 flex items-center gap-2" aria-label="Breadcrumb">
          <Link href="/grants" className="hover:text-accent-500 transition-colors">Grants</Link>
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-brand-600">{grant.agency}</span>
        </nav>

        <article>
          {/* Header - agency logo + badge */}
          <div className="flex flex-wrap items-start gap-4 mb-5">
            {/* Real agency logo strip */}
            <AgencyLogo agency={grant.agency} variant="full" showName={false} />
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <AgencyBadge agency={grant.agency} />
              {grant.scheme_name && (
                <span className="text-sm font-medium text-brand-400">{grant.scheme_name}</span>
              )}
            </div>
          </div>

          <h1 className="text-display-sm sm:text-display-md font-bold text-[#0A0A0A] tracking-heading leading-tight" style={{ fontFamily: "var(--font-display)" }}>
            {grant.title}
          </h1>

          {grant.summary && (
            <p className="mt-4 text-lg text-brand-500 leading-relaxed">{grant.summary}</p>
          )}

          {/* Key info cards - equal-width flex layout packs cards into a single row */}
          <div className="mt-8 flex flex-wrap gap-4">
            {/* Deadline */}
            <div className="flex-1 min-w-[200px] bg-red-50 border border-red-100 rounded-xl p-5">
              <p className="text-xs font-semibold text-red-400 uppercase tracking-wider" style={{ fontFamily: "var(--font-mono)" }}>Deadline</p>
              <div className="mt-2">
                <DeadlineBadge deadline={grant.deadline} deadlineText={grant.deadline_text} />
              </div>
              {grant.deadline && deadlineDays !== null && deadlineDays > 0 && (
                <p className="mt-2 text-sm text-red-600 font-medium">{deadlineDays} days remaining</p>
              )}
            </div>

            {/* Budget */}
            {(grant.budget_min || grant.budget_max) && (
              <div className="flex-1 min-w-[200px] bg-teal-50 border border-teal-100 rounded-xl p-5">
                <p className="text-xs font-semibold text-teal-500 uppercase tracking-wider" style={{ fontFamily: "var(--font-mono)" }}>Funding</p>
                <p className="mt-2 text-xl font-bold text-teal-700">
                  {grant.budget_min && grant.budget_max
                    ? `${formatINR(grant.budget_min)} \u2013 ${formatINR(grant.budget_max)}`
                    : grant.budget_max
                    ? `Up to ${formatINR(grant.budget_max)}`
                    : formatINR(grant.budget_min!)}
                </p>
              </div>
            )}

            {/* Duration */}
            {grant.duration_months && (
              <div className="flex-1 min-w-[200px] bg-purple-50 border border-purple-100 rounded-xl p-5">
                <p className="text-xs font-semibold text-purple-400 uppercase tracking-wider" style={{ fontFamily: "var(--font-mono)" }}>Duration</p>
                <p className="mt-2 text-xl font-bold text-purple-700">
                  {grant.duration_months} months
                </p>
              </div>
            )}

            {/* Age limit */}
            {grant.age_limit && (
              <div className="flex-1 min-w-[200px] bg-amber-50 border border-amber-100 rounded-xl p-5">
                <p className="text-xs font-semibold text-amber-400 uppercase tracking-wider" style={{ fontFamily: "var(--font-mono)" }}>Age Limit</p>
                <p className="mt-2 text-xl font-bold text-amber-700">
                  {grant.age_limit} years
                </p>
              </div>
            )}
          </div>

          {/* Eligibility */}
          {grant.eligibility_summary && (
            <section className="mt-8">
              <h2 className="text-lg font-bold text-[#0A0A0A] tracking-heading mb-3" style={{ fontFamily: "var(--font-display)" }}>Eligibility</h2>
              <div className="blog-prose text-justify">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{grant.eligibility_summary}</ReactMarkdown>
              </div>
            </section>
          )}

          {/* Description */}
          {grant.description && (
            <section className="mt-8">
              <h2 className="text-lg font-bold text-[#0A0A0A] tracking-heading mb-3" style={{ fontFamily: "var(--font-display)" }}>Description</h2>
              <div className="blog-prose text-justify">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{grant.description}</ReactMarkdown>
              </div>
            </section>
          )}

          {/* Tags */}
          <div className="mt-8 space-y-4">
            {grant.subject_areas.length > 0 && (
              <div>
                <h3 className="text-xs font-semibold text-brand-400 uppercase tracking-wider mb-2" style={{ fontFamily: "var(--font-mono)" }}>Subject Areas</h3>
                <div className="flex flex-wrap gap-2">
                  {grant.subject_areas.map((area) => (
                    <span key={area} className="tag">
                      {area}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {grant.career_stages.length > 0 && (
              <div>
                <h3 className="text-xs font-semibold text-brand-400 uppercase tracking-wider mb-2" style={{ fontFamily: "var(--font-mono)" }}>Career Stages</h3>
                <div className="flex flex-wrap gap-2">
                  {grant.career_stages.map((stage) => (
                    <span key={stage} className="inline-flex items-center px-3 py-1 rounded-pill text-xs font-medium bg-accent-50 text-accent-700 border border-accent-200">
                      {stage}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {grant.institution_types.length > 0 && (
              <div>
                <h3 className="text-xs font-semibold text-brand-400 uppercase tracking-wider mb-2" style={{ fontFamily: "var(--font-mono)" }}>Eligible Institutions</h3>
                <div className="flex flex-wrap gap-2">
                  {grant.institution_types.map((type) => (
                    <span key={type} className="tag">
                      {type}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Important Links - organized section */}
          <section className="mt-10">
            <h2 className="text-lg font-bold text-[#0A0A0A] tracking-heading mb-4" style={{ fontFamily: "var(--font-display)" }}>Important Links</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Original Notification */}
              <a
                href={grant.notification_url || grant.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 rounded-xl border border-brand-200 bg-white hover:border-accent-300 hover:bg-accent-50/50 transition-all group"
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-accent-100 flex items-center justify-center">
                  <svg className="h-5 w-5 text-accent-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-brand-900 group-hover:text-accent-600 transition-colors">Original Notification</p>
                  <p className="text-xs text-brand-400 truncate">Official call for proposals</p>
                </div>
                <svg className="h-4 w-4 text-brand-300 group-hover:text-accent-500 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>

              {/* Call Details Page */}
              <a
                href={grant.call_url || grant.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 rounded-xl border border-brand-200 bg-white hover:border-accent-300 hover:bg-accent-50/50 transition-all group"
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-brand-900 group-hover:text-accent-600 transition-colors">Call Details &amp; Templates</p>
                  <p className="text-xs text-brand-400 truncate">Scheme page with guidelines, templates &amp; documents</p>
                </div>
                <svg className="h-4 w-4 text-brand-300 group-hover:text-accent-500 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>

              {/* Download PDF */}
              {grant.pdf_url && (
                <a
                  href={grant.pdf_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 rounded-xl border border-brand-200 bg-white hover:border-accent-300 hover:bg-accent-50/50 transition-all group"
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                    <svg className="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-brand-900 group-hover:text-accent-600 transition-colors">Download Call Document</p>
                    <p className="text-xs text-brand-400 truncate">PDF notification / guidelines</p>
                  </div>
                  <svg className="h-4 w-4 text-brand-300 group-hover:text-accent-500 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </a>
              )}

              {/* Apply / Login Portal */}
              {grant.apply_url && (
                <a
                  href={grant.apply_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 rounded-xl border border-brand-200 bg-white hover:border-accent-300 hover:bg-accent-50/50 transition-all group"
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-teal-100 flex items-center justify-center">
                    <svg className="h-5 w-5 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-brand-900 group-hover:text-accent-600 transition-colors">Apply / Login{grant.portal_name ? ` - ${grant.portal_name}` : ""}</p>
                    <p className="text-xs text-brand-400 truncate">Go to the application portal to submit</p>
                  </div>
                  <svg className="h-4 w-4 text-brand-300 group-hover:text-accent-500 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              )}
            </div>
          </section>

          {/* Share */}
          <div className="mt-6 flex items-center gap-3">
            <ShareButton url={`https://grantsetu.in/grants/${grant.slug}`} title={grant.title} deadline={grant.deadline} />
          </div>

          {/* Newsletter CTA */}
          <div className="mt-10 rounded-xl border border-brand-100 bg-brand-50 p-5 sm:p-6">
            <p
              className="text-[11px] uppercase tracking-[0.15em] text-accent-600 mb-2 font-semibold"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              Never miss a call
            </p>
            <h3
              className="text-[18px] sm:text-[20px] font-bold text-brand-700 mb-3"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Get every open Indian life-sci grant in your inbox, every Monday.
            </h3>
            <NewsletterSignup variant="inline" source="grant-detail" />
          </div>
        </article>

        {/* JSON-LD: BreadcrumbList - enables breadcrumbs in Google results */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: "https://grantsetu.in" },
                { "@type": "ListItem", position: 2, name: "Grants", item: "https://grantsetu.in/grants" },
                { "@type": "ListItem", position: 3, name: grant.agency, item: `https://grantsetu.in/grants?agency=${grant.agency}` },
                { "@type": "ListItem", position: 4, name: grant.title },
              ],
            }),
          }}
        />
        {/* JSON-LD: Grant structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "GovernmentService",
              name: grant.title,
              description: grant.summary || grant.description,
              provider: {
                "@type": "GovernmentOrganization",
                name: grant.agency,
                ...(grant.agency === "DBT" && { url: "https://dbtindia.gov.in" }),
                ...(grant.agency === "DST" && { url: "https://dst.gov.in" }),
                ...(grant.agency === "ICMR" && { url: "https://icmr.gov.in" }),
                ...(grant.agency === "ANRF" && { url: "https://anrf.gov.in" }),
                ...(grant.agency === "BIRAC" && { url: "https://birac.nic.in" }),
                ...(grant.agency === "CSIR" && { url: "https://csir.res.in" }),
                ...(grant.agency === "UGC" && { url: "https://ugc.gov.in" }),
                ...(grant.agency === "AYUSH" && { url: "https://ayush.gov.in" }),
                areaServed: { "@type": "Country", name: "India" },
              },
              ...(grant.deadline && { availableThrough: grant.deadline }),
              ...(grant.created_at && { datePublished: grant.created_at }),
              ...(grant.updated_at && { dateModified: grant.updated_at }),
              url: `https://grantsetu.in/grants/${slug}`,
              serviceType: "Research Grant",
              audience: {
                "@type": "EducationalAudience",
                educationalRole: grant.career_stages?.join(", ") || "Researcher",
              },
              ...(grant.budget_max && {
                offers: {
                  "@type": "Offer",
                  price: grant.budget_max,
                  priceCurrency: "INR",
                  description: "Maximum grant funding amount",
                },
              }),
              isAccessibleForFree: true,
              areaServed: { "@type": "Country", name: "India" },
            }),
          }}
        />
      </div>
    </div>
  );
}
