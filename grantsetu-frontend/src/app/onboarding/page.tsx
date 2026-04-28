"use client";

import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import TagInput from "@/components/TagInput";
import VerifyEmailBanner from "@/components/VerifyEmailBanner";
import {
  SUBJECT_AREAS,
  CAREER_STAGES,
  INSTITUTION_TYPES,
  INDIAN_STATES,
  AGENCIES,
  AGENCY_META,
  DESIGNATIONS,
} from "@/lib/constants";
import { lookupInstitutionByEmail } from "@/lib/institution-domains";
import { updateProfile } from "@/lib/api";
import type { UserUpdate } from "@/types";

export default function OnboardingPage() {
  const { data: session, update: updateSession } = useSession();
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const prefilledRef = useRef(false);

  const [form, setForm] = useState<UserUpdate>({
    institution: "",
    institution_type: "",
    state: "",
    department: "",
    designation: "",
    career_stage: "",
    subject_areas: [],
    research_keywords: [],
    date_of_birth: "",
    preferred_agencies: [],
  });

  // Prefill institution + type + state from email domain (one-shot, only if
  // the user hasn't typed anything yet).
  useEffect(() => {
    if (prefilledRef.current) return;
    const email = session?.user?.email;
    if (!email) return;
    const meta = lookupInstitutionByEmail(email);
    if (!meta) return;
    prefilledRef.current = true;
    setForm((prev) => ({
      ...prev,
      institution: prev.institution || meta.institution,
      institution_type: prev.institution_type || meta.institution_type,
      state: prev.state || meta.state || "",
    }));
  }, [session?.user?.email]);

  function updateField<K extends keyof UserUpdate>(key: K, value: UserUpdate[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function toggleArrayItem(key: "subject_areas" | "preferred_agencies", item: string) {
    const current = (form[key] as string[]) || [];
    if (current.includes(item)) {
      updateField(key, current.filter((x) => x !== item));
    } else {
      updateField(key, [...current, item]);
    }
  }

  function canSubmit(): boolean {
    return !!form.career_stage && (form.subject_areas?.length ?? 0) > 0;
  }

  async function handleSubmit(skip = false) {
    if (!session?.backendToken) return;
    setSaving(true);
    setError("");

    const payload: UserUpdate & { onboarding_completed: boolean } = {
      onboarding_completed: true,
    };
    if (!skip) {
      for (const [k, v] of Object.entries(form) as [keyof UserUpdate, unknown][]) {
        if (v === "" || v === null || v === undefined) continue;
        if (Array.isArray(v) && v.length === 0) continue;
        (payload as Record<string, unknown>)[k] = v;
      }
    }

    try {
      await updateProfile(session.backendToken, payload);
      await updateSession({ onboardingCompleted: true });
      window.location.assign("/dashboard");
    } catch (err) {
      setError("Failed to save your profile. Please try again.");
      console.error(err);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-[70vh] py-8 sm:py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <VerifyEmailBanner />

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-display-sm font-bold text-[#0A0A0A] tracking-heading" style={{ fontFamily: "var(--font-display)" }}>
            Welcome to GrantSetu
          </h1>
          <p className="mt-2 text-brand-500 text-sm sm:text-base">
            Two questions to start - the rest is optional.
          </p>
        </div>

        {/* ── Section 1: Your research (REQUIRED) ─────────────────────── */}
        <div className="bg-white border border-brand-200 rounded-2xl p-5 sm:p-7 shadow-card mb-5">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-lg font-semibold text-[#0A0A0A]" style={{ fontFamily: "var(--font-display)" }}>
              Your research
            </h2>
            <span className="text-[10px] uppercase tracking-wider text-accent-500 font-bold" style={{ fontFamily: "var(--font-mono)" }}>
              Required
            </span>
          </div>
          <p className="text-xs text-brand-400 mb-5">Drives the recommendations on your dashboard.</p>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-brand-700 mb-2">Career Stage <span className="text-accent-500">*</span></label>
              <div className="flex flex-wrap gap-2">
                {CAREER_STAGES.map((cs) => (
                  <button
                    key={cs}
                    type="button"
                    onClick={() => updateField("career_stage", cs)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium border transition-colors ${
                      form.career_stage === cs
                        ? "bg-accent-500 text-white border-accent-500"
                        : "bg-white text-brand-700 border-brand-200 hover:bg-brand-50"
                    }`}
                  >
                    {cs}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-700 mb-2">
                Subject Areas <span className="text-accent-500">*</span>
                <span className="ml-2 text-xs font-normal text-brand-400">(select all that apply)</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {SUBJECT_AREAS.map((area) => (
                  <button
                    key={area}
                    type="button"
                    onClick={() => toggleArrayItem("subject_areas", area)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium border text-left transition-colors ${
                      form.subject_areas?.includes(area)
                        ? "bg-accent-500/10 text-accent-600 border-accent-500"
                        : "bg-white text-brand-600 border-brand-200 hover:bg-brand-50"
                    }`}
                  >
                    {form.subject_areas?.includes(area) && (
                      <svg className="inline w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                    {area}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-700 mb-1">Research Keywords</label>
              <p className="text-xs text-brand-400 mb-2">
                Specific topics you work on - matched against grant descriptions.
              </p>
              <TagInput
                tags={form.research_keywords || []}
                onChange={(tags) => updateField("research_keywords", tags)}
                placeholder="e.g. CRISPR, drug delivery, machine learning"
              />
            </div>
          </div>
        </div>

        {/* ── Section 2: Institution (OPTIONAL) ───────────────────────── */}
        <div className="bg-white border border-brand-200 rounded-2xl p-5 sm:p-7 shadow-card mb-5">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-lg font-semibold text-[#0A0A0A]" style={{ fontFamily: "var(--font-display)" }}>
              Your institution
            </h2>
            <span className="text-[10px] uppercase tracking-wider text-brand-400 font-bold" style={{ fontFamily: "var(--font-mono)" }}>
              Optional
            </span>
          </div>
          <p className="text-xs text-brand-400 mb-5">
            {prefilledRef.current ? "We pre-filled this from your email - feel free to edit." : "Helps with state-specific funding filters."}
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-brand-700 mb-1">Institution Name</label>
              <input
                type="text"
                value={form.institution || ""}
                onChange={(e) => updateField("institution", e.target.value)}
                placeholder="e.g. Indian Institute of Technology Roorkee"
                className="w-full border border-brand-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent-500/40 focus:border-accent-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-brand-700 mb-1">Institution Type</label>
                <select
                  value={form.institution_type || ""}
                  onChange={(e) => updateField("institution_type", e.target.value)}
                  className="w-full border border-brand-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent-500/40 focus:border-accent-500"
                >
                  <option value="">Select type...</option>
                  {INSTITUTION_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-700 mb-1">State</label>
                <select
                  value={form.state || ""}
                  onChange={(e) => updateField("state", e.target.value)}
                  className="w-full border border-brand-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent-500/40 focus:border-accent-500"
                >
                  <option value="">Select state...</option>
                  {INDIAN_STATES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-brand-700 mb-1">Department</label>
                <input
                  type="text"
                  value={form.department || ""}
                  onChange={(e) => updateField("department", e.target.value)}
                  placeholder="e.g. Department of Chemistry"
                  className="w-full border border-brand-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent-500/40 focus:border-accent-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-700 mb-1">Designation</label>
                <select
                  value={form.designation || ""}
                  onChange={(e) => updateField("designation", e.target.value)}
                  className="w-full border border-brand-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent-500/40 focus:border-accent-500"
                >
                  <option value="">Select designation...</option>
                  {DESIGNATIONS.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* ── Section 3: Preferences (OPTIONAL) ───────────────────────── */}
        <div className="bg-white border border-brand-200 rounded-2xl p-5 sm:p-7 shadow-card mb-5">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-lg font-semibold text-[#0A0A0A]" style={{ fontFamily: "var(--font-display)" }}>
              Preferences
            </h2>
            <span className="text-[10px] uppercase tracking-wider text-brand-400 font-bold" style={{ fontFamily: "var(--font-mono)" }}>
              Optional
            </span>
          </div>
          <p className="text-xs text-brand-400 mb-5">Sharper recommendations - skip if you&apos;re in a hurry.</p>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-brand-700 mb-1">Date of Birth</label>
              <p className="text-xs text-brand-400 mb-2">
                Helps filter out grants with age limits.
              </p>
              <input
                type="date"
                value={form.date_of_birth || ""}
                onChange={(e) => updateField("date_of_birth", e.target.value)}
                className="w-full border border-brand-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent-500/40 focus:border-accent-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-700 mb-2">Preferred Agencies</label>
              <p className="text-xs text-brand-400 mb-3">
                Grants from these will be prioritised on your dashboard.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {AGENCIES.map((agency) => (
                  <button
                    key={agency}
                    type="button"
                    onClick={() => toggleArrayItem("preferred_agencies", agency)}
                    className={`px-3 py-2.5 rounded-lg text-sm font-medium border text-center transition-colors ${
                      form.preferred_agencies?.includes(agency)
                        ? "bg-accent-500/10 text-accent-600 border-accent-500"
                        : "bg-white text-brand-600 border-brand-200 hover:bg-brand-50"
                    }`}
                  >
                    <div className="font-semibold">{agency}</div>
                    <div className="text-xs text-brand-400 mt-0.5 truncate">
                      {AGENCY_META[agency]?.fullName.split(" ").slice(0, 3).join(" ")}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">{error}</div>
        )}

        {/* Submit */}
        <button
          type="button"
          onClick={() => handleSubmit(false)}
          disabled={saving || !canSubmit()}
          className="w-full px-6 py-3 text-sm font-semibold text-white bg-accent-500 rounded-xl hover:bg-accent-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? "Saving..." : "Save & continue →"}
        </button>

        {/* Skip */}
        <div className="text-center mt-4">
          <button
            onClick={() => handleSubmit(true)}
            disabled={saving}
            className="text-sm text-brand-400 hover:text-brand-600 transition-colors disabled:opacity-50"
          >
            Skip for now - I&apos;ll set this up later
          </button>
        </div>
      </div>
    </div>
  );
}
