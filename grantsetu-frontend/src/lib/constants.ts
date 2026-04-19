export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

/* ──────────────────────────────────────────────────────────────
 * GrantSetu - Life Sciences & Biotechnology Focus
 *
 * Agencies are ordered by relevance to life sciences / biotech research.
 * Primary: DBT, BIRAC, ICMR (core biotech & biomedical)
 * Secondary: CSIR (biosciences labs), AYUSH (traditional medicine R&D)
 * Tertiary: DST (has life sci programmes), ANRF (cross-disciplinary, incl. life sci)
 * ────────────────────────────────────────────────────────────── */

export const AGENCY_META: Record<string, { fullName: string; website: string; logo: string; logotype: "png" | "svg"; focus: "primary" | "secondary" | "tertiary" }> = {
  DBT: {
    fullName: "Department of Biotechnology",
    website: "https://dbt.gov.in",
    logo: "/logos/dbt.svg",
    logotype: "svg",
    focus: "primary",
  },
  BIRAC: {
    fullName: "Biotech Industry Research Assistance Council",
    website: "https://birac.nic.in",
    logo: "/logos/birac.png",
    logotype: "png",
    focus: "primary",
  },
  ICMR: {
    fullName: "Indian Council of Medical Research",
    website: "https://icmr.gov.in",
    logo: "/logos/icmr.jpg",
    logotype: "png",
    focus: "primary",
  },
  CSIR: {
    fullName: "Council of Scientific & Industrial Research",
    website: "https://csir.res.in",
    logo: "/logos/csir.png",
    logotype: "png",
    focus: "secondary",
  },
  AYUSH: {
    fullName: "Ministry of AYUSH",
    website: "https://ayush.gov.in",
    logo: "/logos/ayush.svg",
    logotype: "svg",
    focus: "secondary",
  },
  DST: {
    fullName: "Dept. of Science & Technology",
    website: "https://dst.gov.in",
    logo: "/logos/dst.png",
    logotype: "png",
    focus: "tertiary",
  },
  ANRF: {
    fullName: "Anusandhan National Research Foundation",
    website: "https://anrf.gov.in",
    logo: "/logos/anrf.svg",
    logotype: "svg",
    focus: "tertiary",
  },
};

/* NUUK-style monochrome colors - red/black/white only */
export const AGENCY_COLORS: Record<string, string> = {
  DBT:   "bg-black text-white border-black",
  BIRAC: "bg-black text-white border-black",
  ICMR:  "bg-black text-white border-black",
  CSIR:  "bg-white text-black border-black",
  AYUSH: "bg-white text-black border-black",
  DST:   "bg-white text-black border-gray-300",
  ANRF:  "bg-white text-black border-gray-300",
};

/* Ordered by life-sci relevance */
export const AGENCIES = [
  "DBT", "BIRAC", "ICMR", "CSIR", "AYUSH", "DST", "ANRF",
];

/* Primary agencies for Life Sci / Biotech */
export const PRIMARY_AGENCIES = ["DBT", "BIRAC", "ICMR"];

/* Life Sciences & Biotechnology subject areas */
export const SUBJECT_AREAS = [
  "Molecular Biology",
  "Genetics & Genomics",
  "Cell Biology",
  "Microbiology",
  "Biochemistry",
  "Biotechnology",
  "Immunology",
  "Pharmacology",
  "Neuroscience",
  "Structural Biology",
  "Bioinformatics",
  "Systems Biology",
  "Plant Sciences",
  "Agricultural Biotech",
  "Medical Research",
  "Clinical Research",
  "Public Health",
  "Drug Discovery",
  "Vaccine Research",
  "Infectious Diseases",
  "Cancer Biology",
  "Stem Cell Research",
  "Synthetic Biology",
  "Ayurveda / Traditional Medicine",
];

export const CAREER_STAGES = ["Early Career", "Mid Career", "Senior"];

export const INSTITUTION_TYPES = [
  "Central University",
  "State University",
  "Private University",
  "Medical College / AIIMS",
  "CSIR Lab",
  "DBT Autonomous Institute",
  "ICMR Institute",
  "IIT / NIT / IISc",
  "Biotech Startup / Company",
];

export const DEADLINE_FILTERS = [
  { value: "", label: "All" },
  { value: "open_now", label: "Open Now" },
  { value: "closing_soon", label: "Closing Soon (<7 days)" },
  { value: "rolling", label: "Rolling / No Deadline" },
];

export const SORT_OPTIONS = [
  { value: "deadline_asc", label: "Deadline (soonest first)" },
  { value: "newest", label: "Newest first" },
  { value: "budget_desc", label: "Budget (highest)" },
];

export const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Andaman & Nicobar", "Chandigarh", "Dadra & Nagar Haveli and Daman & Diu",
  "Delhi", "Jammu & Kashmir", "Ladakh", "Lakshadweep", "Puducherry",
];

export const DESIGNATIONS = [
  "PhD Student",
  "Postdoctoral Fellow",
  "Research Associate",
  "Assistant Professor",
  "Associate Professor",
  "Professor",
  "Scientist / Senior Scientist",
  "Principal Scientist",
  "Clinician-Researcher",
  "Biotech Entrepreneur",
  "Other",
];

export function formatINR(amount: number): string {
  if (amount >= 10000000) {
    return `\u20B9${(amount / 10000000).toFixed(1)} Cr`;
  }
  if (amount >= 100000) {
    return `\u20B9${(amount / 100000).toFixed(1)} L`;
  }
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function daysUntil(dateStr: string): number {
  const deadline = new Date(dateStr);
  const now = new Date();
  return Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}
