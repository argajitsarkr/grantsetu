"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import { AGENCIES, SUBJECT_AREAS, CAREER_STAGES, DEADLINE_FILTERS, SORT_OPTIONS, AGENCY_META } from "@/lib/constants";

export default function GrantFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mobileOpen, setMobileOpen] = useState(false);

  const selectedAgencies = searchParams.getAll("agency");
  const selectedSort = searchParams.get("sort") || "deadline_asc";
  const selectedDeadline = searchParams.get("deadline") || "";
  const selectedCareerStage = searchParams.get("career_stage") || "";
  const selectedSubjectArea = searchParams.get("subject_area") || "";

  function updateFilter(key: string, value: string, isMulti = false) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", "1");

    if (isMulti) {
      const current = params.getAll(key);
      if (current.includes(value)) {
        params.delete(key);
        current.filter((v) => v !== value).forEach((v) => params.append(key, v));
      } else {
        params.append(key, value);
      }
    } else {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    }
    router.push(`/grants?${params.toString()}`);
  }

  function clearFilters() {
    router.push("/grants");
  }

  const hasFilters = selectedAgencies.length > 0 || selectedDeadline || selectedCareerStage || selectedSubjectArea;

  const filterContent = (
    <div className="space-y-6">
      {/* Sort */}
      <div>
        <label className="block text-xs font-semibold text-brand-500 uppercase tracking-wider mb-2" style={{ fontFamily: "var(--font-mono)" }}>Sort by</label>
        <select
          value={selectedSort}
          onChange={(e) => updateFilter("sort", e.target.value)}
          className="w-full bg-brand-50 border border-brand-200 rounded-xl px-3 py-2.5 text-sm text-brand-900 focus:outline-none focus:ring-2 focus:ring-accent-500/20 focus:border-accent-500 transition-all"
          aria-label="Sort grants"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {/* Agency */}
      <div>
        <label className="block text-xs font-semibold text-brand-500 uppercase tracking-wider mb-2" style={{ fontFamily: "var(--font-mono)" }}>Agency</label>
        <div className="space-y-1">
          {AGENCIES.map((agency) => {
            const meta = AGENCY_META[agency];
            const isChecked = selectedAgencies.includes(agency);
            return (
              <label
                key={agency}
                className={`flex items-center gap-2.5 cursor-pointer py-1.5 px-2 rounded-lg group transition-colors ${
                  isChecked ? "bg-brand-50 border border-brand-200" : "hover:bg-brand-50/60"
                }`}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => updateFilter("agency", agency, true)}
                  className="rounded border-brand-300 text-brand-900 focus:ring-accent-500 w-4 h-4 flex-shrink-0"
                />
                {/* Mini logo */}
                {meta ? (
                  <span className="relative w-8 h-5 flex-shrink-0">
                    <Image
                      src={meta.logo}
                      alt={agency}
                      fill
                      className="object-contain"
                      unoptimized={meta.logotype === "svg"}
                    />
                  </span>
                ) : null}
                <span className="text-sm text-brand-600 group-hover:text-brand-900 transition-colors font-medium">
                  {agency}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Subject Area */}
      <div>
        <label className="block text-xs font-semibold text-brand-500 uppercase tracking-wider mb-2" style={{ fontFamily: "var(--font-mono)" }}>Subject Area</label>
        <select
          value={selectedSubjectArea}
          onChange={(e) => updateFilter("subject_area", e.target.value)}
          className="w-full bg-brand-50 border border-brand-200 rounded-xl px-3 py-2.5 text-sm text-brand-900 focus:outline-none focus:ring-2 focus:ring-accent-500/20 focus:border-accent-500 transition-all"
          aria-label="Filter by subject area"
        >
          <option value="">All Subject Areas</option>
          {SUBJECT_AREAS.map((area) => (
            <option key={area} value={area}>{area}</option>
          ))}
        </select>
      </div>

      {/* Career Stage */}
      <div>
        <label className="block text-xs font-semibold text-brand-500 uppercase tracking-wider mb-2" style={{ fontFamily: "var(--font-mono)" }}>Career Stage</label>
        <select
          value={selectedCareerStage}
          onChange={(e) => updateFilter("career_stage", e.target.value)}
          className="w-full bg-brand-50 border border-brand-200 rounded-xl px-3 py-2.5 text-sm text-brand-900 focus:outline-none focus:ring-2 focus:ring-accent-500/20 focus:border-accent-500 transition-all"
          aria-label="Filter by career stage"
        >
          <option value="">All Stages</option>
          {CAREER_STAGES.map((stage) => (
            <option key={stage} value={stage}>{stage}</option>
          ))}
        </select>
      </div>

      {/* Deadline */}
      <div>
        <label className="block text-xs font-semibold text-brand-500 uppercase tracking-wider mb-2" style={{ fontFamily: "var(--font-mono)" }}>Deadline</label>
        <select
          value={selectedDeadline}
          onChange={(e) => updateFilter("deadline", e.target.value)}
          className="w-full bg-brand-50 border border-brand-200 rounded-xl px-3 py-2.5 text-sm text-brand-900 focus:outline-none focus:ring-2 focus:ring-accent-500/20 focus:border-accent-500 transition-all"
          aria-label="Filter by deadline"
        >
          {DEADLINE_FILTERS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {hasFilters && (
        <button
          onClick={clearFilters}
          className="w-full text-sm text-accent-500 hover:text-accent-600 font-semibold py-2.5 border border-accent-200 rounded-xl hover:bg-accent-50 transition-colors"
        >
          Clear all filters
        </button>
      )}
    </div>
  );

  return (
    <>
      {/* Mobile filter button */}
      <button
        className="md:hidden flex items-center gap-2 px-4 py-2.5 border border-brand-200 rounded-xl text-sm font-medium text-brand-700 hover:bg-brand-50 transition-colors"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Toggle filters"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
        Filters
        {hasFilters && (
          <span className="bg-accent-500 text-white rounded-full px-1.5 py-0.5 text-xs font-bold">
            {[selectedAgencies.length > 0, selectedDeadline, selectedCareerStage, selectedSubjectArea].filter(Boolean).length}
          </span>
        )}
      </button>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-80 bg-white p-6 overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-[#05073F] tracking-heading" style={{ fontFamily: "var(--font-display)" }}>Filters</h2>
              <button onClick={() => setMobileOpen(false)} className="p-1 rounded-lg hover:bg-brand-50" aria-label="Close filters">
                <svg className="h-5 w-5 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            {filterContent}
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden md:block w-64 flex-shrink-0">
        <div className="sticky top-20">
          <h2 className="text-sm font-bold text-[#05073F] tracking-heading mb-5" style={{ fontFamily: "var(--font-display)" }}>Filters</h2>
          {filterContent}
        </div>
      </aside>
    </>
  );
}
