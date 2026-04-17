import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Life Sciences & Biotech Grant Alerts — GrantSetu",
  description:
    "Subscribe to free email alerts for Life Sciences & Biotechnology grants in India. Choose your subject areas, career stage, and agencies (DBT, BIRAC, ICMR and more). Weekly or daily notifications — no account required.",
  alternates: {
    canonical: "https://grantsetu.in/alerts",
  },
  openGraph: {
    title: "Free Grant Alerts — GrantSetu",
    description: "Get notified when new Indian research grants match your interests. Weekly or daily email alerts, completely free.",
  },
};

export default function AlertsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
