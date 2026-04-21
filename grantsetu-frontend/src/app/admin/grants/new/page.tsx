"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import GrantForm, { EMPTY_GRANT, mergeGrantValues, type GrantFormValues } from "@/components/GrantForm";
import JsonImportPanel from "@/components/JsonImportPanel";
import { API_URL } from "@/lib/constants";

export default function AdminNewGrant() {
  const router = useRouter();
  const { data: session } = useSession();
  const [values, setValues] = useState<GrantFormValues>(EMPTY_GRANT);

  async function handleCreate(values: GrantFormValues) {
    const token = session?.backendToken;
    if (!token) throw new Error("Not authenticated.");
    const res = await fetch(`${API_URL}/api/v1/admin/grants`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(values),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.detail || `Failed (${res.status})`);
    }
    router.push("/admin/grants");
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        <Link
          href="/admin"
          className="text-[11px] uppercase tracking-[0.15em] text-gray-500 hover:text-[#E9283D] font-bold"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          ← Back to admin
        </Link>
        <h1
          className="mt-3 text-[2rem] sm:text-[2.5rem] font-black text-black leading-[1.05]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Add <span className="text-[#E9283D]">Grant.</span>
        </h1>
        <p className="mt-2 text-sm text-gray-600 mb-8">
          Fill the template below. Save as Draft to publish later, or Publish now to make it live.
        </p>
        <JsonImportPanel
          onFill={(partial) => setValues((v) => mergeGrantValues(v, partial))}
        />
        <GrantForm
          initial={EMPTY_GRANT}
          values={values}
          onChange={setValues}
          mode="create"
          onSubmit={handleCreate}
        />
      </div>
    </div>
  );
}
