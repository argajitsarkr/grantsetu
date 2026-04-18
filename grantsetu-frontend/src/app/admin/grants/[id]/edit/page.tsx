"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import GrantForm, { EMPTY_GRANT, type GrantFormValues } from "@/components/GrantForm";
import { API_URL } from "@/lib/constants";
import type { Grant } from "@/types";

function grantToFormValues(g: Grant): GrantFormValues {
  return {
    agency: g.agency,
    scheme_name: g.scheme_name,
    title: g.title,
    summary: g.summary,
    description: g.description,
    deadline: g.deadline,
    deadline_text: g.deadline_text,
    budget_min: g.budget_min,
    budget_max: g.budget_max,
    duration_months: g.duration_months,
    subject_areas: g.subject_areas,
    career_stages: g.career_stages,
    institution_types: g.institution_types,
    eligibility_summary: g.eligibility_summary,
    age_limit: g.age_limit,
    url: g.url,
    notification_url: g.notification_url,
    call_url: g.call_url,
    apply_url: g.apply_url,
    pdf_url: g.pdf_url,
    portal_name: g.portal_name,
    raw_text: null,
    source_type: g.source_type,
    status: g.status,
    is_featured: g.is_featured,
  };
}

export default function AdminEditGrantPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: session } = useSession();
  const [initial, setInitial] = useState<GrantFormValues | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        // Admin fetch by numeric id via list lookup: GET /api/v1/grants supports search,
        // but easier — fetch directly via the public /grants/{slug} route once we know slug.
        // Instead, hit the listing with a big filter then find. Simpler: add an admin endpoint
        // later. For now, load via public list and find by id.
        const res = await fetch(
          `${API_URL}/api/v1/grants?per_page=500&status=${encodeURIComponent("")}`,
          { cache: "no-store" }
        );
        if (!res.ok) throw new Error("Failed to load grants list");
        const data = await res.json();
        const match = (data.items || []).find((g: { id: number }) => g.id === Number(id));
        if (!match) throw new Error("Grant not found");
        const slug = match.slug;
        const grantRes = await fetch(`${API_URL}/api/v1/grants/${slug}`, { cache: "no-store" });
        if (!grantRes.ok) throw new Error("Failed to load grant detail");
        const grant = (await grantRes.json()) as Grant;
        setInitial(grantToFormValues(grant));
      } catch (err) {
        setLoadError(err instanceof Error ? err.message : "Failed to load grant.");
        setInitial(EMPTY_GRANT);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  async function handleUpdate(values: GrantFormValues) {
    const token = session?.backendToken;
    if (!token) throw new Error("Not authenticated.");
    const res = await fetch(`${API_URL}/api/v1/admin/grants/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(values),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.detail || `Update failed (${res.status})`);
    }
    router.push("/admin/grants");
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        <Link
          href="/admin/grants"
          className="text-[11px] uppercase tracking-[0.15em] text-gray-500 hover:text-[#E9283D] font-bold"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          ← Back to grants list
        </Link>
        <h1
          className="mt-3 text-[2rem] sm:text-[2.5rem] font-black text-black leading-[1.05]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Edit <span className="text-[#E9283D]">Grant.</span>
        </h1>
        {loadError && (
          <p className="mt-3 text-sm text-[#E9283D] font-semibold">{loadError}</p>
        )}
        {loading || !initial ? (
          <p className="mt-8 text-sm text-gray-500">Loading…</p>
        ) : (
          <div className="mt-8">
            <GrantForm
              initial={initial}
              mode="edit"
              onSubmit={handleUpdate}
              submitLabel="Save changes"
            />
          </div>
        )}
      </div>
    </div>
  );
}
