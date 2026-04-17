"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { API_URL, AGENCIES, SUBJECT_AREAS, CAREER_STAGES, INSTITUTION_TYPES } from "@/lib/constants";

export default function AdminNewGrant() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const form = new FormData(e.currentTarget);

    const body = {
      agency: form.get("agency"),
      scheme_name: form.get("scheme_name") || null,
      title: form.get("title"),
      summary: form.get("summary") || null,
      description: form.get("description") || null,
      deadline: form.get("deadline") ? new Date(form.get("deadline") as string).toISOString() : null,
      deadline_text: form.get("deadline_text") || null,
      budget_min: form.get("budget_min") ? Number(form.get("budget_min")) : null,
      budget_max: form.get("budget_max") ? Number(form.get("budget_max")) : null,
      duration_months: form.get("duration_months") ? Number(form.get("duration_months")) : null,
      subject_areas: form.getAll("subject_areas"),
      career_stages: form.getAll("career_stages"),
      institution_types: form.getAll("institution_types"),
      eligibility_summary: form.get("eligibility_summary") || null,
      url: form.get("url"),
      pdf_url: form.get("pdf_url") || null,
      portal_name: form.get("portal_name") || null,
      source_type: "manual",
      status: "active",
    };

    try {
      const res = await fetch(`${API_URL}/api/v1/admin/grants`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("Failed to create grant");
      router.push("/admin");
    } catch {
      setError("Failed to create grant. Please check your inputs.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-[#0A0A0A] mb-6" style={{ fontFamily: "var(--font-display)" }}>Add Grant Manually</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" style={{ fontFamily: "var(--font-mono)" }}>Agency *</label>
            <select name="agency" required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
              {AGENCIES.map((a) => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" style={{ fontFamily: "var(--font-mono)" }}>Scheme Name</label>
            <input name="scheme_name" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" placeholder="e.g., PM-ECRG" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" style={{ fontFamily: "var(--font-mono)" }}>Title *</label>
          <input name="title" required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" style={{ fontFamily: "var(--font-mono)" }}>Summary</label>
          <textarea name="summary" rows={2} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" style={{ fontFamily: "var(--font-mono)" }}>Description</label>
          <textarea name="description" rows={4} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" style={{ fontFamily: "var(--font-mono)" }}>Deadline</label>
            <input name="deadline" type="date" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" style={{ fontFamily: "var(--font-mono)" }}>Deadline Text</label>
            <input name="deadline_text" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" placeholder="e.g., Open / Rolling" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" style={{ fontFamily: "var(--font-mono)" }}>Duration (months)</label>
            <input name="duration_months" type="number" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" style={{ fontFamily: "var(--font-mono)" }}>Budget Min (INR)</label>
            <input name="budget_min" type="number" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" style={{ fontFamily: "var(--font-mono)" }}>Budget Max (INR)</label>
            <input name="budget_max" type="number" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" style={{ fontFamily: "var(--font-mono)" }}>Subject Areas</label>
          <div className="flex flex-wrap gap-2">
            {SUBJECT_AREAS.map((area) => (
              <label key={area} className="flex items-center gap-1.5 text-sm">
                <input type="checkbox" name="subject_areas" value={area} className="rounded" />
                {area}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" style={{ fontFamily: "var(--font-mono)" }}>Career Stages</label>
          <div className="flex flex-wrap gap-3">
            {CAREER_STAGES.map((stage) => (
              <label key={stage} className="flex items-center gap-1.5 text-sm">
                <input type="checkbox" name="career_stages" value={stage} className="rounded" />
                {stage}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" style={{ fontFamily: "var(--font-mono)" }}>Institution Types</label>
          <div className="flex flex-wrap gap-2">
            {INSTITUTION_TYPES.map((type) => (
              <label key={type} className="flex items-center gap-1.5 text-sm">
                <input type="checkbox" name="institution_types" value={type} className="rounded" />
                {type}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" style={{ fontFamily: "var(--font-mono)" }}>Eligibility Summary</label>
          <textarea name="eligibility_summary" rows={2} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" style={{ fontFamily: "var(--font-mono)" }}>URL *</label>
            <input name="url" type="url" required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" style={{ fontFamily: "var(--font-mono)" }}>PDF URL</label>
            <input name="pdf_url" type="url" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" style={{ fontFamily: "var(--font-mono)" }}>Portal Name</label>
          <input name="portal_name" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" placeholder="e.g., eProMIS, anrfonline.in" />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={saving}
          className="bg-[#E9283D] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#1a3fc2] disabled:opacity-50"
        >
          {saving ? "Creating..." : "Create Grant"}
        </button>
      </form>
    </div>
  );
}
