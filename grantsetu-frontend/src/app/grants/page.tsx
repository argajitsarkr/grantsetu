import { Suspense } from "react";
import { fetchGrants } from "@/lib/api";
import type { GrantFilters as FiltersType } from "@/types";
import GrantCard from "@/components/GrantCard";
import GrantFilters from "@/components/GrantFilters";
import SearchBar from "@/components/SearchBar";
import Pagination from "@/components/Pagination";

export const metadata = {
  title: "Browse Indian Research Grants — DBT, DST, ICMR, ANRF, BIRAC, CSIR, UGC",
  description:
    "Search and filter active Indian government research grant calls. Filter by agency (DBT, DST, ICMR, ANRF, BIRAC, CSIR, UGC, AYUSH), subject area, career stage, budget, and deadline. Updated daily from official portals.",
  alternates: {
    canonical: "https://grantsetu.in/grants",
  },
  openGraph: {
    title: "Browse Indian Research Grants — GrantSetu",
    description: "Search active grant calls from 8 Indian funding agencies. Filter by subject, career stage, budget & deadline.",
    url: "https://grantsetu.in/grants",
  },
};

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function GrantsPage({ searchParams }: PageProps) {
  const params = await searchParams;

  const filters: FiltersType = {
    agency: params.agency
      ? Array.isArray(params.agency) ? params.agency : [params.agency]
      : undefined,
    status: (params.status as string) || "active",
    career_stage: params.career_stage as string,
    subject_area: params.subject_area as string,
    deadline: params.deadline as string,
    search: params.search as string,
    sort: (params.sort as string) || "deadline_asc",
    page: params.page ? Number(params.page) : 1,
    per_page: 20,
  };

  let data;
  let error = false;

  try {
    data = await fetchGrants(filters);
  } catch {
    error = true;
  }

  return (
    <div className="container-main pt-12 pb-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-display-sm font-bold text-[#05073F] tracking-heading" style={{ fontFamily: "var(--font-display)" }}>Research Grants</h1>
        <p className="text-sm text-brand-500 mt-1">
          {data ? `${data.total} grants found` : "Browse active grant calls from Indian funding agencies"}
        </p>
      </div>

      {/* Search */}
      <div className="mb-6">
        <Suspense fallback={<div className="h-12 bg-brand-50 rounded-xl animate-pulse" />}>
          <SearchBar />
        </Suspense>
      </div>

      <div className="flex gap-8">
        <Suspense fallback={null}>
          <GrantFilters />
        </Suspense>

        <div className="flex-1 min-w-0">
          {error ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-brand-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="h-8 w-8 text-brand-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <p className="text-brand-500">Unable to load grants. Please try again later.</p>
            </div>
          ) : data && data.items.length > 0 ? (
            <>
              <div className="space-y-4">
                {data.items.map((grant) => (
                  <GrantCard key={grant.id} grant={grant} />
                ))}
              </div>
              <Suspense fallback={null}>
                <Pagination page={data.page} pages={data.pages} total={data.total} />
              </Suspense>
            </>
          ) : (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-brand-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="h-8 w-8 text-brand-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-sm font-semibold text-[#05073F]" style={{ fontFamily: "var(--font-display)" }}>No grants found</h3>
              <p className="mt-1 text-sm text-brand-400">Try adjusting your filters or search query.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
