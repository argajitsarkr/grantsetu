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
    default: "GrantSetu - India's Research Grants Hub for Life Sciences & Biotechnology",
    template: "%s | GrantSetu - Life Sciences & Biotech Grants India",
  },
  description:
    "GrantSetu is India's #1 free grant discovery platform for Life Sciences and Biotechnology researchers. Browse active grant calls from DBT, BIRAC, ICMR and allied agencies - curated daily for biotech, biomedical and life science research.",
  keywords: [
    "Life sciences grants India",
    "Biotechnology grants India",
    "DBT grants India",
    "BIRAC funding",
    "ICMR funding",
    "biomedical research grants India",
    "biotech research funding",
    "DBT Wellcome India Alliance",
    "BIRAC BIG grant",
    "Ramalingaswami fellowship",
    "ICMR research associate",
    "vaccine research grants India",
    "drug discovery grants India",
    "cancer biology grants India",
    "genomics grants India",
    "molecular biology grants India",
    "immunology grants India",
    "synthetic biology grants India",
    "bioinformatics grants India",
    "agricultural biotech grants",
    "AYUSH research funding",
    "PhD funding life sciences India",
    "postdoc biotech grants India",
    "early career researcher grants biotech",
    "women in biotech grants India",
    "BioCARe DBT",
    "NE India biotech research grants",
    "Northeast India life sciences funding",
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
    languages: {
      "en-IN": SITE_URL,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: SITE_URL,
    siteName: "GrantSetu",
    title: "GrantSetu - India's Research Grants Hub for Life Sciences & Biotechnology",
    description:
      "India's #1 free grant discovery platform for Life Sciences & Biotechnology. DBT, BIRAC, ICMR grants curated daily from official portals.",
    images: [
      {
        url: `${SITE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "GrantSetu - Indian Research Grant Discovery Platform",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "GrantSetu - Life Sciences & Biotech Grants India",
    description:
      "India's #1 grant platform for Life Sciences & Biotechnology. DBT · BIRAC · ICMR - updated daily.",
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
    // TODO: replace with real tokens from Search Console + Bing Webmaster after deploy.
    google: "TODO-gsc-token",
    other: { "msvalidate.01": "TODO-bing-token" },
  },
  category: "Education",
};

/* ── Organization JSON-LD - appears on every page ── */
const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "GrantSetu",
  url: SITE_URL,
  logo: `${SITE_URL}/grantsetu-logo.png`,
  description:
    "India's #1 free grant discovery platform for Life Sciences and Biotechnology - curating calls from DBT, BIRAC, ICMR and allied agencies.",
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

/* ── WebSite JSON-LD with SearchAction - enables Google Sitelinks Searchbox ── */
const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "GrantSetu",
  url: SITE_URL,
  description: "Discover Indian government research grants for Life Sciences & Biotechnology - DBT, BIRAC, ICMR and more.",
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
    <html lang="en-IN" className={inter.variable}>
      <head>
        <link rel="icon" href="/favicon.ico?v=2" sizes="48x48" />
        <link rel="icon" href="/favicon-16x16.png?v=2" sizes="16x16" type="image/png" />
        <link rel="icon" href="/favicon-32x32.png?v=2" sizes="32x32" type="image/png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png?v=2" sizes="180x180" />
        <link rel="manifest" href="/manifest.json?v=2" />
        <meta name="theme-color" content="#E9283D" />
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
