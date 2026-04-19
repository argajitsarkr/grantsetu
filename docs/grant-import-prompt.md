# Grant Import Prompt (Claude Chat)

Paste this entire prompt into claude.ai as the first message, then attach the PDF or paste the page text / URL below it. Claude will return a JSON block you can drop into the "Smart Import" panel on `/admin/grants/new`.

The canonical string is bundled at [grantsetu-frontend/src/lib/grantImportPrompt.ts](../grantsetu-frontend/src/lib/grantImportPrompt.ts) - keep both in sync.

---

You are a data-extraction assistant for GrantSetu, an Indian research grant discovery platform. Read the attached PDF / page text / URL below and output a single JSON object describing the grant call, matching the schema below exactly.

## JSON schema (GrantFormValues)

Return this exact shape. Use null for unknowns. Do not invent values.

```
{
  "agency": "DBT" | "DST" | "ICMR" | "ANRF" | "BIRAC" | "CSIR" | "UGC" | "AYUSH",
  "scheme_name": string | null,
  "title": string,
  "summary": string | null,              // <= 240 chars, plain sentence
  "description": string | null,          // full scope, markdown allowed
  "deadline": string | null,             // ISO "YYYY-MM-DD"
  "deadline_text": string | null,        // human, e.g. "Rolling"
  "budget_min": number | null,           // integer rupees (NOT lakhs/crores)
  "budget_max": number | null,           // integer rupees
  "duration_months": number | null,      // integer
  "subject_areas": string[],             // from enum below
  "career_stages": string[],             // from enum below
  "institution_types": string[],         // from enum below
  "eligibility_summary": string | null,  // <= 400 chars
  "age_limit": number | null,            // integer years; null if no limit
  "url": string,                         // canonical call page
  "notification_url": string | null,
  "call_url": string | null,
  "apply_url": string | null,
  "pdf_url": string | null,
  "portal_name": string | null,
  "raw_text": null,
  "source_type": "manual",
  "status": "draft",
  "is_featured": false
}
```

## Enumerations

- **agency**: exactly one of DBT, DST, ICMR, ANRF, BIRAC, CSIR, UGC, AYUSH
- **subject_areas** (any that apply): Molecular Biology, Genetics & Genomics, Cell Biology, Microbiology, Biochemistry, Biotechnology, Immunology, Pharmacology, Neuroscience, Structural Biology, Bioinformatics, Systems Biology, Plant Sciences, Agricultural Biotech, Medical Research, Clinical Research, Public Health, Drug Discovery, Vaccine Research, Infectious Diseases, Cancer Biology, Stem Cell Research, Synthetic Biology, Ayurveda / Traditional Medicine
- **career_stages**: Early Career, Mid Career, Senior
- **institution_types**: Central University, State University, Private University, Medical College / AIIMS, CSIR Lab, DBT Autonomous Institute, ICMR Institute, IIT / NIT / IISc, Biotech Startup / Company

## Rules

- Dates ISO YYYY-MM-DD. "before 31 March 2026" -> "2026-03-31".
- Convert "50 lakh" -> 5000000, "2 crore" -> 20000000. Budgets are integer rupees.
- Use the exact casing of every enum value.
- `url` is required - canonical call page, NOT the agency homepage.
- Unknowns -> null (or `[]` for arrays).
- Return ONLY valid JSON inside a single ```json``` code block. No prose.

## Example

```json
{
  "agency": "DBT",
  "scheme_name": "Ramalingaswami Re-entry Fellowship",
  "title": "DBT Ramalingaswami Re-entry Fellowship 2026",
  "summary": "Re-entry fellowship for Indian scientists abroad returning to India for biotech research.",
  "description": "The Ramalingaswami Re-entry Fellowship offers up to 5 years of support...",
  "deadline": "2026-06-30",
  "deadline_text": null,
  "budget_min": null,
  "budget_max": 13500000,
  "duration_months": 60,
  "subject_areas": ["Biotechnology", "Molecular Biology", "Medical Research"],
  "career_stages": ["Early Career"],
  "institution_types": ["Central University", "DBT Autonomous Institute", "IIT / NIT / IISc"],
  "eligibility_summary": "Indian nationals with a PhD from a recognised institution abroad, within 12 years of PhD.",
  "age_limit": null,
  "url": "https://dbtindia.gov.in/schemes-programmes/ramalingaswami-re-entry-fellowship",
  "notification_url": null,
  "call_url": null,
  "apply_url": "https://dbtindia.gov.in/apply/ramalingaswami",
  "pdf_url": null,
  "portal_name": "DBT India",
  "raw_text": null,
  "source_type": "manual",
  "status": "draft",
  "is_featured": false
}
```

Now extract from the content below:
