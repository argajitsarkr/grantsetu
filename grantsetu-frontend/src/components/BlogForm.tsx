"use client";

import { Component, ReactNode, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { API_URL } from "@/lib/constants";
import type { BlogPost } from "@/types";

class PreviewErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state = { error: null as Error | null };
  static getDerivedStateFromError(error: Error) {
    return { error };
  }
  render() {
    if (this.state.error) {
      return (
        <div className="border-2 border-[#E9283D] bg-[#E9283D]/5 rounded-lg p-6 text-[13px] text-[#E9283D]">
          <p className="font-bold mb-1">Preview failed to render.</p>
          <p className="text-black/70">
            The Markdown body contains something this renderer cannot handle. Edit the body and try again.
          </p>
          <pre className="mt-3 text-[11px] text-black/60 whitespace-pre-wrap break-words">
            {String(this.state.error.message || this.state.error)}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}

function preventEnterSubmit(e: React.KeyboardEvent<HTMLInputElement>) {
  if (e.key === "Enter") e.preventDefault();
}

interface Props {
  initial?: Partial<BlogPost>;
  mode: "create" | "edit";
  postId?: number;
}

const CATEGORIES = ["", "Guide", "Deep Dive", "Weekly Roundup", "Agency Spotlight", "Career", "Announcement"];

export default function BlogForm({ initial, mode, postId }: Props) {
  const router = useRouter();
  const { data: session } = useSession();
  const [title, setTitle] = useState(initial?.title || "");
  const [excerpt, setExcerpt] = useState(initial?.excerpt || "");
  const [coverImageUrl, setCoverImageUrl] = useState(initial?.cover_image_url || "");
  const [bodyMarkdown, setBodyMarkdown] = useState(initial?.body_markdown || "");
  const [authorName, setAuthorName] = useState(initial?.author_name || "GrantSetu Team");
  const [category, setCategory] = useState(initial?.category || "");
  const [tagsText, setTagsText] = useState(
    Array.isArray(initial?.tags) ? initial!.tags.join(", ") : ""
  );
  const [status, setStatus] = useState(initial?.status || "draft");
  const [isFeatured, setIsFeatured] = useState(!!initial?.is_featured);
  const [readMinutes, setReadMinutes] = useState<number | "">(initial?.read_minutes || "");
  const [preview, setPreview] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!session?.backendToken) {
      setError("Not authenticated.");
      return;
    }
    setSaving(true);
    setError(null);

    const payload: Record<string, unknown> = {
      title: title.trim(),
      excerpt: excerpt.trim() || null,
      cover_image_url: coverImageUrl.trim() || null,
      body_markdown: bodyMarkdown,
      author_name: authorName.trim() || "GrantSetu Team",
      category: category || null,
      tags: tagsText
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      status,
      is_featured: isFeatured,
      read_minutes: readMinutes === "" ? null : Number(readMinutes),
    };

    const url =
      mode === "create"
        ? `${API_URL}/api/v1/admin/blog`
        : `${API_URL}/api/v1/admin/blog/${postId}`;
    const method = mode === "create" ? "POST" : "PUT";

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.backendToken}`,
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || `${res.status}`);
      }
      router.push("/admin/blog");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        {/* Main column */}
        <div className="space-y-5">
          <Field label="Title *">
            <input
              required
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={preventEnterSubmit}
              className="w-full h-[48px] px-4 border-2 border-black rounded-lg text-[16px] focus:outline-none focus:border-[#E9283D]"
              placeholder="How to win your first DBT grant"
            />
          </Field>

          <Field label="Excerpt">
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={2}
              className="w-full px-4 py-3 border-2 border-black rounded-lg text-[14px] focus:outline-none focus:border-[#E9283D]"
              placeholder="One-sentence summary shown in listings and social cards."
            />
          </Field>

          <Field label="Cover image URL">
            <input
              type="url"
              value={coverImageUrl}
              onChange={(e) => setCoverImageUrl(e.target.value)}
              onKeyDown={preventEnterSubmit}
              className="w-full h-[48px] px-4 border-2 border-black rounded-lg text-[14px] focus:outline-none focus:border-[#E9283D]"
              placeholder="https://..."
            />
          </Field>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label
                className="text-[11px] uppercase tracking-[0.15em] font-bold text-black"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                Body (Markdown) *
              </label>
              <button
                type="button"
                onClick={() => setPreview((p) => !p)}
                className="text-[11px] uppercase tracking-wider font-bold text-[#E9283D] hover:underline"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {preview ? "← Edit" : "Preview →"}
              </button>
            </div>
            {preview ? (
              <div className="blog-prose border-2 border-black rounded-lg p-6 min-h-[400px] bg-white">
                <PreviewErrorBoundary>
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {bodyMarkdown || "*Nothing to preview yet.*"}
                  </ReactMarkdown>
                </PreviewErrorBoundary>
              </div>
            ) : (
              <textarea
                required
                value={bodyMarkdown}
                onChange={(e) => setBodyMarkdown(e.target.value)}
                rows={20}
                className="w-full px-4 py-3 border-2 border-black rounded-lg text-[14px] font-mono focus:outline-none focus:border-[#E9283D]"
                placeholder={"## Heading\n\nParagraph with **bold**, *italic*, [link](https://grantsetu.in), and ![image](https://...).\n\n- Bullet\n- List\n\n```\ncode block\n```"}
                style={{ fontFamily: "var(--font-mono)" }}
              />
            )}
            <p className="text-[11px] text-gray-500 mt-2">
              Supports GitHub-flavored Markdown: headings, bold/italic, links, images, lists, tables, code blocks.
            </p>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="space-y-5">
          <div className="border-2 border-black rounded-xl p-5 space-y-4">
            <h3
              className="text-[11px] uppercase tracking-[0.2em] font-bold text-black"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              Publish
            </h3>
            <Field label="Status">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full h-[44px] px-3 border-2 border-black rounded-lg text-[14px] font-semibold uppercase focus:outline-none focus:border-[#E9283D]"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </Field>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="w-4 h-4 accent-[#E9283D]"
              />
              <span className="text-[13px] font-semibold text-black">Feature on /blog</span>
            </label>
          </div>

          <div className="border-2 border-black rounded-xl p-5 space-y-4">
            <h3
              className="text-[11px] uppercase tracking-[0.2em] font-bold text-black"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              Meta
            </h3>
            <Field label="Author">
              <input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                onKeyDown={preventEnterSubmit}
                className="w-full h-[44px] px-3 border-2 border-black rounded-lg text-[14px] focus:outline-none focus:border-[#E9283D]"
              />
            </Field>
            <Field label="Category">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full h-[44px] px-3 border-2 border-black rounded-lg text-[14px] focus:outline-none focus:border-[#E9283D]"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c || "— None —"}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Tags (comma-separated)">
              <input
                type="text"
                value={tagsText}
                onChange={(e) => setTagsText(e.target.value)}
                onKeyDown={preventEnterSubmit}
                className="w-full h-[44px] px-3 border-2 border-black rounded-lg text-[14px] focus:outline-none focus:border-[#E9283D]"
                placeholder="dbt, early-career, proposal-writing"
              />
            </Field>
            <Field label="Read minutes">
              <input
                type="number"
                min={1}
                value={readMinutes}
                onChange={(e) =>
                  setReadMinutes(e.target.value === "" ? "" : Number(e.target.value))
                }
                onKeyDown={preventEnterSubmit}
                className="w-full h-[44px] px-3 border-2 border-black rounded-lg text-[14px] focus:outline-none focus:border-[#E9283D]"
              />
            </Field>
          </div>
        </aside>
      </div>

      {error && (
        <div className="border-2 border-[#E9283D] bg-[#E9283D]/5 text-[#E9283D] rounded-lg p-4 text-[13px]">
          {error}
        </div>
      )}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center justify-center h-[48px] px-8 bg-[#E9283D] text-white text-[13px] font-bold rounded-lg hover:bg-[#C91E30] uppercase tracking-wider transition-colors disabled:opacity-60"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          {saving ? "Saving…" : mode === "create" ? "Create Post" : "Save Changes"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/blog")}
          className="inline-flex items-center justify-center h-[48px] px-6 border-2 border-black text-black text-[13px] font-bold rounded-lg hover:bg-black hover:text-white uppercase tracking-wider transition-colors"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label
        className="block text-[11px] uppercase tracking-[0.15em] font-bold text-black mb-2"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        {label}
      </label>
      {children}
    </div>
  );
}
