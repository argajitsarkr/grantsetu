import type { Metadata } from "next";

const TITLE = "GrantSetu Studio - Collaborative Grant Writing | Coming Soon";
const DESC = "The collaborative workspace for Indian research grants. Write proposals together, calculate budgets in grant-portal format, and auto-fill biodata + publications. Coming Q3 2026 - join the waitlist.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: "https://grantsetu.in/studio" },
  openGraph: {
    title: TITLE,
    description: DESC,
    url: "https://grantsetu.in/studio",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESC,
  },
};

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return children;
}
