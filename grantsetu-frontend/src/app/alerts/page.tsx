"use client";

import { useState } from "react";
import { AGENCIES, SUBJECT_AREAS, CAREER_STAGES } from "@/lib/constants";
import { API_URL } from "@/lib/constants";

export default function AlertsPage() {
  const [email, setEmail] = useState("");
  const [subjectAreas, setSubjectAreas] = useState<string[]>([]);
  const [careerStage, setCareerStage] = useState("");
  const [agencies, setAgencies] = useState<string[]>([]);
  const [frequency, setFrequency] = useState("weekly");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  function toggleItem(list: string[], item: string, setter: (v: string[]) => void) {
    setter(list.includes(item) ? list.filter((i) => i !== item) : [...list, item]);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch(`${API_URL}/api/v1/alerts/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          subject_areas: subjectAreas,
          career_stage: careerStage || null,
          agencies,
          frequency,
        }),
      });

      if (!res.ok) throw new Error("Failed to subscribe");
      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please try again.");
    }
  }

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="mt-4 text-2xl font-bold text-[#05073F]" style={{ fontFamily: "var(--font-display)" }}>You&apos;re subscribed!</h2>
        <p className="mt-2 text-gray-600">
          We&apos;ll send you matching grants {frequency === "daily" ? "every day" : "every Monday"} at {email}.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 pt-12 pb-8">
      <h1 className="text-2xl font-bold text-[#05073F]" style={{ fontFamily: "var(--font-display)" }}>Grant Alerts</h1>
      <p className="mt-2 text-gray-600">
        Get notified when new grants matching your interests are posted. No account required.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" style={{ fontFamily: "var(--font-mono)" }}>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="you@university.ac.in"
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        {/* Subject Areas */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5" style={{ fontFamily: "var(--font-mono)" }}>Subject Areas</label>
          <div className="flex flex-wrap gap-2">
            {SUBJECT_AREAS.map((area) => (
              <button
                key={area}
                type="button"
                onClick={() => toggleItem(subjectAreas, area, setSubjectAreas)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                  subjectAreas.includes(area)
                    ? "bg-[#2451F3] text-white border-[#2451F3]"
                    : "bg-white text-gray-700 border-gray-300 hover:border-primary-300"
                }`}
              >
                {area}
              </button>
            ))}
          </div>
        </div>

        {/* Career Stage */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" style={{ fontFamily: "var(--font-mono)" }}>Career Stage</label>
          <select
            value={careerStage}
            onChange={(e) => setCareerStage(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">Any</option>
            {CAREER_STAGES.map((stage) => (
              <option key={stage} value={stage}>{stage}</option>
            ))}
          </select>
        </div>

        {/* Agencies */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5" style={{ fontFamily: "var(--font-mono)" }}>Agencies to track</label>
          <div className="flex flex-wrap gap-2">
            {AGENCIES.map((agency) => (
              <button
                key={agency}
                type="button"
                onClick={() => toggleItem(agencies, agency, setAgencies)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                  agencies.includes(agency)
                    ? "bg-[#2451F3] text-white border-[#2451F3]"
                    : "bg-white text-gray-700 border-gray-300 hover:border-primary-300"
                }`}
              >
                {agency}
              </button>
            ))}
          </div>
          <p className="mt-1 text-xs text-gray-500">Leave empty to track all agencies</p>
        </div>

        {/* Frequency */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" style={{ fontFamily: "var(--font-mono)" }}>Frequency</label>
          <div className="flex gap-3">
            {[
              { value: "weekly", label: "Weekly (Monday)" },
              { value: "daily", label: "Daily" },
            ].map((opt) => (
              <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="frequency"
                  value={opt.value}
                  checked={frequency === opt.value}
                  onChange={(e) => setFrequency(e.target.value)}
                  className="text-primary-800 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700">{opt.label}</span>
              </label>
            ))}
          </div>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          className="w-full bg-[#2451F3] text-white rounded-lg px-4 py-3 font-medium hover:bg-[#1a3fc2] transition-colors"
        >
          Subscribe to Alerts
        </button>
      </form>
    </div>
  );
}
