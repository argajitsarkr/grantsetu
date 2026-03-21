import AgencyLogo from "./AgencyLogo";

interface AgencyBadgeProps {
  agency: string;
  className?: string;
}

/** Wraps AgencyLogo in badge variant — keeps existing call-sites unchanged */
export default function AgencyBadge({ agency, className = "" }: AgencyBadgeProps) {
  return <AgencyLogo agency={agency} variant="badge" className={className} />;
}
