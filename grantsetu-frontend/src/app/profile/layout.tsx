import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Edit Profile",
  description: "Update your research profile for better grant recommendations on GrantSetu.",
  robots: { index: false, follow: false },
};

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return children;
}
