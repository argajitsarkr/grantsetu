import Link from "next/link";
import type { GrantListItem } from "@/types";
import AgencyBadge from "./AgencyBadge";
import DeadlineBadge from "./DeadlineBadge";
import ShareButton from "./ShareButton";
import { formatINR, AGENCY_META } from "@/lib/constants";

interface GrantCardProps {
  grant: GrantListItem;
}

export default function GrantCard({ grant }: GrantCardProps) {
  const agencyMeta = AGENCY_META[grant.agency];

  return (
    <article className="card card-hover group !p-4 sm:!p-6">
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <AgencyBadge agency={grant.agency} />
        {grant.scheme_name && (
          <span className="text-xs text-brand-400 font-medium">{grant.scheme_name}</span>
        )}
        <div className="ml-auto">
          <DeadlineBadge deadline={grant.deadline} deadlineText={grant.deadline_text} />
        </div>
      </div>

      <Link href={`/grants/${grant.slug}`}>
        <h3 className="text-base sm:text-lg font-semibold text-[#0A0A0A] md:group-hover:text-accent-500 leading-snug tracking-heading transition-colors" style={{ fontFamily: "var(--font-display)" }}>
          {grant.title}
        </h3>
      </Link>

      {grant.summary && (
        <p className="mt-2 text-sm text-brand-500 line-clamp-2 leading-relaxed">{grant.summary}</p>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-brand-400">
        {(grant.budget_min || grant.budget_max) && (
          <span className="flex items-center gap-1.5 font-medium">
            <svg className="h-3.5 w-3.5 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
            {grant.budget_min && grant.budget_max
              ? `${formatINR(grant.budget_min)} \u2013 ${formatINR(grant.budget_max)}`
              : grant.budget_max
              ? `Up to ${formatINR(grant.budget_max)}`
              : `From ${formatINR(grant.budget_min!)}`}
          </span>
        )}
        {grant.duration_months && (
          <span className="flex items-center gap-1.5 font-medium">
            <svg className="h-3.5 w-3.5 text-brand-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Duration: {grant.duration_months} mo
          </span>
        )}
      </div>

      {grant.subject_areas.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {grant.subject_areas.slice(0, 3).map((area) => (
            <span key={area} className="tag text-[11px]">
              {area}
            </span>
          ))}
          {grant.subject_areas.length > 3 && (
            <span className="text-xs text-brand-300">+{grant.subject_areas.length - 3} more</span>
          )}
        </div>
      )}

      {/* Quick links */}
      <div className="mt-4 pt-3 border-t border-brand-100 flex flex-wrap items-center gap-3">
        <a
          href={grant.notification_url || grant.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-brand-500 hover:text-accent-600 transition-colors"
          title="View original notification"
        >
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Notification
        </a>

        <a
          href={grant.call_url || grant.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-brand-500 hover:text-accent-600 transition-colors"
          title="View call details and templates"
        >
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
          </svg>
          Call Details
        </a>

        {grant.apply_url && (
          <a
            href={grant.apply_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-brand-500 hover:text-accent-600 transition-colors"
            title={`Apply on ${grant.portal_name || 'portal'}`}
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Apply
          </a>
        )}

        {grant.pdf_url && (
          <a
            href={grant.pdf_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-brand-500 hover:text-accent-600 transition-colors"
            title="Download call document (PDF)"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            PDF
          </a>
        )}

        <ShareButton
          url={`https://grantsetu.in/grants/${grant.slug}`}
          title={grant.title}
          deadline={grant.deadline}
          variant="icon-only"
        />

        <Link
          href={`/grants/${grant.slug}`}
          className="ml-auto inline-flex items-center gap-1 text-xs font-semibold text-accent-500 hover:text-accent-700 transition-colors"
        >
          Details
          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </article>
  );
}
