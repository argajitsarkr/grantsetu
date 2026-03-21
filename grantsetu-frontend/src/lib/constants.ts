export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const AGENCY_META: Record<string, { fullName: string; website: string; logo: string; logotype: "png" | "svg" }> = {
  DBT: {
    fullName: "Department of Biotechnology",
    website: "https://dbt.gov.in",
    logo: "/logos/dbt.svg",
    logotype: "svg",
  },
  DST: {
    fullName: "Dept. of Science & Technology",
    website: "https://dst.gov.in",
    logo: "/logos/dst.png",
    logotype: "png",
  },
  ICMR: {
    fullName: "Indian Council of Medical Research",
    website: "https://icmr.gov.in",
    logo: "/logos/icmr.jpg",
    logotype: "png",
  },
  ANRF: {
    fullName: "Anusandhan National Research Foundation",
    website: "https://anrf.gov.in",
    logo: "/logos/anrf.svg",
    logotype: "svg",
  },
  BIRAC: {
    fullName: "Biotech Industry Research Assistance Council",
    website: "https://birac.nic.in",
    logo: "/logos/birac.png",
    logotype: "png",
  },
  CSIR: {
    fullName: "Council of Scientific & Industrial Research",
    website: "https://csir.res.in",
    logo: "/logos/csir.png",
    logotype: "png",
  },
  UGC: {
    fullName: "University Grants Commission",
    website: "https://ugc.gov.in",
    logo: "/logos/ugc.jpg",
    logotype: "png",
  },
  AYUSH: {
    fullName: "Ministry of AYUSH",
    website: "https://ayush.gov.in",
    logo: "/logos/ayush.svg",
    logotype: "svg",
  },
};

export const AGENCY_COLORS: Record<string, string> = {
  DBT: "bg-blue-50 text-blue-700 border-blue-200",
  DST: "bg-teal-50 text-teal-700 border-teal-200",
  ICMR: "bg-red-50 text-red-700 border-red-200",
  ANRF: "bg-orange-50 text-orange-700 border-orange-200",
  BIRAC: "bg-purple-50 text-purple-700 border-purple-200",
  CSIR: "bg-cyan-50 text-cyan-700 border-cyan-200",
  UGC: "bg-yellow-50 text-yellow-700 border-yellow-200",
  AYUSH: "bg-lime-50 text-lime-700 border-lime-200",
};

export const AGENCIES = [
  "DBT", "DST", "ICMR", "ANRF", "BIRAC", "CSIR", "UGC", "AYUSH",
];

export const SUBJECT_AREAS = [
  "Life Sciences",
  "Physical Sciences",
  "Engineering",
  "Medical/Health",
  "Computer Science",
  "Social Sciences",
  "Biotechnology",
  "Interdisciplinary",
];

export const CAREER_STAGES = ["Early Career", "Mid Career", "Senior"];

export const INSTITUTION_TYPES = [
  "Central University",
  "State University",
  "Private",
  "CSIR Lab",
  "IIT/NIT",
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
  "Assistant Professor",
  "Associate Professor",
  "Professor",
  "Scientist",
  "Senior Scientist",
  "Principal Scientist",
  "Research Associate",
  "Project Scientist",
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
