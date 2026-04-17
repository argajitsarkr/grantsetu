import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Account",
  description: "Create your GrantSetu account — free forever. Save grants, set up alerts, and get personalised recommendations.",
  robots: { index: false, follow: false },
};

export default function SignUpLayout({ children }: { children: React.ReactNode }) {
  return children;
}
