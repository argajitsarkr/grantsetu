import { daysUntil, formatDate } from "@/lib/constants";

interface DeadlineBadgeProps {
  deadline: string | null;
  deadlineText: string | null;
}

export default function DeadlineBadge({ deadline, deadlineText }: DeadlineBadgeProps) {
  if (!deadline) {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-medium bg-blue-50 text-[#E9283D] border border-blue-200" style={{ fontFamily: "var(--font-mono)" }}>
        {deadlineText || "Open / Rolling"}
      </span>
    );
  }

  const days = daysUntil(deadline);

  if (days < 0) {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-medium bg-brand-50 text-brand-400 line-through border border-brand-200" style={{ fontFamily: "var(--font-mono)" }}>
        Expired {formatDate(deadline)}
      </span>
    );
  }

  if (days <= 7) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-red-50 text-red-700 border border-red-200" style={{ fontFamily: "var(--font-mono)" }}>
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
        </span>
        {days === 0 ? "Due today" : `${days}d left`}
      </span>
    );
  }

  if (days <= 30) {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200" style={{ fontFamily: "var(--font-mono)" }}>
        {days}d left &middot; {formatDate(deadline)}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-medium bg-teal-50 text-teal-700 border border-teal-200" style={{ fontFamily: "var(--font-mono)" }}>
      {formatDate(deadline)}
    </span>
  );
}
