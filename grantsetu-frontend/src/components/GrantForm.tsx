"use client";

import { useState, FormEvent } from "react";
import {
  AGENCIES,
  SUBJECT_AREAS,
  CAREER_STAGES,
  INSTITUTION_TYPES,
} from "@/lib/constants";

export interface GrantFormValues {
  agency: string;
  scheme_name: string | null;
  title: string;
  summary: string | null;
  description: string | null;
  deadline: string | null;
  deadline_text: string | null;
  budget_min: number | null;
  budget_max: number | null;
  duration_months: number | null;
  subject_areas: string[];
  career_stages: string[];
  institution_types: string[];
  eligibility_summary: string | null;
  age_limit: number | null;
  url: string;
  notification_url: string | null;
  call_url: string | null;
  apply_url: string | null;
  pdf_url: string | null;
  portal_name: string | null;
  raw_text: string | null;
  source_type: string;
  status: string;
  is_featured: boolean;
}

export const EMPTY_GRANT: GrantFormValues = {
  agency: "DBT",
  scheme_name: null,
  title: "",
  summary: null,
  description: null,
  deadline: null,
  deadline_text: null,
  budget_min: null,
  budget_max: null,
  duration_months: null,
  subject_areas: [],
  career_stages: [],
  institution_types: [],
  eligibility_summary: null,
  age_limit: null,
  url: "",
  notification_url: null,
  call_url: null,
  apply_url: null,
  pdf_url: null,
  portal_name: null,
  raw_text: null,
  source_type: "manual",
  status: "active",
  is_featured: false,
};

const monoLabel = {
  fontFamily: "var(--font-mono)",
} as const;

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-2 border-black rounded-xl p-5 space-y-4">
      <h3
        className="text-[11px] uppercase tracking-[0.2em] font-bold text-black"
        style={monoLabel}
      >
        {title}
      </h3>
      {children}
    </section>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label
      className="block text-[11px] uppercase tracking-[0.15em] text-black font-bold mb-1"
      style={monoLabel}
    >
      {children}
    </label>
  );
}

const inputCls =
  "w-full border-2 border-gray-200 rounded-lg px-3 py-2 text-[14px] text-black focus:border-[#E9283D] focus:ring-2 focus:ring-[#E9283D]/20 outline-none transition-colors";

export function mergeGrantValues(
  current: GrantFormValues,
  incoming: Partial<GrantFormValues>
): GrantFormValues {
  const next: GrantFormValues = { ...current };
  (Object.keys(incoming) as (keyof GrantFormValues)[]).forEach((k) => {
    const v = incoming[k];
    if (v === undefined) return;
    if (Array.isArray(v) && v.length === 0) return;
    if (v === null) return;
    // @ts-expect-error - dynamic assignment with validated key
    next[k] = v;
  });
  return next;
}

