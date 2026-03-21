# GrantSetu — Design System & Architecture Reference

> **For future Claude sessions.** Read this before touching any UI code.

---

## Project Overview

**GrantSetu** is a free Indian research grant discovery platform. Target users: PhD students, postdocs, and faculty in Indian universities (especially Tier-2 and NE institutions). Built by Argajit Sen, PhD candidate, Tripura University.

- **Working directory:** `C:\Users\Arghya\Downloads\grantsetu`
- **Backend:** `grantsetu-backend/` (FastAPI + PostgreSQL + Redis + Celery)
- **Frontend:** `grantsetu-frontend/` (Next.js 14.2 + Tailwind CSS)
- **Docker:** `docker-compose.yml` in root

---

## Design Inspiration

The UI is modelled after **[Topmate.io](https://topmate.io)** — clean, warm, professional SaaS style:
- Warm off-white / peach hero backgrounds (not pure white)
- Heavy use of `rounded-2xl` / `rounded-xl` cards with subtle borders and soft shadows
- Dark navy footer/CTA sections contrasting white body
- Bold display headings with tight letter-spacing
- Accent colour: bright amber/orange (`accent-*` tokens)

---

## Typography

| Role | Font | Tailwind class |
|------|------|----------------|
| Display headings | Inter / system-ui, Black weight | `text-display-xl`, `font-bold`, `tracking-heading` |
| Body | Inter / system-ui, Regular | `text-base`, `leading-relaxed` |
| UI labels, badges | Inter, SemiBold | `text-xs font-semibold uppercase tracking-wider` |
| Code / mono | JetBrains Mono | `font-mono` |

---

## Colour Tokens (Tailwind config)

```js
// grantsetu-frontend/tailwind.config.ts
colors: {
  brand: {
    50:  '#F9F7F5',  // warm off-white background
    100: '#F0EDE8',  // subtle card border fill
    200: '#D9D4CC',  // card borders
    300: '#A89E92',  // muted text
    400: '#7A6E63',  // secondary text
    500: '#5C5148',  // body text
    600: '#3D342B',  // slightly dark body
    700: '#2B221A',  // dark headings
    800: '#1A1108',
    900: '#0D0804',  // near-black
  },
  accent: {
    400: '#F59E0B',  // amber highlight (lighter)
    500: '#D97706',  // primary CTA amber
    600: '#B45309',  // hover accent
  },
  warm: {
    100: '#FFF8F0',
    200: '#FEF3E2',  // hero section bg
    300: '#FDE8C8',
  },
  dark: '#0F0D0B',  // dark CTA section bg
}
```

---

## Spacing & Layout Conventions

| Token | Value | Usage |
|-------|-------|-------|
| `container-main` | `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8` | All page wrappers |
| `section-padding` | `py-20 sm:py-24` | Section vertical padding |
| `card` | `bg-white rounded-2xl border border-brand-100 shadow-sm p-6` | Standard card |
| `card-hover` | `hover:shadow-md hover:border-brand-200 transition-all duration-200` | Interactive card |
| `tag` | `px-2.5 py-0.5 bg-brand-50 text-brand-600 rounded-full text-xs font-medium` | Subject area pill |
| `rounded-pill` | `rounded-full` | Social proof / hero pills |

---

## Component Map

```
src/
  components/
    Navbar.tsx          – Top nav with mobile hamburger, brand logo (uses /grantsetu-logo.png, 140×42)
    Footer.tsx          – Dark footer with links + newsletter CTA placeholder (logo 160×48, no filter)
    AgencyBadge.tsx     – Wraps AgencyLogo in "badge" variant (keep for backward compat)
    AgencyLogo.tsx      – ★ PRIMARY logo component (see below)
    DeadlineBadge.tsx   – Coloured pill: red (urgent) / yellow / green / grey
    GrantCard.tsx       – Card used in grant feed list
    GrantFilters.tsx    – Sidebar + mobile drawer with URL-driven filters
    SearchBar.tsx       – Debounced 500ms search input
    Pagination.tsx      – Page prev/next controls
```

---

## AgencyLogo Component

**File:** `src/components/AgencyLogo.tsx`

The central component for all agency branding. Has three variants:

| Variant | Size | Used in |
|---------|------|---------|
| `"badge"` | small inline pill with 16×16 logo | GrantCard, breadcrumbs |
| `"card"` | 96×56 logo + name below | Landing page agency grid |
| `"full"` | 128×40 wide logo strip | Grant detail page header |

```tsx
// Usage examples
<AgencyLogo agency="DBT" variant="badge" />
<AgencyLogo agency="DST" variant="card" showName={true} />
<AgencyLogo agency="ICMR" variant="full" showName={false} />
```

**Fallback:** If the image fails to load (`onError`), falls back to `AgencyTextBadge` which uses the `AGENCY_COLORS` map (coloured text pill). Never breaks the UI.

---

## Site Logo

**File:** `grantsetu-frontend/public/grantsetu-logo.png`
**Size:** 2000×2000 RGBA PNG (original), rendered at 140×42 in Navbar and 160×48 in Footer.
**Design:** Red and Black minimalist — works on white navbar backgrounds naturally. Red elements show through on dark footer background (no CSS filter applied).
**Usage in code:**
```tsx
<Image src="/grantsetu-logo.png" alt="GrantSetu" width={140} height={42} className="object-contain" priority />
```

---

## Agency Logo Assets

**Directory:** `grantsetu-frontend/public/logos/`

| Agency | File | Source |
|--------|------|--------|
| DBT | `dbt.svg` | Custom SVG (DNA helix motif, blue) |
| DST | `dst.png` | Downloaded from dst.gov.in |
| ICMR | `icmr.png` | Downloaded from icmr.gov.in |
| ANRF | `anrf.svg` | Custom SVG (atom motif, orange) |
| BIRAC | `birac.png` | Downloaded from birac.nic.in |
| CSIR | `csir.png` | Downloaded from csir.res.in |
| UGC | `ugc.png` | Downloaded from ugc.gov.in |
| AYUSH | `ayush.svg` | Custom SVG (lotus motif, green) |

**To add a new agency:**
1. Add PNG/SVG to `public/logos/<abbreviation>.png`
2. Add entry to `AGENCY_META` in `src/lib/constants.ts`
3. Add entry to `AGENCY_COLORS` in `src/lib/constants.ts`
4. Add to `AGENCIES` array in `src/lib/constants.ts`
5. Add backend scraper in `grantsetu-backend/app/scrapers/`

---

## Agency Colour Map (`AGENCY_COLORS`)

Used as fallback when logo images fail and in DeadlineBadge, filters.

```ts
DBT   → blue-50 / blue-700
DST   → teal-50 / teal-700
ICMR  → red-50 / red-700
ANRF  → orange-50 / orange-700
BIRAC → purple-50 / purple-700
CSIR  → cyan-50 / cyan-700
UGC   → yellow-50 / yellow-700
AYUSH → lime-50 / lime-700
```

---

## Agency Metadata (`AGENCY_META`)

Each entry in `src/lib/constants.ts`:
```ts
{
  fullName: string,     // Full English name
  website: string,      // Official portal URL (for external links)
  logo: string,         // Path relative to /public, e.g. "/logos/dst.png"
  logotype: "png"|"svg" // Used to set unoptimized=true for SVGs in next/image
}
```

---

## Page Routes

| Route | Type | Description |
|-------|------|-------------|
| `/` | Server | Landing page: hero, how-it-works, agency grid, CTA |
| `/grants` | Server + URL filters | Paginated grant feed. All filters in URL params |
| `/grants/[slug]` | Server SSR | Grant detail with JSON-LD, generateMetadata |
| `/alerts` | Client | Email alert subscription form |
| `/admin` | Client | Stats dashboard + scraper health |
| `/admin/grants/new` | Client | Create grant form |
| `/auth/signin` | Client | Google OAuth + magic link |

---

## URL Filter Params (Grant Feed)

All filters are URL-driven so pages are shareable:

| Param | Type | Example |
|-------|------|---------|
| `q` | string | `?q=early+career` |
| `agency` | multi-value | `?agency=DBT&agency=ICMR` |
| `career_stage` | string | `?career_stage=Early+Career` |
| `subject_area` | string | `?subject_area=Biotechnology` |
| `deadline` | string | `?deadline=closing_soon` |
| `sort` | string | `?sort=budget_desc` |
| `page` | number | `?page=2` |

---

## Backend API (FastAPI)

**Base URL:** `http://localhost:8000` (dev) / `https://api.grantsetu.in` (prod)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Health check |
| `/api/v1/grants` | GET | List grants (paginated, filtered) |
| `/api/v1/grants/agencies` | GET | Agency counts |
| `/api/v1/grants/{slug}` | GET | Grant detail |
| `/api/v1/alerts/subscribe` | POST | Create/update alert |
| `/api/v1/admin/stats` | GET | Admin stats |
| `/api/v1/admin/scraper-health` | GET | Scraper run logs |
| `/api/v1/admin/trigger-scraper` | POST | Manually trigger scraper |

---

## Docker Services

```
grantsetu-api         → FastAPI on port 8000 (512m RAM)
grantsetu-db          → PostgreSQL 15 on port 5432 (256m RAM)
grantsetu-redis       → Redis 7 on port 6379 (128m RAM)
grantsetu-celery-worker → Celery worker (256m RAM)
grantsetu-celery-beat   → Celery beat scheduler (128m RAM)
```

**Start:** `docker compose up -d --build`
**Logs:** `docker compose logs -f api`
**Seed data:** `docker compose exec api python scripts/seed_grants.py`

---

## Environment Variables

**`grantsetu-backend/.env`** (never commit):
```
DATABASE_URL=postgresql+asyncpg://grantsetu:password@db:5432/grantsetu
REDIS_URL=redis://redis:6379/0
VLLM_BASE_URL=http://192.168.1.100:8000/v1   # Local LLM server (optional)
RESEND_API_KEY=re_xxxxxxxxxxxx                  # For email alerts
FRONTEND_URL=https://grantsetu.in
ADMIN_EMAILS=argajit@example.com
CORS_ORIGINS=https://grantsetu.in,http://localhost:3000
```

**`grantsetu-frontend/.env.local`** (never commit):
```
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=change-me-to-a-random-32-char-string
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

---

## Known Issues & Fixes Applied

| Issue | Fix |
|-------|-----|
| `next.config.ts` not supported in Next 14.2 | Renamed to `next.config.mjs`, plain JS |
| `ModuleNotFoundError: No module named 'app'` | Added `ENV PYTHONPATH=/app` to Dockerfile |
| Alembic couldn't reach DB/Redis (used localhost) | Changed `.env` to use Docker service names `db`, `redis` |
| No Alembic migration files | Created `alembic/versions/001_initial.py` |
| Pydantic ValidationError for extra `.env` fields | Added `model_config = SettingsConfigDict(extra="ignore")` to Settings class |
| Duplicate GrantFilters rendered | Render only once in sidebar; drawer is built into component |

---

## Code Standards

- **TypeScript strict mode** — no `any`, use proper types from `src/types/index.ts`
- **Server components by default** — only add `"use client"` when you need hooks/browser APIs
- **No Math with LLM** — LLM (Mistral via vLLM) is for text extraction only, never calculations
- **INR formatting** — always use `formatINR()` from constants (not raw Intl)
- **Dates** — always `formatDate()` from constants; backend stores ISO, shows DD MMM YYYY
- **Async/await** — all database calls use `async with get_db() as session` pattern
- **Pydantic v2** — use `model_config`, not `class Config`

---

## Scraper Architecture

Each scraper extends `BaseScraper` in `app/scrapers/base.py`:
- `fetch_page(url)` — 3 retries with exponential backoff
- `fetch_pdf_bytes(url)` — downloads PDF for text extraction
- `scrape()` → returns `list[GrantCreate]` (abstract, must implement)
- `run()` — calls `scrape()` → `upsert_grant_by_url()` → logs to `scraper_run` table

**Schedule (Celery beat, Asia/Kolkata timezone):**
- Scrapers: daily 6:00 AM IST
- Daily digest emails: 8:00 AM IST
- Weekly digest emails: Monday 9:00 AM IST

---

## Deployment (Phase 1 target)

- **Server:** DigitalOcean Droplet 2GB RAM, Bengaluru region
- **Domain:** grantsetu.in
- **SSL:** Let's Encrypt via Caddy
- **Frontend:** Vercel (free tier) or same Droplet via Caddy reverse proxy
- **Database:** Same Droplet PostgreSQL (not managed, to save cost)
- **LLM:** Local Mistral-7B via vLLM on separate GPU server (optional, graceful degradation)

---

*Last updated: March 2026 — GrantSetu Phase 0 (Grant Radar)*
