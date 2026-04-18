"use client";

import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import GrantCard from "@/components/GrantCard";
import {
  fetchCurrentUser,
  fetchRecommendedGrants,
  fetchSavedGrants,
  unsaveGrant,
  updateProfile,
} from "@/lib/api";
import type { User, GrantListItem } from "@/types";

const PROFILE_FIELDS: (keyof User)[] = [
  "institution",
  "department",
  "designation",
  "career_stage",
  "subject_areas",
  "research_keywords",
  "preferred_agencies",
  "state",
];

function daysUntil(iso: string | null): number | null {
  if (!iso) return null;
  const d = new Date(iso).getTime();
  const now = Date.now();
  return Math.ceil((d - now) / (1000 * 60 * 60 * 24));
}

function greeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const [recommended, setRecommended] = useState<GrantListItem[]>([]);
  const [saved, setSaved] = useState<GrantListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [alertSaving, setAlertSaving] = useState(false);

  useEffect(() => {
    if (!session?.backendToken) return;
    const token = session.backendToken;
    (async () => {
      try {
        const [u, rec, sv] = await Promise.all([
          fetchCurrentUser(token),
          fetchRecommendedGrants(token).catch(() => []),
          fetchSavedGrants(token).catch(() => []),
        ]);
        setUser(u);
        setRecommended(rec);
        setSaved(sv);
      } catch (err) {
        console.error("Dashboard load failed:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [session]);

  const profileStrength = useMemo(() => {
    if (!user) return 0;
    const filled = PROFILE_FIELDS.filter((f) => {
      const v = user[f];
      if (Array.isArray(v)) return v.length > 0;
      return v !== null && v !== undefined && v !== "";
    }).length;
    return Math.round((filled / PROFILE_FIELDS.length) * 100);
  }, [user]);

  const radar = useMemo(() => {
    const pool = [...saved, ...recommended].filter((g) => g.deadline);
    // Deduplicate by id
    const seen = new Set<number>();
    const unique = pool.filter((g) => (seen.has(g.id) ? false : seen.add(g.id)));
    return unique
      .map((g) => ({ g, days: daysUntil(g.deadline) }))
      .filter((x) => x.days !== null && x.days >= 0 && x.days <= 90)
      .sort((a, b) => (a.days as number) - (b.days as number));
  }, [saved, recommended]);

  const deadlinesWithin30 = radar.filter((r) => (r.days as number) <= 30).length;

  const activity = useMemo(() => {
    const events: { when: string; label: string; href?: string }[] = [];
    saved.slice(0, 6).forEach((g) =>
      events.push({
        when: g.created_at,
        label: `Saved · ${g.title}`,
        href: `/grants/${g.slug}`,
      })
    );
    recommended.slice(0, 4).forEach((g) =>
      events.push({
        when: g.created_at,
        label: `New match · ${g.agency} · ${g.title}`,
        href: `/grants/${g.slug}`,
      })
    );
    return events
      .sort((a, b) => new Date(b.when).getTime() - new Date(a.when).getTime())
      .slice(0, 10);
  }, [saved, recommended]);

  async function toggleAlerts(next: boolean) {
    if (!session?.backendToken || !user) return;
    setAlertSaving(true);
    try {
      const updated = await updateProfile(session.backendToken, { alert_enabled: next });
      setUser(updated);
    } catch (err) {
      console.error(err);
    } finally {
      setAlertSaving(false);
    }
  }

  async function setFrequency(freq: "daily" | "weekly") {
    if (!session?.backendToken) return;
    setAlertSaving(true);
    try {
      const updated = await updateProfile(session.backendToken, { alert_frequency: freq });
      setUser(updated);
    } finally {
      setAlertSaving(false);
    }
  }

  async function handleUnsave(grantId: number) {
    if (!session?.backendToken) return;
    await unsaveGrant(session.backendToken, grantId);
    setSaved((prev) => prev.filter((g) => g.id !== grantId));
  }

  if (loading) {
    return (
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8 py-12">
        <div className="animate-pulse space-y-6">
          <div className="h-10 bg-gray-100 rounded w-1/3" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-gray-100 rounded-xl" />
            ))}
          </div>
          <div className="h-64 bg-gray-100 rounded-xl" />
        </div>
      </div>
    );
  }

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8 py-10">
        {/* ── Greeting strip ── */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            {session?.user?.image ? (
              <Image
                src={session.user.image}
                alt=""
                width={56}
                height={56}
                className="rounded-full border-2 border-black"
              />
            ) : (
              <div className="w-14 h-14 rounded-full bg-[#E9283D] flex items-center justify-center text-white text-xl font-bold border-2 border-black">
                {session?.user?.name?.[0]?.toUpperCase() || "U"}
              </div>
            )}
            <div>
              <h1
                className="text-[2rem] sm:text-[2.5rem] font-black text-black leading-[1.1]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {greeting()},{" "}
                <span className="text-[#E9283D]">
                  {session?.user?.name?.split(" ")[0] || "Researcher"}
                </span>
              </h1>
              <p
                className="text-[12px] uppercase tracking-[0.15em] text-gray-500 mt-1"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {today}
              </p>
            </div>
          </div>
          <Link
            href="/grants"
            className="inline-flex items-center justify-center h-[44px] px-6 bg-[#E9283D] text-white text-[13px] font-bold rounded-lg hover:bg-[#C91E30] uppercase tracking-wider transition-colors"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            Browse All Grants →
          </Link>
        </div>

        {/* ── Stat tiles ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-10">
          <StatTile label="Matched this week" value={recommended.length} accent />
          <StatTile label="Deadlines ≤ 30 days" value={deadlinesWithin30} urgent />
          <StatTile label="Saved" value={saved.length} />
          <StatTile label="Profile strength" value={`${profileStrength}%`} />
        </div>

        {/* ── Main grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: 8/12 */}
          <div className="lg:col-span-8 space-y-8">
            {/* Deadline Radar */}
            <section className="border-2 border-black rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h2
                  className="text-[11px] uppercase tracking-[0.2em] font-bold text-black"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  Deadline Radar · Next 90 days
                </h2>
                <span
                  className="text-[11px] text-gray-500"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  {radar.length} grant{radar.length !== 1 ? "s" : ""}
                </span>
              </div>
              {radar.length === 0 ? (
                <p className="text-sm text-gray-500">
                  No upcoming deadlines — save grants to track them here.
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {radar.slice(0, 24).map(({ g, days }) => {
                    const d = days as number;
                    const cls =
                      d <= 7
                        ? "bg-[#E9283D] text-white border-[#E9283D]"
                        : d <= 30
                        ? "bg-white text-black border-[#E9283D] border-2"
                        : "bg-white text-black border border-black";
                    return (
                      <Link
                        key={g.id}
                        href={`/grants/${g.slug}`}
                        className={`${cls} px-2.5 py-1.5 rounded-md text-[11px] font-bold uppercase tracking-wider flex items-center gap-2 hover:opacity-80`}
                        style={{ fontFamily: "var(--font-mono)" }}
                      >
                        <span>{g.agency}</span>
                        <span className="opacity-60">·</span>
                        <span>{d}d</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </section>

            {/* Recommended */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2
                  className="text-[1.5rem] font-black text-black"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Recommended for you
                </h2>
                <Link
                  href="/grants"
                  className="text-[11px] uppercase tracking-[0.15em] text-[#E9283D] font-bold hover:underline"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  See all →
                </Link>
              </div>
              {recommended.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {recommended.slice(0, 6).map((g) => (
                    <GrantCard key={g.id} grant={g} />
                  ))}
                </div>
              ) : (
                <EmptyCard
                  title="Complete your profile to unlock matches"
                  body="Add your career stage, subject areas, and research keywords so we can recommend grants."
                  cta="Complete Profile"
                  href="/onboarding"
                />
              )}
            </section>

            {/* Saved */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2
                  className="text-[1.5rem] font-black text-black"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Saved grants
                </h2>
                <span
                  className="text-[11px] uppercase tracking-[0.15em] text-gray-500"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  {saved.length} saved
                </span>
              </div>
              {saved.length > 0 ? (
                <div className="border-2 border-black rounded-xl divide-y-2 divide-black">
                  {saved.map((g) => {
                    const d = daysUntil(g.deadline);
                    return (
                      <div
                        key={g.id}
                        className="flex items-center justify-between gap-3 p-4 hover:bg-gray-50"
                      >
                        <div className="min-w-0 flex-1">
                          <Link
                            href={`/grants/${g.slug}`}
                            className="block font-bold text-black text-[14px] leading-snug truncate hover:text-[#E9283D]"
                          >
                            {g.title}
                          </Link>
                          <div
                            className="flex items-center gap-3 mt-1 text-[11px] text-gray-500 uppercase tracking-wider"
                            style={{ fontFamily: "var(--font-mono)" }}
                          >
                            <span className="text-[#E9283D] font-bold">{g.agency}</span>
                            {d !== null && d >= 0 && (
                              <span className={d <= 7 ? "text-[#E9283D] font-bold" : ""}>
                                {d}d left
                              </span>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => handleUnsave(g.id)}
                          className="text-[11px] uppercase tracking-[0.15em] text-gray-500 hover:text-[#E9283D] font-bold"
                          style={{ fontFamily: "var(--font-mono)" }}
                        >
                          Remove
                        </button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <EmptyCard
                  title="Nothing saved yet"
                  body="Browse grants and bookmark the ones you want to track."
                  cta="Browse Grants"
                  href="/grants"
                />
              )}
            </section>

            {/* Activity feed */}
            {activity.length > 0 && (
              <section>
                <h2
                  className="text-[11px] uppercase tracking-[0.2em] font-bold text-black mb-4"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  Recent activity
                </h2>
                <ul className="border-2 border-black rounded-xl divide-y divide-gray-200">
                  {activity.map((e, i) => (
                    <li key={i} className="px-4 py-2.5 flex items-center gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#E9283D] flex-shrink-0" />
                      {e.href ? (
                        <Link
                          href={e.href}
                          className="text-[13px] text-black hover:text-[#E9283D] truncate flex-1"
                        >
                          {e.label}
                        </Link>
                      ) : (
                        <span className="text-[13px] text-black truncate flex-1">{e.label}</span>
                      )}
                      <span
                        className="text-[10px] uppercase tracking-wider text-gray-400 flex-shrink-0"
                        style={{ fontFamily: "var(--font-mono)" }}
                      >
                        {new Date(e.when).toLocaleDateString("en-IN", {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>

          {/* Right: 4/12 */}
          <aside className="lg:col-span-4 space-y-5">
            {/* Profile card */}
            {user && (
              <div className="border-2 border-black rounded-xl p-5">
                <h3
                  className="text-[11px] uppercase tracking-[0.2em] font-bold text-black mb-3"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  Your Profile
                </h3>
                <div className="space-y-2.5 text-sm">
                  {user.institution && (
                    <Row label="Institution" value={user.institution} />
                  )}
                  {user.designation && <Row label="Designation" value={user.designation} />}
                  {user.career_stage && <Row label="Stage" value={user.career_stage} />}
                  {user.subject_areas.length > 0 && (
                    <div>
                      <div
                        className="text-[10px] uppercase tracking-wider text-gray-500 mb-1"
                        style={{ fontFamily: "var(--font-mono)" }}
                      >
                        Subject Areas
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {user.subject_areas.map((a) => (
                          <span
                            key={a}
                            className="px-2 py-0.5 border border-black rounded-full text-[11px] font-bold text-black"
                            style={{ fontFamily: "var(--font-mono)" }}
                          >
                            {a}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <Link
                  href="/profile"
                  className="mt-4 block text-center w-full border-2 border-black rounded-lg py-2 text-[12px] font-bold uppercase tracking-wider hover:bg-black hover:text-white transition-colors"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  Edit Profile
                </Link>
              </div>
            )}

            {/* Notifications card (replaces old /alerts page) */}
            {user && (
              <div className="border-2 border-black rounded-xl p-5">
                <h3
                  className="text-[11px] uppercase tracking-[0.2em] font-bold text-black mb-3"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  Notifications
                </h3>
                <label className="flex items-center justify-between gap-3 mb-4 cursor-pointer">
                  <div>
                    <div className="text-[14px] font-bold text-black">Email digest</div>
                    <div className="text-[12px] text-gray-500">
                      New matched grants sent to your inbox.
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={user.alert_enabled}
                    disabled={alertSaving}
                    onChange={(e) => toggleAlerts(e.target.checked)}
                    className="h-5 w-5 accent-[#E9283D]"
                  />
                </label>
                <div
                  className="text-[10px] uppercase tracking-wider text-gray-500 mb-2"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  Frequency
                </div>
                <div className="flex gap-2">
                  {(["daily", "weekly"] as const).map((f) => (
                    <button
                      key={f}
                      onClick={() => setFrequency(f)}
                      disabled={alertSaving || !user.alert_enabled}
                      className={`flex-1 py-2 text-[11px] font-bold uppercase tracking-wider rounded-lg border-2 transition-colors disabled:opacity-50 ${
                        user.alert_frequency === f
                          ? "bg-black text-white border-black"
                          : "bg-white text-black border-black hover:bg-gray-50"
                      }`}
                      style={{ fontFamily: "var(--font-mono)" }}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Upgrade to Pro */}
            <div className="bg-[#E9283D] text-white rounded-xl p-5 border-2 border-black">
              <div
                className="text-[10px] uppercase tracking-[0.2em] mb-2 opacity-90"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                GrantSetu Pro · ₹299/year
              </div>
              <h3
                className="text-[1.25rem] font-black leading-tight mb-3"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Upgrade for the tools that actually close grants.
              </h3>
              <ul className="space-y-1.5 text-[13px] mb-4">
                {[
                  "Unlimited saved grants",
                  "Deadline calendar (.ics) export",
                  "Weekly personalised PDF digest",
                  "AI eligibility check",
                  "AI concept-note draft",
                  "WhatsApp deadline reminders",
                ].map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <span className="mt-1 w-1.5 h-1.5 rounded-full bg-white flex-shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/newsletter#pro"
                className="block text-center w-full bg-white text-[#E9283D] py-2.5 rounded-lg text-[12px] font-bold uppercase tracking-wider hover:bg-black hover:text-white transition-colors"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                Upgrade — ₹299/year
              </Link>
              <p
                className="mt-3 text-[10px] uppercase tracking-wider opacity-80 text-center"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                Coming soon · Early-bird list open
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function StatTile({
  label,
  value,
  accent,
  urgent,
}: {
  label: string;
  value: number | string;
  accent?: boolean;
  urgent?: boolean;
}) {
  const cls = urgent
    ? "bg-[#E9283D] text-white border-[#E9283D]"
    : accent
    ? "bg-black text-white border-black"
    : "bg-white text-black border-black";
  return (
    <div className={`${cls} border-2 rounded-xl p-4`}>
      <div
        className="text-[10px] uppercase tracking-[0.15em] opacity-80 mb-1"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        {label}
      </div>
      <div
        className="text-[2rem] font-black leading-none"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {value}
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div
        className="text-[10px] uppercase tracking-wider text-gray-500"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        {label}
      </div>
      <div className="text-black font-bold text-[13px]">{value}</div>
    </div>
  );
}

function EmptyCard({
  title,
  body,
  cta,
  href,
}: {
  title: string;
  body: string;
  cta: string;
  href: string;
}) {
  return (
    <div className="border-2 border-dashed border-black rounded-xl p-8 text-center">
      <p
        className="text-[1.1rem] font-bold text-black"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {title}
      </p>
      <p className="text-sm text-gray-600 mt-1 max-w-md mx-auto">{body}</p>
      <Link
        href={href}
        className="inline-block mt-4 bg-[#E9283D] text-white px-5 py-2.5 rounded-lg text-[12px] font-bold uppercase tracking-wider hover:bg-[#C91E30] transition-colors"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        {cta}
      </Link>
    </div>
  );
}
