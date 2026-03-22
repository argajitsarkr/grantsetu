import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard — Your Grant Recommendations",
  description: "View personalised grant recommendations, saved grants, and deadline reminders on your GrantSetu dashboard.",
  robots: { index: false, follow: false },
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return children;
}
