/**
 * Email-domain → institution lookup. Used by the onboarding form to pre-fill
 * Institution Name + Type + State from the user's signup email so they don't
 * have to type it. Names match what /admin/users displays so admin filters
 * stay clean. Extend freely - keys must be lowercase, no leading "@".
 */

export interface InstMeta {
  institution: string;
  institution_type: string; // must be one of INSTITUTION_TYPES from constants.ts
  state?: string;           // must match an entry in INDIAN_STATES, else omit
}

export const EMAIL_DOMAIN_TO_INST: Record<string, InstMeta> = {
  // ── IITs ─────────────────────────────────────────────────────────────────
  "iitb.ac.in":      { institution: "Indian Institute of Technology Bombay",       institution_type: "IIT / NIT / IISc", state: "Maharashtra" },
  "iitd.ac.in":      { institution: "Indian Institute of Technology Delhi",        institution_type: "IIT / NIT / IISc", state: "Delhi" },
  "iitm.ac.in":      { institution: "Indian Institute of Technology Madras",       institution_type: "IIT / NIT / IISc", state: "Tamil Nadu" },
  "iitk.ac.in":      { institution: "Indian Institute of Technology Kanpur",       institution_type: "IIT / NIT / IISc", state: "Uttar Pradesh" },
  "iitkgp.ac.in":    { institution: "Indian Institute of Technology Kharagpur",    institution_type: "IIT / NIT / IISc", state: "West Bengal" },
  "iitr.ac.in":      { institution: "Indian Institute of Technology Roorkee",      institution_type: "IIT / NIT / IISc", state: "Uttarakhand" },
  "iitg.ac.in":      { institution: "Indian Institute of Technology Guwahati",     institution_type: "IIT / NIT / IISc", state: "Assam" },
  "iith.ac.in":      { institution: "Indian Institute of Technology Hyderabad",    institution_type: "IIT / NIT / IISc", state: "Telangana" },
  "iitbbs.ac.in":    { institution: "Indian Institute of Technology Bhubaneswar",  institution_type: "IIT / NIT / IISc", state: "Odisha" },
  "iitp.ac.in":      { institution: "Indian Institute of Technology Patna",        institution_type: "IIT / NIT / IISc", state: "Bihar" },
  "iitrpr.ac.in":    { institution: "Indian Institute of Technology Ropar",        institution_type: "IIT / NIT / IISc", state: "Punjab" },
  "iitmandi.ac.in":  { institution: "Indian Institute of Technology Mandi",        institution_type: "IIT / NIT / IISc", state: "Himachal Pradesh" },
  "iiti.ac.in":      { institution: "Indian Institute of Technology Indore",       institution_type: "IIT / NIT / IISc", state: "Madhya Pradesh" },
  "iitj.ac.in":      { institution: "Indian Institute of Technology Jodhpur",      institution_type: "IIT / NIT / IISc", state: "Rajasthan" },
  "iitgn.ac.in":     { institution: "Indian Institute of Technology Gandhinagar",  institution_type: "IIT / NIT / IISc", state: "Gujarat" },
  "iitpkd.ac.in":    { institution: "Indian Institute of Technology Palakkad",     institution_type: "IIT / NIT / IISc", state: "Kerala" },
  "iitdh.ac.in":     { institution: "Indian Institute of Technology Dharwad",      institution_type: "IIT / NIT / IISc", state: "Karnataka" },
  "iittp.ac.in":     { institution: "Indian Institute of Technology Tirupati",     institution_type: "IIT / NIT / IISc", state: "Andhra Pradesh" },
  "iitbhilai.ac.in": { institution: "Indian Institute of Technology Bhilai",       institution_type: "IIT / NIT / IISc", state: "Chhattisgarh" },
  "iitjammu.ac.in":  { institution: "Indian Institute of Technology Jammu",        institution_type: "IIT / NIT / IISc", state: "Jammu & Kashmir" },
  "iitgoa.ac.in":    { institution: "Indian Institute of Technology Goa",          institution_type: "IIT / NIT / IISc", state: "Goa" },

  // ── IISERs ───────────────────────────────────────────────────────────────
  "iiserb.ac.in":        { institution: "Indian Institute of Science Education and Research Bhopal",     institution_type: "IIT / NIT / IISc", state: "Madhya Pradesh" },
  "iiserkol.ac.in":      { institution: "Indian Institute of Science Education and Research Kolkata",    institution_type: "IIT / NIT / IISc", state: "West Bengal" },
  "iisermohali.ac.in":   { institution: "Indian Institute of Science Education and Research Mohali",     institution_type: "IIT / NIT / IISc", state: "Punjab" },
  "iisertvm.ac.in":      { institution: "Indian Institute of Science Education and Research Thiruvananthapuram", institution_type: "IIT / NIT / IISc", state: "Kerala" },
  "iiserpune.ac.in":     { institution: "Indian Institute of Science Education and Research Pune",       institution_type: "IIT / NIT / IISc", state: "Maharashtra" },
  "iisertirupati.ac.in": { institution: "Indian Institute of Science Education and Research Tirupati",   institution_type: "IIT / NIT / IISc", state: "Andhra Pradesh" },
  "iiserberhampur.ac.in":{ institution: "Indian Institute of Science Education and Research Berhampur",  institution_type: "IIT / NIT / IISc", state: "Odisha" },

  // ── IISc + NCBS + TIFR ───────────────────────────────────────────────────
  "iisc.ac.in":   { institution: "Indian Institute of Science",                       institution_type: "IIT / NIT / IISc",         state: "Karnataka" },
  "ncbs.res.in":  { institution: "National Centre for Biological Sciences (TIFR)",    institution_type: "DBT Autonomous Institute", state: "Karnataka" },
  "tifr.res.in":  { institution: "Tata Institute of Fundamental Research",            institution_type: "DBT Autonomous Institute", state: "Maharashtra" },

  // ── AIIMS ────────────────────────────────────────────────────────────────
  "aiims.edu":         { institution: "All India Institute of Medical Sciences, New Delhi", institution_type: "Medical College / AIIMS", state: "Delhi" },
  "aiimsbhopal.edu.in":{ institution: "AIIMS Bhopal",                                       institution_type: "Medical College / AIIMS", state: "Madhya Pradesh" },
  "aiimsbhubaneswar.edu.in": { institution: "AIIMS Bhubaneswar",                            institution_type: "Medical College / AIIMS", state: "Odisha" },
  "aiimsjodhpur.edu.in":{ institution: "AIIMS Jodhpur",                                     institution_type: "Medical College / AIIMS", state: "Rajasthan" },
  "aiimspatna.edu.in":  { institution: "AIIMS Patna",                                       institution_type: "Medical College / AIIMS", state: "Bihar" },

  // ── CSIR labs ────────────────────────────────────────────────────────────
  "iicb.res.in":   { institution: "CSIR-Indian Institute of Chemical Biology",          institution_type: "CSIR Lab", state: "West Bengal" },
  "imtech.res.in": { institution: "CSIR-Institute of Microbial Technology",             institution_type: "CSIR Lab", state: "Chandigarh" },
  "iiim.res.in":   { institution: "CSIR-Indian Institute of Integrative Medicine",      institution_type: "CSIR Lab", state: "Jammu & Kashmir" },
  "iict.res.in":   { institution: "CSIR-Indian Institute of Chemical Technology",       institution_type: "CSIR Lab", state: "Telangana" },
  "cdri.res.in":   { institution: "CSIR-Central Drug Research Institute",               institution_type: "CSIR Lab", state: "Uttar Pradesh" },
  "cimap.res.in":  { institution: "CSIR-Central Institute of Medicinal and Aromatic Plants", institution_type: "CSIR Lab", state: "Uttar Pradesh" },
  "nbri.res.in":   { institution: "CSIR-National Botanical Research Institute",         institution_type: "CSIR Lab", state: "Uttar Pradesh" },

  // ── Central / state universities ────────────────────────────────────────
  "du.ac.in":          { institution: "University of Delhi",         institution_type: "Central University", state: "Delhi" },
  "jnu.ac.in":         { institution: "Jawaharlal Nehru University", institution_type: "Central University", state: "Delhi" },
  "bhu.ac.in":         { institution: "Banaras Hindu University",    institution_type: "Central University", state: "Uttar Pradesh" },
  "ju.ac.in":          { institution: "Jadavpur University",         institution_type: "State University",   state: "West Bengal" },
  "tezu.ernet.in":     { institution: "Tezpur University",           institution_type: "Central University", state: "Assam" },
  "tripurauniv.ac.in": { institution: "Tripura University",          institution_type: "Central University", state: "Tripura" },
  "manipal.edu":       { institution: "Manipal Academy of Higher Education", institution_type: "Private University", state: "Karnataka" },

  // ── ICMR / others ────────────────────────────────────────────────────────
  "nio.org":       { institution: "CSIR-National Institute of Oceanography",      institution_type: "CSIR Lab",         state: "Goa" },
  "nivedi.res.in": { institution: "ICAR-National Institute of Veterinary Epidemiology and Disease Informatics", institution_type: "ICMR Institute", state: "Karnataka" },
};

/**
 * Given an email like "arghya.s@iitr.ac.in", return the matching institution
 * meta (or null). Tries exact match first, then strips one subdomain level
 * to handle dept-prefixed addresses (e.g. "user@chem.iitb.ac.in").
 */
export function lookupInstitutionByEmail(email: string | null | undefined): InstMeta | null {
  if (!email || !email.includes("@")) return null;
  const domain = email.split("@")[1].toLowerCase().trim();

  if (EMAIL_DOMAIN_TO_INST[domain]) return EMAIL_DOMAIN_TO_INST[domain];

  // Strip one leading subdomain: chem.iitb.ac.in -> iitb.ac.in
  const parts = domain.split(".");
  if (parts.length > 3) {
    const stripped = parts.slice(1).join(".");
    if (EMAIL_DOMAIN_TO_INST[stripped]) return EMAIL_DOMAIN_TO_INST[stripped];
  }

  return null;
}
