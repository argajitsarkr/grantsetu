"use client";

import { useEffect, useState } from "react";
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
import { fetchCurrentUser, updateProfile } from "@/lib/api";
import type { UserUpdate } from "@/types";

export default function ProfilePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState<UserUpdate>({
    name: "",
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
    alert_enabled: false,
    alert_frequency: "weekly",
    alert_agencies: [],
  });

  useEffect(() => {
    if (!session?.backendToken) return;

    async function load() {
      try {
        const user = await fetchCurrentUser(session!.backendToken!);
        setForm({
          name: user.name || "",
          institution: user.institution || "",
          institution_type: user.institution_type || "",
          state: user.state || "",
          department: user.department || "",
          designation: user.designation || "",
          career_stage: user.career_stage || "",
          subject_areas: user.subject_areas || [],
          research_keywords: user.research_keywords || [],
          date_of_birth: user.date_of_birth || "",
          preferred_agencies: user.preferred_agencies || [],
          alert_enabled: user.alert_enabled,
          alert_frequency: user.alert_frequency,
          alert_agencies: user.alert_agencies || [],
        });
      } catch (err) {
        console.error("Failed to load profile:", err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [session]);

  function updateField<K extends keyof UserUpdate>(key: K, value: UserUpdate[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setSuccess(false);
  }

  function toggleArrayItem(key: "subject_areas" | "preferred_agencies" | "alert_agencies", item: string) {
    const current = (form[key] as string[]) || [];
    if (current.includes(item)) {
      updateField(key, current.filter((x) => x !== item));
    } else {
      updateField(key, [...current, item]);
    }
  }

  async function handleSave() {
    if (!session?.backendToken) return;
    setSaving(true);
    setError("");
    setSuccess(false);

    try {
      await updateProfile(session.backendToken, form);
      setSuccess(true);
    } catch (err) {
      setError("Failed to save changes. Please try again.");
      console.error(err);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="container-main py-12">
        <div className="max-w-2xl mx-auto animate-pulse space-y-4">
          <div className="h-8 bg-brand-100 rounded w-1/3" />
          <div className="h-64 bg-brand-100 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="container-main py-10">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-[#0A0A0A]" style={{ fontFamily: "var(--font-display)" }}>Edit Profile</h1>
            <p className="text-brand-500 text-sm mt-1">
              Keep your profile up to date for better grant recommendations
            </p>
          </div>
          <button
            onClick={() => router.push("/dashboard")}
            className="px-4 py-2 text-sm font-medium border border-brand-200 rounded-xl text-brand-700 hover:bg-brand-50 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>

        <div className="space-y-8">
          {/* Personal */}
          <section className="bg-white border border-brand-200 rounded-2xl p-6 shadow-card">
            <h2 className="text-lg font-semibold text-[#0A0A0A] mb-4" style={{ fontFamily: "var(--font-display)" }}>Personal Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-brand-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={form.name || ""}
                  onChange={(e) => updateField("name", e.target.value)}
                  className="w-full border border-brand-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent-500/40 focus:border-accent-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-700 mb-1">Date of Birth</label>
                <input
                  type="date"
                  value={form.date_of_birth || ""}
                  onChange={(e) => updateField("date_of_birth", e.target.value)}
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
                  <option value="">Select...</option>
                  {DESIGNATIONS.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          {/* Institution */}
          <section className="bg-white border border-brand-200 rounded-2xl p-6 shadow-card">
            <h2 className="text-lg font-semibold text-[#0A0A0A] mb-4" style={{ fontFamily: "var(--font-display)" }}>Institution</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-brand-700 mb-1">Institution Name</label>
                <input
                  type="text"
                  value={form.institution || ""}
                  onChange={(e) => updateField("institution", e.target.value)}
                  className="w-full border border-brand-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent-500/40 focus:border-accent-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-700 mb-1">Institution Type</label>
                <select
                  value={form.institution_type || ""}
                  onChange={(e) => updateField("institution_type", e.target.value)}
                  className="w-full border border-brand-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent-500/40 focus:border-accent-500"
                >
                  <option value="">Select...</option>
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
                  <option value="">Select...</option>
                  {INDIAN_STATES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-brand-700 mb-1">Department</label>
                <input
                  type="text"
                  value={form.department || ""}
                  onChange={(e) => updateField("department", e.target.value)}
                  className="w-full border border-brand-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent-500/40 focus:border-accent-500"
                />
              </div>
            </div>
          </section>

          {/* Research Profile */}
          <section className="bg-white border border-brand-200 rounded-2xl p-6 shadow-card">
            <h2 className="text-lg font-semibold text-[#0A0A0A] mb-4" style={{ fontFamily: "var(--font-display)" }}>Research Profile</h2>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-brand-700 mb-2">Career Stage</label>
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
                <label className="block text-sm font-medium text-brand-700 mb-2">Subject Areas</label>
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
                <TagInput
                  tags={form.research_keywords || []}
                  onChange={(tags) => updateField("research_keywords", tags)}
                  placeholder="e.g. CRISPR, drug delivery, machine learning"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-700 mb-2">Preferred Agencies</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {AGENCIES.map((agency) => (
                    <button
                      key={agency}
                      type="button"
                      onClick={() => toggleArrayItem("preferred_agencies", agency)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium border text-center transition-colors ${
                        form.preferred_agencies?.includes(agency)
                          ? "bg-accent-500/10 text-accent-600 border-accent-500"
                          : "bg-white text-brand-600 border-brand-200 hover:bg-brand-50"
                      }`}
                    >
                      {agency}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Alert Preferences */}
          <section className="bg-white border border-brand-200 rounded-2xl p-6 shadow-card">
            <h2 className="text-lg font-semibold text-[#0A0A0A] mb-4" style={{ fontFamily: "var(--font-display)" }}>Email Alerts</h2>

            <div className="space-y-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.alert_enabled || false}
                  onChange={(e) => updateField("alert_enabled", e.target.checked)}
                  className="w-4 h-4 text-accent-500 rounded border-brand-300 focus:ring-accent-500"
                />
                <span className="text-sm text-brand-700 font-medium">
                  Send me email alerts for matching grants
                </span>
              </label>

              {form.alert_enabled && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-brand-700 mb-1">Frequency</label>
                    <div className="flex gap-2">
                      {["daily", "weekly"].map((freq) => (
                        <button
                          key={freq}
                          type="button"
                          onClick={() => updateField("alert_frequency", freq)}
                          className={`px-4 py-2 rounded-xl text-sm font-medium border capitalize transition-colors ${
                            form.alert_frequency === freq
                              ? "bg-accent-500 text-white border-accent-500"
                              : "bg-white text-brand-700 border-brand-200 hover:bg-brand-50"
                          }`}
                        >
                          {freq}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-brand-700 mb-2">Alert Agencies</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {AGENCIES.map((agency) => (
                        <button
                          key={agency}
                          type="button"
                          onClick={() => toggleArrayItem("alert_agencies", agency)}
                          className={`px-3 py-2 rounded-lg text-sm font-medium border text-center transition-colors ${
                            form.alert_agencies?.includes(agency)
                              ? "bg-accent-500/10 text-accent-600 border-accent-500"
                              : "bg-white text-brand-600 border-brand-200 hover:bg-brand-50"
                          }`}
                        >
                          {agency}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </section>

          {/* Save button */}
          {error && (
            <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">{error}</div>
          )}
          {success && (
            <div className="p-3 bg-green-50 text-green-700 rounded-lg text-sm">
              Profile updated successfully!
            </div>
          )}

          <div className="flex justify-end gap-3">
            <button
              onClick={() => router.push("/dashboard")}
              className="px-5 py-2.5 text-sm font-medium border border-brand-200 rounded-xl text-brand-700 hover:bg-brand-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-2.5 text-sm font-semibold text-white bg-accent-500 rounded-xl hover:bg-accent-600 transition-colors disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
