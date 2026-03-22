import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Set Up Free Grant Alerts — Get Notified About New Indian Research Grants",
  description:
    "Subscribe to free email alerts for Indian research grants. Choose your subject areas, career stage, and agencies (DBT, DST, ICMR, ANRF, BIRAC, CSIR, UGC, AYUSH). Get weekly or daily notifications — no account required.",
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
