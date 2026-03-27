"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import TagInput from "@/components/TagInput";
import {
  SUBJECT_AREAS,
  CAREER_STAGES,
  INSTITUTION_TYPES,
  INDIAN_STATES,
  AGENCIES,
  AGENCY_META,
  DESIGNATIONS,
} from "@/lib/constants";
import { updateProfile } from "@/lib/api";
import type { UserUpdate } from "@/types";

const STEPS = ["Institution", "Research Profile", "Preferences"];

export default function OnboardingPage() {
  const { data: session, update: updateSession } = useSession();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

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

  function canProceed(): boolean {
    if (step === 0) return !!form.institution && !!form.institution_type;
    if (step === 1) return !!form.career_stage && (form.subject_areas?.length ?? 0) > 0;
    return true;
  }

  async function handleSubmit() {
    if (!session?.backendToken) return;
    setSaving(true);
    setError("");

    try {
      await updateProfile(session.backendToken, {
        ...form,
        onboarding_completed: true,
      });
      // Update the session so middleware knows onboarding is done
      await updateSession({ onboardingCompleted: true });
      router.push("/dashboard");
    } catch (err) {
      setError("Failed to save your profile. Please try again.");
      console.error(err);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-[70vh] py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-display-sm font-bold text-[#05073F] tracking-heading" style={{ fontFamily: "var(--font-display)" }}>
            Welcome to GrantSetu
          </h1>
          <p className="mt-2 text-brand-500">
            Tell us about yourself so we can recommend the right grants for you
          </p>
        </div>

        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            {STEPS.map((label, i) => (
              <div key={label} className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                    i <= step
                      ? "bg-accent-500 text-white"
                      : "bg-brand-100 text-brand-400"
                  }`}
                >
                  {i < step ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    i + 1
                  )}
                </div>
                <span className={`hidden sm:inline text-sm font-medium ${i <= step ? "text-brand-700" : "text-brand-400"}`}>
                  {label}
                </span>
              </div>
            ))}
          </div>
          <div className="w-full bg-brand-100 rounded-full h-1.5">
            <div
              className="bg-accent-500 h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Form card */}
        <div className="bg-white border border-brand-200 rounded-2xl p-6 sm:p-8 shadow-card">
          {/* Step 0: Institution */}
          {step === 0 && (
            <div className="space-y-5">
              <h2 className="text-lg font-semibold text-[#05073F]" style={{ fontFamily: "var(--font-display)" }}>Institution Details</h2>

              <div>
                <label className="block text-sm font-medium text-brand-700 mb-1">Institution Name *</label>
                <input
                  type="text"
                  value={form.institution || ""}
                  onChange={(e) => updateField("institution", e.target.value)}
                  placeholder="e.g. Tripura University"
                  className="w-full border border-brand-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent-500/40 focus:border-accent-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-700 mb-1">Institution Type *</label>
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
          )}

          {/* Step 1: Research Profile */}
          {step === 1 && (
            <div className="space-y-5">
              <h2 className="text-lg font-semibold text-[#05073F]" style={{ fontFamily: "var(--font-display)" }}>Research Profile</h2>

              <div>
                <label className="block text-sm font-medium text-brand-700 mb-1">Career Stage *</label>
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
                <label className="block text-sm font-medium text-brand-700 mb-2">Subject Areas * (select all that apply)</label>
                <div className="grid grid-cols-2 gap-2">
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
                  Add specific topics you work on — we&apos;ll match these against grant descriptions
                </p>
                <TagInput
                  tags={form.research_keywords || []}
                  onChange={(tags) => updateField("research_keywords", tags)}
                  placeholder="e.g. CRISPR, drug delivery, machine learning"
                />
              </div>
            </div>
          )}

          {/* Step 2: Preferences */}
          {step === 2 && (
            <div className="space-y-5">
              <h2 className="text-lg font-semibold text-[#05073F]" style={{ fontFamily: "var(--font-display)" }}>Preferences</h2>

              <div>
                <label className="block text-sm font-medium text-brand-700 mb-1">Date of Birth</label>
                <p className="text-xs text-brand-400 mb-2">
                  Some grants have age limits — this helps us filter out ineligible ones
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
                  Select agencies you&apos;re most interested in — grants from these will be prioritised
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
          )}

          {/* Error */}
          {error && (
            <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">{error}</div>
          )}

          {/* Navigation buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-brand-100">
            {step > 0 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="px-5 py-2.5 text-sm font-medium text-brand-700 border border-brand-200 rounded-xl hover:bg-brand-50 transition-colors"
              >
                Back
              </button>
            ) : (
              <div />
            )}

            {step < STEPS.length - 1 ? (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                disabled={!canProceed()}
                className="px-6 py-2.5 text-sm font-semibold text-white bg-accent-500 rounded-xl hover:bg-accent-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={saving}
                className="px-6 py-2.5 text-sm font-semibold text-white bg-accent-500 rounded-xl hover:bg-accent-600 transition-colors disabled:opacity-50"
              >
                {saving ? "Saving..." : "Complete Setup"}
              </button>
            )}
          </div>
        </div>

        {/* Skip link */}
        <div className="text-center mt-4">
          <button
            onClick={handleSubmit}
            className="text-sm text-brand-400 hover:text-brand-600 transition-colors"
          >
            Skip for now — I&apos;ll set this up later
          </button>
        </div>
      </div>
    </div>
  );
}
