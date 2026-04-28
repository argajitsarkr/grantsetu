"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { API_URL } from "@/lib/constants";

interface MeShape {
  institution?: string | null;
  career_stage?: string | null;
  subject_areas?: string[] | null;
  preferred_agencies?: string[] | null;
  research_keywords?: string[] | null;
  onboarding_completed?: boolean;
}

const FIELDS: (keyof MeShape)[] = [
  "institution",
  "career_stage",
  "subject_areas",
  "preferred_agencies",
  "research_keywords",
];

function strength(me: MeShape): number {
  let filled = 0;
  for (const k of FIELDS) {
    const v = me[k];
    if (Array.isArray(v) ? v.length > 0 : !!v) filled++;
  }
  return Math.round((filled / FIELDS.length) * 100);
}

export default function ProfileProgressBanner() {
  const { data: session } = useSession();
  const [me, setMe] = useState<MeShape | null>(null);

  useEffect(() => {
    const token = session?.backendToken;
    if (!token) return;
    let cancelled = false;
    (async () => {
      try {
        const r = await fetch(`${API_URL}/api/v1/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
        });
        if (!r.ok) return;
        const data = (await r.json()) as MeShape;
        if (!cancelled) setMe(data);
      } catch {
        /* hide silently on error - safer than nagging users */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [session?.backendToken]);

  if (!me) return null;
  const pct = strength(me);
  if (me.onboarding_completed && pct >= 80) return null;

  return (
    <div className="bg-[#FFF5CC] border-b-2 border-black px-5 py-3">
      <div className="max-w-[1400px] mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span
              className="text-[10px] uppercase tracking-[0.15em] text-[#E9283D] font-bold"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              Profile {pct}%
            </span>
            <div className="flex-1 h-1.5 bg-black/10 rounded-full max-w-[140px]">
              <div
                className="h-full bg-[#E9283D] rounded-full transition-all"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
          <p className="text-[13px] text-black">
            Finish your profile to unlock personalised grant recommendations.
          </p>
        </div>
        <Link
          href="/onboarding"
          className="h-[36px] inline-flex items-center px-4 bg-black text-white text-[11px] font-bold rounded-md uppercase tracking-wider hover:bg-[#E9283D] transition-colors"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          Complete profile →
        </Link>
      </div>
    </div>
  );
}
