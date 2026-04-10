# CLAUDE.md — GrantSetu Project Guide

> **READ THIS BEFORE MAKING ANY CHANGES.**

---

## Project Overview

**Site:** [grantsetu.in](https://grantsetu.in)
**Type:** Indian research grant discovery platform
**Owner:** Argajit Sarkar — Doctoral Scholar, Tripura University
**Repo:** [github.com/argajitsarkr/grantsetu](https://github.com/argajitsarkr/grantsetu)

GrantSetu aggregates active research grant calls from 8 Indian government funding agencies (DBT, DST, ICMR, ANRF, BIRAC, CSIR, UGC, AYUSH). Researchers create a profile, and the platform recommends relevant grants based on career stage, subject area, and keywords.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 (App Router), Tailwind CSS, NextAuth v5 (Google OAuth) |
| Backend | FastAPI, SQLAlchemy (async), Alembic migrations |
| Database | PostgreSQL 15 |
| Cache/Queue | Redis 7 + Celery (worker + beat scheduler) |
| Scrapers | 8 agency-specific scrapers (low quality — manual curation preferred) |
| Deployment | Docker Compose (6 containers), Cloudflare Tunnel |
| Server | PowerEdge R730 (Ubuntu) at `/home/mmilab/grantsetu` |
| Domain | grantsetu.in (Hostinger, DNS via Cloudflare) |

---

## Design System (indicium.ai-inspired)

| Element | Value |
|---|---|
| Primary navy | `#05073F` |
| Electric blue | `#2451F3` |
| Soft purple | `#BBBAFB` |
| Display font | Inter Display Medium (`--font-display`) — headings |
| Body font | Inter Regular/Medium (`--font-body`) — body text |
| Mono font | Roboto Mono Regular (`--font-mono`) — labels, badges, table headers |
| Hero | Full-screen background video with poster fallback (hero-poster.avif) |
| Navbar | Transparent → dark on scroll, white text, dropdown menus |

Font files live in `grantsetu-frontend/public/fonts/`. The `@font-face` rules are in `globals.css` and expose CSS variables. **All headings** must use `style={{ fontFamily: "var(--font-display)" }}`. **All labels/badges** must use `style={{ fontFamily: "var(--font-mono)" }}`. Body text inherits automatically.

---

## File Structure

```
grantsetu/                          <- GIT ROOT
├── CLAUDE.md                       <- This file
├── docker-compose.yml              <- 6-service stack
├── deploy.sh                       <- Deploy helper (up/update/logs/status/down)
├── cloudflared-config.yml          <- Cloudflare Tunnel template
├── DESIGN.md                       <- Design reference notes
│
├── grantsetu-frontend/
│   ├── Dockerfile
│   ├── .env.local.example
│   ├── public/
│   │   ├── fonts/                  <- Inter Display, Inter, Roboto Mono (.woff2)
│   │   ├── images/                 <- hero-poster.avif, hero-bg.png
│   │   ├── logos/                  <- Agency logos (DBT, DST, ICMR, etc.)
│   │   ├── llms.txt, llms-full.txt <- LLMO files for AI discoverability
│   │   ├── manifest.json           <- PWA manifest
│   │   └── favicon.ico, apple-touch-icon.png, etc.
│   └── src/
│       ├── app/
│       │   ├── page.tsx            <- Home page (hero, features, FAQ, CTA)
│       │   ├── layout.tsx          <- Root layout (SEO, JSON-LD, fonts)
│       │   ├── globals.css         <- Design system (colors, fonts, components)
│       │   ├── grants/page.tsx     <- Grant listing with filters
│       │   ├── grants/[slug]/      <- Grant detail page
│       │   ├── dashboard/          <- Logged-in user dashboard
│       │   ├── profile/            <- Edit research profile
│       │   ├── onboarding/         <- New user setup wizard
│       │   ├── alerts/             <- Email alert subscription
│       │   ├── admin/              <- Admin dashboard + manual grant entry
│       │   ├── auth/signin/        <- Google sign-in page
│       │   ├── api/auth/[...nextauth]/ <- NextAuth route handler
│       │   ├── sitemap.ts          <- Dynamic sitemap
│       │   ├── robots.ts           <- robots.txt
│       │   ├── opengraph-image.tsx <- Dynamic OG image
│       │   ├── error.tsx, not-found.tsx
│       │   └── loading.tsx files
│       ├── components/
│       │   ├── Navbar.tsx          <- Transparent→dark nav, dropdowns
│       │   ├── Footer.tsx          <- Dark navy footer, 4 columns
│       │   ├── GrantCard.tsx       <- Grant list card
│       │   ├── GrantFilters.tsx    <- Sidebar filters (agency, subject, stage)
│       │   ├── AgencyLogo.tsx      <- Logo component with fallback
│       │   ├── AgencyBadge.tsx     <- Colored agency pill
│       │   ├── DeadlineBadge.tsx   <- Deadline with urgency colors
│       │   ├── SearchBar.tsx, Pagination.tsx, ShareButton.tsx, TagInput.tsx
│       │   └── Providers.tsx       <- NextAuth SessionProvider
│       ├── lib/
│       │   ├── api.ts              <- Backend API fetch helpers
│       │   ├── auth.ts             <- NextAuth config
│       │   └── constants.ts        <- Agencies, subject areas, career stages, colors
│       ├── middleware.ts           <- Auth redirect logic
│       └── types/                  <- TypeScript interfaces
│
├── grantsetu-backend/
│   ├── Dockerfile
│   ├── requirements.txt
│   ├── .env.example
│   ├── alembic/                    <- DB migrations
│   └── app/
│       ├── main.py                 <- FastAPI app entry, CORS config
│       ├── config.py               <- Settings from env vars
│       ├── database.py             <- Async SQLAlchemy engine
│       ├── api/v1/
│       │   ├── router.py           <- API router
│       │   ├── grants.py           <- /api/v1/grants endpoints
│       │   ├── users.py            <- /api/v1/users endpoints
│       │   ├── admin.py            <- /api/v1/admin endpoints
│       │   ├── alerts.py           <- /api/v1/alerts endpoints
│       │   └── health.py           <- Health check
│       ├── models/                 <- SQLAlchemy models (grant, user, saved_grant, etc.)
│       ├── schemas/                <- Pydantic schemas
│       ├── scrapers/               <- 8 agency scrapers + runner
│       ├── services/               <- grant_service, recommendation_service, alert_service, llm_service
│       ├── tasks/                  <- Celery tasks (scraping, alerts)
│       └── utils/                  <- date_utils, pdf_extract, slug
```

---

## Environment Variables

### Frontend (`grantsetu-frontend/.env.local`)

```env
NEXT_PUBLIC_API_URL=https://api.grantsetu.in    # or http://localhost:8000
NEXTAUTH_URL=https://grantsetu.in               # or http://localhost:3000
NEXTAUTH_SECRET=<random-32-char-string>
GOOGLE_CLIENT_ID=<from-google-cloud-console>
GOOGLE_CLIENT_SECRET=<from-google-cloud-console>
AUTH_TRUST_HOST=true                             # REQUIRED behind Cloudflare Tunnel
```

### Backend (`grantsetu-backend/.env`)

```env
DATABASE_URL=postgresql+asyncpg://grantsetu:password@db:5432/grantsetu
REDIS_URL=redis://redis:6379/0
FRONTEND_URL=https://grantsetu.in
CORS_ORIGINS=https://grantsetu.in,http://localhost:3000
ADMIN_EMAILS=argajit@example.com
GOOGLE_CLIENT_ID=<same-as-frontend>
GOOGLE_CLIENT_SECRET=<same-as-frontend>
NEXTAUTH_SECRET=<same-as-frontend>
DB_PASSWORD=<postgres-password>
```

> **Note:** Inside Docker, hostnames are `db`, `redis` (service names), not `localhost`.

---

## Deployment

### Development (local)

```bash
cd grantsetu-frontend && npm run dev     # localhost:3000
cd grantsetu-backend && uvicorn app.main:app --reload  # localhost:8000
```

### Production (PowerEdge R730 server)

The server is at `/home/mmilab/grantsetu`. Access via AnyDesk.

```bash
# First time
cd /home/mmilab/grantsetu
git clone https://github.com/argajitsarkr/grantsetu.git .
# Set up .env files (see above)
bash deploy.sh up

# After pushing changes from laptop
bash deploy.sh update         # pulls + rebuilds + restarts

# Other commands
bash deploy.sh logs           # tail logs
bash deploy.sh status         # container status + memory
bash deploy.sh down           # stop everything
```

### Cloudflare Tunnel

Tunnel ID: `83fae86d-d17a-4a33-bc9e-8bf012046afa`
Config location on server: `/etc/cloudflared/config.yml`

| Hostname | Routes to |
|---|---|
| grantsetu.in | localhost:3000 (Next.js) |
| www.grantsetu.in | localhost:3000 (Next.js) |
| api.grantsetu.in | localhost:8000 (FastAPI) |

---

## Key API Endpoints

| Method | Path | Description |
|---|---|---|
| GET | `/api/v1/grants` | List grants (filters: agency, status, career_stage, subject_area, deadline, search, sort) |
| GET | `/api/v1/grants/{slug}` | Grant detail |
| GET | `/api/v1/users/me` | Current user profile |
| PUT | `/api/v1/users/me` | Update profile |
| GET | `/api/v1/users/me/recommended` | Recommended grants for user |
| GET | `/api/v1/users/me/saved` | Saved grants |
| POST | `/api/v1/alerts/subscribe` | Subscribe to email alerts |
| GET | `/api/v1/admin/stats` | Admin stats |
| GET | `/api/v1/admin/scrapers/health` | Scraper run history |
| POST | `/api/v1/admin/grants` | Manually create a grant |
| GET | `/api/v1/health` | Health check |

---

## SEO & LLMO

- **JSON-LD**: Organization + WebSite (with SearchAction) in `layout.tsx`; GovernmentService + BreadcrumbList on each grant detail page
- **OpenGraph / Twitter Cards**: On every page
- **Sitemap**: Dynamic at `/sitemap.xml` (generated from grant slugs)
- **robots.txt**: Dynamic at `/robots.txt`
- **LLMO**: `public/llms.txt` and `public/llms-full.txt` for AI crawler discoverability
- **Canonical URLs**: Set on all pages

---

## Supported Agencies

| Code | Full Name | Scraper Status |
|---|---|---|
| DBT | Department of Biotechnology | Low quality — use manual entry |
| DST | Department of Science & Technology | Low quality |
| ICMR | Indian Council of Medical Research | Low quality |
| ANRF | Anusandhan National Research Foundation | Low quality |
| BIRAC | Biotechnology Industry Research Assistance Council | Low quality |
| CSIR | Council of Scientific & Industrial Research | Low quality |
| UGC | University Grants Commission | Low quality |
| AYUSH | Ministry of AYUSH | Low quality |

> **All 8 scrapers produce generic portal URLs, not deep grant links.** The recommended approach is manual curation via the admin panel (`/admin/grants/new`). Building an admin "Add Grant" form was prioritized over fixing scrapers.

---

## Known Issues & Pending Work

1. **NextAuth UntrustedHost error** — Production needs `AUTH_TRUST_HOST=true` in frontend `.env.local`. Without this, the site redirects to `/api/auth/error`.
2. **Scrapers are low quality** — They find grant listings but link to generic portal homepages, not individual call pages. Manual curation is the workaround.
3. **Backend dashboard for PI users** — Original request to classify users by domain, suggest grants based on keywords, age, career stage. Profile + recommendations exist but need refinement.
4. **Google OAuth on production** — Credentials are created but login flow is broken until AUTH_TRUST_HOST is set.
5. **Old Gilroy fonts** — `public/fonts/gilroy-*.woff2` files are leftover from an earlier design. They are unused but not yet deleted.

---

## Mistakes Log — What NOT To Do

### 1. Always use `AUTH_TRUST_HOST=true` behind Cloudflare Tunnel
- **What happened:** NextAuth threw `UntrustedHost` error because the request comes through Cloudflare's proxy, and the Host header doesn't match `NEXTAUTH_URL`.
- **Fix:** Add `AUTH_TRUST_HOST=true` to the frontend `.env.local` on the server.

### 2. Inside Docker, use service names not localhost
- **What happened:** Backend `.env` used `localhost` for DATABASE_URL and REDIS_URL.
- **Result:** Containers couldn't connect to each other.
- **Fix:** Use `db:5432` and `redis:6379` (Docker service names).

### 3. Don't forget to set `CORS_ORIGINS` for the production domain
- **What happened:** API returned CORS errors because `grantsetu.in` wasn't in the allowed origins list.
- **Fix:** Set `CORS_ORIGINS=https://grantsetu.in,http://localhost:3000` in backend `.env`.

### 4. Cloudflared config must be in `/etc/cloudflared/` for the system service
- **What happened:** Config was in `~/.cloudflared/` but the systemd service looks in `/etc/cloudflared/`.
- **Fix:** Copy both `config.yml` and the credentials JSON to `/etc/cloudflared/`.

### 5. Always apply fonts consistently across ALL pages
- **Rule:** Every `h1`/`h2`/`h3` must have `style={{ fontFamily: "var(--font-display)" }}`. Every small label/badge must have `style={{ fontFamily: "var(--font-mono)" }}`. Body text inherits `var(--font-body)` from globals.css.

---

## Changelog

| Date | Changes |
|---|---|
| 2026-04-10 | Created CLAUDE.md for the project |
| 2026-04-10 | Pushed indicium.ai redesign with fonts applied across all pages |
| 2026-04-09 | Complete indicium.ai-style redesign — navy/blue palette, Inter Display + Roboto Mono fonts, hero video, transparent navbar |
| 2026-04-09 | ChatSpark-exact redesign — dark rounded nav, icon+wordmark logo, gradient hero |
| 2026-04-08 | Comprehensive SEO + LLMO overhaul — JSON-LD, sitemap, robots.txt, llms.txt, OpenGraph |
| 2026-04-08 | Added proper favicons and PWA icons for all platforms |
| 2026-04-07 | Initial commit — full-stack with Docker deployment, Cloudflare Tunnel setup |
