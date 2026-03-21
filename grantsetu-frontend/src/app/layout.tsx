import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Providers from "@/components/Providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "GrantSetu — Indian Research Grant Discovery",
    template: "%s | GrantSetu",
  },
  description:
    "Discover Indian government research grants from DBT, DST, ICMR, ANRF, BIRAC, CSIR, UGC, and more — all in one place.",
  keywords: [
    "Indian research grants",
    "DBT grants",
    "DST grants",
    "ICMR funding",
    "ANRF SERB grants",
    "BIRAC funding",
    "research funding India",
    "grant discovery",
  ],
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "GrantSetu",
    title: "GrantSetu — Never miss an Indian research grant",
    description:
      "GrantSetu tracks grant calls from DBT, DST, ICMR, ANRF, BIRAC, CSIR, UGC, and more — all in one place.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans flex flex-col min-h-screen bg-white">
        <Providers>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
