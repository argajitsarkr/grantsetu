"use client";
import Image from "next/image";
import { useState } from "react";
import { AGENCY_META, AGENCY_COLORS } from "@/lib/constants";

interface AgencyLogoProps {
  agency: string;
  /** "badge" = small pill for cards, "card" = medium square for landing, "full" = wide logo strip */
  variant?: "badge" | "card" | "full";
  className?: string;
  showName?: boolean;
}

/** Fallback colored text badge used when the image fails to load */
function AgencyTextBadge({ agency, className = "" }: { agency: string; className?: string }) {
  const colors = AGENCY_COLORS[agency] || "bg-brand-50 text-brand-700 border-brand-200";
  return (
    <span
      className={`inline-flex items-center justify-center px-3 py-1 rounded-lg text-xs font-bold border ${colors} ${className}`}
    >
      {agency}
    </span>
  );
}

export default function AgencyLogo({
  agency,
  variant = "badge",
  className = "",
  showName = false,
}: AgencyLogoProps) {
  const [imgError, setImgError] = useState(false);
  const meta = AGENCY_META[agency];

  /* ── If no metadata or image failed, fall back to text badge ── */
  if (!meta || imgError) {
    if (variant === "card") {
      return (
        <div className={`flex flex-col items-center gap-2 ${className}`}>
          <AgencyTextBadge agency={agency} className="text-sm px-4 py-2" />
          {showName && (
            <span className="text-xs text-brand-400 text-center leading-tight">
              {meta?.fullName ?? agency}
            </span>
          )}
        </div>
      );
    }
    return <AgencyTextBadge agency={agency} className={className} />;
  }

  /* ── Badge variant: small inline pill with tiny logo ── */
  if (variant === "badge") {
    const colors = AGENCY_COLORS[agency] || "bg-brand-50 text-brand-700 border-brand-200";
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-xs font-semibold border ${colors} ${className}`}
      >
        <span className="relative w-4 h-4 flex-shrink-0 overflow-hidden rounded-sm">
          <Image
            src={meta.logo}
            alt={`${agency} logo`}
            fill
            className="object-contain"
            onError={() => setImgError(true)}
            unoptimized={meta.logotype === "svg"}
          />
        </span>
        {agency}
      </span>
    );
  }

  /* ── Card variant: square logo card for landing page grid ── */
  if (variant === "card") {
    return (
      <div
        className={`flex flex-col items-center gap-3 p-5 bg-white rounded-2xl border border-brand-100 hover:border-brand-200 hover:shadow-md transition-all duration-200 ${className}`}
      >
        <div className="relative w-24 h-14 flex-shrink-0">
          <Image
            src={meta.logo}
            alt={`${agency} logo`}
            fill
            className="object-contain"
            onError={() => setImgError(true)}
            unoptimized={meta.logotype === "svg"}
          />
        </div>
        <div className="text-center">
          <p className="text-sm font-bold text-brand-800">{agency}</p>
          {showName && (
            <p className="text-[10px] text-brand-400 leading-tight mt-0.5 max-w-[120px]">
              {meta.fullName}
            </p>
          )}
        </div>
      </div>
    );
  }

  /* ── Full variant: wide logo strip for headers/detail pages ── */
  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      <div className="relative w-32 h-10 flex-shrink-0">
        <Image
          src={meta.logo}
          alt={`${agency} logo`}
          fill
          className="object-contain object-left"
          onError={() => setImgError(true)}
          unoptimized={meta.logotype === "svg"}
        />
      </div>
      {showName && (
        <span className="text-sm font-semibold text-brand-700">{meta.fullName}</span>
      )}
    </div>
  );
}
