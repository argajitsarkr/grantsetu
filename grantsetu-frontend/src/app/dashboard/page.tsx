"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import GrantCard from "@/components/GrantCard";
import { fetchCurrentUser, fetchRecommendedGrants, fetchSavedGrants } from "@/lib/api";
import type { User, GrantListItem } from "@/types";

export default function DashboardPage() {
  const { data: session } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const [recommended, setRecommended] = useState<GrantListItem[]>([]);
  const [saved, setSaved] = useState<GrantListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session?.backendToken) return;

    async function loadData() {
      try {
        const [userData, recGrants, savedGrants] = await Promise.all([
          fetchCurrentUser(session!.backendToken!),
          fetchRecommendedGrants(session!.backendToken!).catch(() => []),
          fetchSavedGrants(session!.backendToken!).catch(() => []),
        ]);
        setUser(userData);
        setRecommended(recGrants);
        setSaved(savedGrants);
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [session]);

  if (loading) {
    return (
      <div className="container-main py-12">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-brand-100 rounded w-1/3" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 bg-brand-100 rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-main py-10">
      {/* Welcome header */}
      <div className="flex items-center gap-4 mb-8">
        {session?.user?.image ? (
          <Image
            src={session.user.image}
            alt=""
            width={56}
            height={56}
            className="rounded-full"
          />
        ) : (
          <div className="w-14 h-14 rounded-full bg-accent-500 flex items-center justify-center text-white text-xl font-bold">
            {session?.user?.name?.[0]?.toUpperCase() || "U"}
          </div>
        )}
        <div>
          <h1 className="text-2xl font-bold text-[#05073F]" style={{ fontFamily: "var(--font-display)" }}>
            Welcome back, {session?.user?.name?.split(" ")[0] || "Researcher"}
          </h1>
          <p className="text-brand-500 text-sm">
            Here are grants matched to your research profile
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar — Profile summary */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-brand-200 rounded-2xl p-5 shadow-card sticky top-24">
            <h2 className="text-sm font-semibold text-brand-400 uppercase tracking-wider mb-4" style={{ fontFamily: "var(--font-mono)" }}>
              Your Profile
            </h2>

            {user && (
              <div className="space-y-3 text-sm">
                {user.institution && (
                  <div>
                    <div className="text-brand-400 text-xs">Institution</div>
                    <div className="text-brand-700 font-medium">{user.institution}</div>
                  </div>
                )}
                {user.designation && (
                  <div>
                    <div className="text-brand-400 text-xs">Designation</div>
                    <div className="text-brand-700 font-medium">{user.designation}</div>
                  </div>
                )}
                {user.career_stage && (
                  <div>
                    <div className="text-brand-400 text-xs">Career Stage</div>
                    <div className="text-brand-700 font-medium">{user.career_stage}</div>
                  </div>
                )}
                {user.subject_areas.length > 0 && (
                  <div>
                    <div className="text-brand-400 text-xs mb-1">Subject Areas</div>
                    <div className="flex flex-wrap gap-1">
                      {user.subject_areas.map((a) => (
                        <span key={a} className="px-2 py-0.5 bg-brand-50 text-brand-600 rounded-full text-xs border border-brand-200">
                          {a}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {user.research_keywords.length > 0 && (
                  <div>
                    <div className="text-brand-400 text-xs mb-1">Keywords</div>
                    <div className="flex flex-wrap gap-1">
                      {user.research_keywords.map((k) => (
                        <span key={k} className="px-2 py-0.5 bg-accent-500/10 text-accent-600 rounded-full text-xs">
                          {k}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="mt-5 pt-4 border-t border-brand-100 space-y-2">
              <Link
                href="/profile"
                className="block w-full text-center px-4 py-2 text-sm font-medium border border-brand-200 rounded-xl text-brand-700 hover:bg-brand-50 transition-colors"
              >
                Edit Profile
              </Link>
              <Link
                href="/grants"
                className="block w-full text-center px-4 py-2 text-sm font-medium bg-brand-900 text-white rounded-xl hover:bg-brand-800 transition-colors"
              >
                Browse All Grants
              </Link>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="lg:col-span-3 space-y-10">
          {/* Recommended grants */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-[#05073F]" style={{ fontFamily: "var(--font-display)" }}>
                Recommended for You
              </h2>
              <span className="text-sm text-brand-400">
                {recommended.length} grant{recommended.length !== 1 ? "s" : ""}
              </span>
            </div>

            {recommended.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recommended.map((grant) => (
                  <GrantCard key={grant.id} grant={grant} />
                ))}
              </div>
            ) : (
              <div className="bg-warm-100 border border-warm-300 rounded-2xl p-8 text-center">
                <p className="text-brand-600 font-medium">No recommendations yet</p>
                <p className="text-brand-400 text-sm mt-1">
                  Complete your profile to get personalised grant suggestions
                </p>
                <Link
                  href="/profile"
                  className="inline-block mt-4 px-5 py-2 bg-accent-500 text-white rounded-xl text-sm font-semibold hover:bg-accent-600 transition-colors"
                >
                  Complete Profile
                </Link>
              </div>
            )}
          </section>

          {/* Saved grants */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-[#05073F]" style={{ fontFamily: "var(--font-display)" }}>
                Saved Grants
              </h2>
              <span className="text-sm text-brand-400">
                {saved.length} saved
              </span>
            </div>

            {saved.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {saved.map((grant) => (
                  <GrantCard key={grant.id} grant={grant} />
                ))}
              </div>
            ) : (
              <div className="bg-brand-50 border border-brand-200 rounded-2xl p-6 text-center">
                <p className="text-brand-500 text-sm">
                  No saved grants yet. Browse grants and bookmark the ones you&apos;re interested in.
                </p>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
