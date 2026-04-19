import type { Metadata } from "next";

const TITLE = "GrantSetu Weekly - Every Indian Grant Call, Every Monday";
const DESC = "Every open Indian research grant call. One email. Every Monday at 7 AM IST. Curated by a PhD researcher. Free forever, with an optional Pro tier (₹299/year).";

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: "https://grantsetu.in/newsletter" },
  openGraph: {
    title: TITLE,
    description: DESC,
    url: "https://grantsetu.in/newsletter",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESC,
  },
};

export default function NewsletterLayout({ children }: { children: React.ReactNode }) {
  return children;
}