export default function GrantForm({
  initial,
  values: controlledValues,
  onChange,
  onSubmit,
  submitLabel,
  mode,
}: {
  initial: GrantFormValues;
  values?: GrantFormValues;
  onChange?: (v: GrantFormValues) => void;
  onSubmit: (values: GrantFormValues) => Promise<void>;
  submitLabel?: string;
  mode: "create" | "edit";
}) {
  const [internal, setInternal] = useState<GrantFormValues>(initial);
  const isControlled = controlledValues !== undefined && onChange !== undefined;
  const values = isControlled ? (controlledValues as GrantFormValues) : internal;
  const setValues = (updater: GrantFormValues | ((prev: GrantFormValues) => GrantFormValues)) => {
    const next = typeof updater === "function" ? (updater as (p: GrantFormValues) => GrantFormValues)(values) : updater;
    if (isControlled) onChange!(next);
    else setInternal(next);
  };
  const [submitting, setSubmitting] = useState<null | "draft" | "publish" | "save">(null);
  const [error, setError] = useState("");

  function set<K extends keyof GrantFormValues>(key: K, val: GrantFormValues[K]) {
    setValues((v) => ({ ...v, [key]: val }));
  }

  function toggleInArray(key: "subject_areas" | "career_stages" | "institution_types", v: string) {
    setValues((prev) => {
      const has = prev[key].includes(v);
      return { ...prev, [key]: has ? prev[key].filter((x) => x !== v) : [...prev[key], v] };
    });
  }

  async function submit(e: FormEvent<HTMLFormElement>, status?: string) {
    e.preventDefault();
    setError("");
    const finalStatus = status ?? values.status;
    setSubmitting(finalStatus === "draft" ? "draft" : mode === "edit" ? "save" : "publish");
    try {
      await onSubmit({ ...values, status: finalStatus });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save grant.");
    } finally {
      setSubmitting(null);
    }
  }

  return (
    <form onSubmit={(e) => submit(e)} className="space-y-5">
      <Section title="Basics">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label>Agency *</Label>
            <select
              value={values.agency}
              onChange={(e) => set("agency", e.target.value)}
              className={inputCls}
              required
            >
              {AGENCIES.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label>Scheme Name</Label>
            <input
              value={values.scheme_name ?? ""}
              onChange={(e) => set("scheme_name", e.target.value || null)}
              className={inputCls}
              placeholder="e.g., PM-ECRG"
            />
          </div>
        </div>
        <div>
          <Label>Title *</Label>
          <input
            value={values.title}
            onChange={(e) => set("title", e.target.value)}
            className={inputCls}
            required
          />
        </div>
        <div>
          <Label>URL *</Label>
          <input
            type="url"
            value={values.url}
            onChange={(e) => set("url", e.target.value)}
            className={inputCls}
            required
            placeholder="https://..."
          />
        </div>
      </Section>

      <Section title="Timing">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <Label>Deadline (date)</Label>
            <input
              type="date"
              value={values.deadline ? values.deadline.slice(0, 10) : ""}
              onChange={(e) =>
                set("deadline", e.target.value ? new Date(e.target.value).toISOString() : null)
              }
              className={inputCls}
            />
          </div>
          <div>
            <Label>Deadline Text</Label>
            <input
              value={values.deadline_text ?? ""}
              onChange={(e) => set("deadline_text", e.target.value || null)}
              className={inputCls}
              placeholder="Open / Rolling / 31 Dec"
            />
          </div>
          <div>
            <Label>Duration (months)</Label>
            <input
              type="number"
              value={values.duration_months ?? ""}
              onChange={(e) =>
                set("duration_months", e.target.value ? Number(e.target.value) : null)
              }
              className={inputCls}
            />
          </div>
        </div>
      </Section>

      <Section title="Money">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label>Budget Min (INR)</Label>
            <input
              type="number"
              value={values.budget_min ?? ""}
              onChange={(e) => set("budget_min", e.target.value ? Number(e.target.value) : null)}
              className={inputCls}
            />
          </div>
          <div>
            <Label>Budget Max (INR)</Label>
            <input
              type="number"
              value={values.budget_max ?? ""}
              onChange={(e) => set("budget_max", e.target.value ? Number(e.target.value) : null)}
              className={inputCls}
            />
          </div>
        </div>
      </Section>

      <Section title="Targeting">
        <div>
          <Label>Subject Areas</Label>
          <div className="flex flex-wrap gap-2">
            {SUBJECT_AREAS.map((s) => {
              const on = values.subject_areas.includes(s);
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => toggleInArray("subject_areas", s)}
                  className={`px-2.5 py-1 text-[12px] font-bold border-2 rounded-full transition-colors ${
                    on
                      ? "bg-[#E9283D] text-white border-[#E9283D]"
                      : "bg-white text-black border-black hover:bg-gray-50"
                  }`}
                  style={monoLabel}
                >
                  {s}
                </button>
              );
            })}
          </div>
        </div>
        <div>
          <Label>Career Stages</Label>
          <div className="flex flex-wrap gap-2">
            {CAREER_STAGES.map((s) => {
              const on = values.career_stages.includes(s);
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => toggleInArray("career_stages", s)}
                  className={`px-2.5 py-1 text-[12px] font-bold border-2 rounded-full transition-colors ${
                    on
                      ? "bg-[#E9283D] text-white border-[#E9283D]"
                      : "bg-white text-black border-black hover:bg-gray-50"
                  }`}
                  style={monoLabel}
                >
                  {s}
                </button>
              );
            })}
          </div>
        </div>
        <div>
          <Label>Institution Types</Label>
          <div className="flex flex-wrap gap-2">
            {INSTITUTION_TYPES.map((s) => {
              const on = values.institution_types.includes(s);
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => toggleInArray("institution_types", s)}
                  className={`px-2.5 py-1 text-[12px] font-bold border-2 rounded-full transition-colors ${
                    on
                      ? "bg-[#E9283D] text-white border-[#E9283D]"
                      : "bg-white text-black border-black hover:bg-gray-50"
                  }`}
                  style={monoLabel}
                >
                  {s}
                </button>
              );
            })}
          </div>
        </div>
        <div>
          <Label>Age Limit (years)</Label>
          <input
            type="number"
            value={values.age_limit ?? ""}
            onChange={(e) => set("age_limit", e.target.value ? Number(e.target.value) : null)}
            className={inputCls + " max-w-[160px]"}
          />
        </div>
      </Section>

      <Section title="Content">
        <div>
          <Label>Summary (1-2 lines)</Label>
          <textarea
            rows={2}
            value={values.summary ?? ""}
            onChange={(e) => set("summary", e.target.value || null)}
            className={inputCls}
          />
        </div>
        <div>
          <Label>Description</Label>
          <textarea
            rows={5}
            value={values.description ?? ""}
            onChange={(e) => set("description", e.target.value || null)}
            className={inputCls}
          />
        </div>
        <div>
          <Label>Eligibility Summary</Label>
          <textarea
            rows={2}
            value={values.eligibility_summary ?? ""}
            onChange={(e) => set("eligibility_summary", e.target.value || null)}
            className={inputCls}
          />
        </div>
        <div>
          <Label>Raw Text (notes / full call text)</Label>
          <textarea
            rows={3}
            value={values.raw_text ?? ""}
            onChange={(e) => set("raw_text", e.target.value || null)}
            className={inputCls}
          />
        </div>
      </Section>

      <Section title="Links">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label>Notification URL</Label>
            <input
              type="url"
              value={values.notification_url ?? ""}
              onChange={(e) => set("notification_url", e.target.value || null)}
              className={inputCls}
            />
          </div>
          <div>
            <Label>Call URL</Label>
            <input
              type="url"
              value={values.call_url ?? ""}
              onChange={(e) => set("call_url", e.target.value || null)}
              className={inputCls}
            />
          </div>
          <div>
            <Label>Apply URL</Label>
            <input
              type="url"
              value={values.apply_url ?? ""}
              onChange={(e) => set("apply_url", e.target.value || null)}
              className={inputCls}
            />
          </div>
          <div>
            <Label>PDF URL</Label>
            <input
              type="url"
              value={values.pdf_url ?? ""}
              onChange={(e) => set("pdf_url", e.target.value || null)}
              className={inputCls}
            />
          </div>
          <div className="sm:col-span-2">
            <Label>Portal Name</Label>
            <input
              value={values.portal_name ?? ""}
              onChange={(e) => set("portal_name", e.target.value || null)}
              className={inputCls}
              placeholder="e.g., eProMIS, anrfonline.in"
            />
          </div>
        </div>
      </Section>

      <Section title="Flags">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
          <div>
            <Label>Status</Label>
            <select
              value={values.status}
              onChange={(e) => set("status", e.target.value)}
              className={inputCls}
            >
              <option value="active">active</option>
              <option value="draft">draft</option>
              <option value="expired">expired</option>
            </select>
          </div>
          <label className="flex items-center gap-2 pb-2">
            <input
              type="checkbox"
              checked={values.is_featured}
              onChange={(e) => set("is_featured", e.target.checked)}
              className="h-4 w-4 accent-[#E9283D]"
            />
            <span
              className="text-[12px] uppercase tracking-wider font-bold text-black"
              style={monoLabel}
            >
              Featured grant
            </span>
          </label>
        </div>
      </Section>

      {error && (
        <p
          className="text-[13px] text-[#E9283D] font-semibold"
          style={monoLabel}
        >
          {error}
        </p>
      )}

      <div className="flex flex-wrap gap-3 sticky bottom-0 bg-white py-4 border-t-2 border-black">
        {mode === "create" ? (
          <>
            <button
              type="button"
              disabled={submitting !== null}
              onClick={(e) =>
                submit(e as unknown as FormEvent<HTMLFormElement>, "draft")
              }
              className="bg-white border-2 border-black text-black px-6 py-2.5 rounded-lg text-[12px] font-bold uppercase tracking-wider hover:bg-black hover:text-white disabled:opacity-50 transition-colors"
              style={monoLabel}
            >
              {submitting === "draft" ? "Saving…" : "Save as Draft"}
            </button>
            <button
              type="submit"
              disabled={submitting !== null}
              onClick={(e) => {
                if (values.status !== "active") set("status", "active");
                return submit(e as unknown as FormEvent<HTMLFormElement>, "active");
              }}
              className="bg-[#E9283D] text-white px-6 py-2.5 rounded-lg text-[12px] font-bold uppercase tracking-wider hover:bg-[#C91E30] disabled:opacity-50 transition-colors"
              style={monoLabel}
            >
              {submitting === "publish" ? "Publishing…" : submitLabel || "Publish Grant →"}
            </button>
          </>
        ) : (
          <button
            type="submit"
            disabled={submitting !== null}
            className="bg-[#E9283D] text-white px-6 py-2.5 rounded-lg text-[12px] font-bold uppercase tracking-wider hover:bg-[#C91E30] disabled:opacity-50 transition-colors"
            style={monoLabel}
          >
            {submitting === "save" ? "Saving…" : submitLabel || "Save changes"}
          </button>
        )}
      </div>
    </form>
  );
}
