"use client";

import { useState } from "react";

interface ShareButtonProps {
  url: string;
  title: string;
  deadline?: string | Date | null;
  variant?: "full" | "icon-only";
}

function formatDeadline(deadline: string | Date | null | undefined): string {
  if (!deadline) return "Rolling / see details";
  const d = typeof deadline === "string" ? new Date(deadline) : deadline;
  if (isNaN(d.getTime())) return "See details";
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function buildWhatsAppUrl(url: string, title: string, deadline: string | Date | null | undefined): string {
  const message = `🔬 *${title}*\n📅 Deadline: ${formatDeadline(deadline)}\n🔗 ${url}`;
  return `https://wa.me/?text=${encodeURIComponent(message)}`;
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.304-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

export default function ShareButton({ url, title, deadline, variant = "full" }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);
  const whatsappUrl = buildWhatsAppUrl(url, title, deadline);

  async function handleGenericShare() {
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        // user cancelled or not supported, fall through to clipboard
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard not available
    }
  }

  if (variant === "icon-only") {
    return (
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
        title="Share on WhatsApp"
        aria-label="Share on WhatsApp"
        className="inline-flex items-center justify-center h-7 w-7 rounded-full text-white transition-transform hover:scale-110"
        style={{ backgroundColor: "#25D366" }}
      >
        <WhatsAppIcon className="h-3.5 w-3.5" />
      </a>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-4 py-2 rounded-pill text-sm font-medium text-white transition-opacity hover:opacity-90"
        style={{ backgroundColor: "#25D366" }}
      >
        <WhatsAppIcon className="h-4 w-4" />
        Share on WhatsApp
      </a>
      <button
        type="button"
        onClick={handleGenericShare}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-pill text-sm font-medium text-brand-500 border border-brand-200 hover:bg-brand-50 transition-colors"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
        </svg>
        {copied ? "Link copied!" : "Copy link"}
      </button>
    </div>
  );
}
