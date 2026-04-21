"use client";

import { useState } from "react";
import type { GrantFormValues } from "@/components/GrantForm";
import { GRANT_IMPORT_PROMPT } from "@/lib/grantImportPrompt";
import { AGENCIES } from "@/lib/constants";

const monoLabel = { fontFamily: "var(--font-mono)" } as const;

function stripJsonFence(s: string): string {
  const trimmed = s.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenced) return fenced[1].trim();
  return trimmed;
}

export default function JsonImportPanel({
  onFill,
}: {
  onFill: (partial: Partial<GrantFormValues>) => void;
}) {
  const [open, setOpen] = useState(true);
  const [text, setText] = useState("");
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; body: string } | null>(null);
  const [copied, setCopied] = useState(false);

  function handleFill() {
    setMsg(null);
    if (!text.trim()) {
      setMsg({ kind: "err", body: "Paste Claude's JSON output first." });
      return;
    }
    const cleaned = stripJsonFence(text);
    let parsed: unknown;
    try {
      parsed = JSON.parse(cleaned);
    } catch (e) {
      setMsg({ kind: "err", body: `Invalid JSON: ${e instanceof Error ? e.message : "parse error"}` });
      return;
    }
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      setMsg({ kind: "err", body: "Expected a JSON object." });
      return;
    }
    const obj = parsed as Record<string, unknown>;
    if (obj.agency && typeof obj.agency === "string" && !AGENCIES.includes(obj.agency)) {
      setMsg({
        kind: "err",
        body: `Unknown agency "${obj.agency}". Must be one of: ${AGENCIES.join(", ")}`,
      });
      return;
    }
    onFill(obj as Partial<GrantFormValues>);
    const filled = Object.keys(obj).filter((k) => {
      const v = obj[k];
      return v !== null && v !== undefined && !(Array.isArray(v) && v.length === 0);
    }).length;
    setMsg({ kind: "ok", body: `Filled ${filled} field${filled === 1 ? "" : "s"}. Review and Publish.` });
  }

  async function handleCopyPrompt() {
    try {
      await navigator.clipboard.writeText(GRANT_IMPORT_PROMPT);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setMsg({ kind: "err", body: "Clipboard blocked - copy the prompt manually from docs/grant-import-prompt.md." });
    }
  }

  return (
    <div className="border-2 border-[#E9283D] rounded-xl bg-[#E9283D]/5 mb-6">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-5 py-3"
      >
        <span
          className="text-[11px] uppercase tracking-[0.2em] font-bold text-[#E9283D]"
          style={monoLabel}
        >
          ⚡ Smart Import - Paste JSON from Claude
        </span>
        <span className="text-[#E9283D] text-[18px]">{open ? "−" : "+"}</span>
      </button>

      {open && (
        <div className="px-5 pb-5 space-y-3">
          <p className="text-[13px] text-black leading-relaxed">
            <strong>How it works:</strong> Copy the prompt below, paste it into{" "}
            <a
              href="https://claude.ai/new"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#E9283D] font-bold underline"
            >
              claude.ai
            </a>
            , attach the grant PDF (or paste the page text / URL) after it, then paste Claude&apos;s JSON
            response here and click <strong>Fill form</strong>.
          </p>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleCopyPrompt}
              className="bg-black text-white px-4 py-2 rounded-lg text-[11px] font-bold uppercase tracking-wider hover:bg-[#E9283D] transition-colors"
              style={monoLabel}
            >
              {copied ? "✓ Copied" : "Copy Prompt Template"}
            </button>
            <a
              href="https://github.com/argajitsarkr/grantsetu/blob/main/docs/grant-import-prompt.md"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white border-2 border-black text-black px-4 py-2 rounded-lg text-[11px] font-bold uppercase tracking-wider hover:bg-black hover:text-white transition-colors"
              style={monoLabel}
            >
              View on GitHub →
            </a>
          </div>

          <textarea
            rows={6}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder='Paste Claude&apos;s ```json ... ``` block here'
            className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 text-[13px] font-mono text-black focus:border-[#E9283D] focus:ring-2 focus:ring-[#E9283D]/20 outline-none"
          />

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleFill}
              className="bg-[#E9283D] text-white px-5 py-2 rounded-lg text-[12px] font-bold uppercase tracking-wider hover:bg-[#C91E30] transition-colors"
              style={monoLabel}
            >
              Fill Form →
            </button>
            <button
              type="button"
              onClick={() => {
                setText("");
                setMsg(null);
              }}
              className="text-[11px] uppercase tracking-wider font-bold text-gray-600 hover:text-[#E9283D]"
              style={monoLabel}
            >
              Clear
            </button>
            {msg && (
              <span
                className={`text-[12px] font-semibold ${msg.kind === "ok" ? "text-black" : "text-[#E9283D]"}`}
              >
                {msg.body}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
