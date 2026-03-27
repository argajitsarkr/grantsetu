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

const SITE_URL = "https://grantsetu.in";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "GrantSetu — Discover Indian Research Grants from DBT, DST, ICMR, ANRF, CSIR, UGC",
    template: "%s | GrantSetu — Indian Research Grant Discovery",
  },
  description:
    "GrantSetu is India's free research grant discovery platform. Browse and filter active grant calls from DBT, DST, ICMR, ANRF (SERB), BIRAC, CSIR, UGC, and AYUSH — updated daily from official government portals. Set up alerts, track deadlines, and never miss a funding opportunity.",
  keywords: [
    "Indian research grants",
    "DBT grants India",
    "DST grants India",
    "ICMR funding",
    "ANRF grants",
    "SERB grants",
    "BIRAC funding",
    "CSIR grants",
    "UGC grants",
    "AYUSH research funding",
    "research funding India",
    "grant discovery India",
    "government research grants India",
    "PhD funding India",
    "postdoc grants India",
    "early career researcher grants India",
    "research grant deadlines India",
    "call for proposals India",
    "science funding India",
    "biotechnology grants India",
    "medical research grants India",
    "engineering grants India",
    "university grants India",
    "NE India research grants",
    "Northeast India funding",
    "women scientist grants India",
    "startup research grants India",
  ],
  authors: [{ name: "Argajit Sen", url: SITE_URL }],
  creator: "Argajit Sen",
  publisher: "GrantSetu",
  formatDetection: {
    email: false,
    telephone: false,
  },
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: SITE_URL,
    siteName: "GrantSetu",
    title: "GrantSetu — Discover Indian Research Grants from 8+ Government Agencies",
    description:
      "India's free grant discovery platform. Browse active grant calls from DBT, DST, ICMR, ANRF, BIRAC, CSIR, UGC & AYUSH — updated daily from official portals.",
    images: [
      {
        url: `${SITE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "GrantSetu — Indian Research Grant Discovery Platform",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "GrantSetu — Discover Indian Research Grants",
    description:
      "Free platform tracking grant calls from DBT, DST, ICMR, ANRF, BIRAC, CSIR, UGC & AYUSH. Updated daily.",
    images: [`${SITE_URL}/og-image.png`],
    creator: "@grantsetu",
    site: "@grantsetu",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // Add these when you register with Google/Bing
    // google: "your-google-verification-code",
    // other: { "msvalidate.01": "your-bing-verification-code" },
  },
  category: "Education",
};

/* ── Organization JSON-LD — appears on every page ── */
const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "GrantSetu",
  url: SITE_URL,
  logo: `${SITE_URL}/grantsetu-logo.png`,
  description:
    "India's free research grant discovery platform aggregating calls from DBT, DST, ICMR, ANRF, BIRAC, CSIR, UGC, and AYUSH.",
  foundingDate: "2026",
  founder: {
    "@type": "Person",
    name: "Argajit Sen",
    jobTitle: "PhD Candidate",
    affiliation: {
      "@type": "CollegeOrUniversity",
      name: "Tripura University",
    },
  },
  sameAs: [
    "https://x.com/grantsetu",
    "https://linkedin.com/company/grantsetu",
    "https://github.com/argajitsarkr/grantsetu",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer support",
    email: "argajit05@gmail.com",
  },
};

/* ── WebSite JSON-LD with SearchAction — enables Google Sitelinks Searchbox ── */
const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "GrantSetu",
  url: SITE_URL,
  description: "Discover Indian government research grants from 8+ agencies — all in one place.",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${SITE_URL}/grants?search={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="48x48" />
        <link rel="icon" href="/favicon-16x16.png" sizes="16x16" type="image/png" />
        <link rel="icon" href="/favicon-32x32.png" sizes="32x32" type="image/png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#05073F" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </head>
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
