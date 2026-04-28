# CLAUDE.md - GrantSetu Project Guide

> **READ THIS BEFORE MAKING ANY CHANGES.**
>
> This file is the single source of truth for the current state of the project. The **Changelog** at the bottom is kept up-to-date with every session - check it first to understand what shipped most recently and what is pending. Update it before you end any session that changes code, schema, config, or deployment.

> **TYPOGRAPHY RULE (HARD):** Never use the em-dash character (the long dash). Always use a plain hyphen `-` instead. This applies everywhere: UI copy, code comments, commit messages, docs, this file, and any text Claude writes. If you see a long dash in any file, replace it with `-`.

---

## Project Overview

**Site:** [grantsetu.in](https://grantsetu.in)
**Type:** Indian research grant discovery platform
**Owner:** Argajit Sarkar - Doctoral Scholar, Tripura University
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
| Scrapers | 8 agency-specific scrapers (low quality - manual curation preferred) |
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
| Display font | Inter Display Medium (`--font-display`) - headings |
| Body font | Inter Regular/Medium (`--font-body`) - body text |
| Mono font | Roboto Mono Regular (`--font-mono`) - labels, badges, table headers |
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
RESEND_API_KEY=re_xxx                            # from resend.com dashboard
EMAIL_FROM=GrantSetu <noreply@grantsetu.in>      # sender; domain must be verified in Resend
RAZORPAY_KEY_ID=rzp_live_xxx                     # blank in dev → /billing endpoints return 503
RAZORPAY_KEY_SECRET=xxx
BUTTONDOWN_API_KEY=                              # blank → tag_pro() logs to stdout instead of calling Buttondown
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

### Outage fallback (Cloudflare Worker)

A small Cloudflare Worker (`grantsetu-worker/`) sits in front of `grantsetu.in` and `www.grantsetu.in`. When the home server is online it is a transparent passthrough (the existing tunnel handles every request). When the origin returns a tunnel-down status (502/503/521-526) or the `fetch()` to the tunnel throws (power cut), the Worker serves an inline branded maintenance HTML page with an email-capture form that posts to Buttondown (`tag: outage-notify`, `type: unactivated`).

- Worker name: `grantsetu-downtime` (free tier, stateless, no KV/D1).
- Routes: `grantsetu.in/*`, `www.grantsetu.in/*`. **`api.grantsetu.in` is intentionally NOT routed through the Worker** so JSON clients see Cloudflare's parseable 5xx instead of HTML.
- Deploy: `bash deploy.sh worker` (laptop, not server) - runs `wrangler deploy` from `grantsetu-worker/`.
- Secret: `BUTTONDOWN_API_KEY` (same value as backend `.env`); set with `npx wrangler secret put BUTTONDOWN_API_KEY` once. **Not** in source control.
- Re-engagement after each outage: Buttondown -> Subscribers -> filter `tag: outage-notify` -> Emails -> New email -> send. Manual broadcast keeps it simple and avoids double-sends if the tunnel flaps. Optional: bulk-untag after broadcast so the next outage lands as a fresh batch.
- Maintenance HTML is fully self-contained (inline SVG mark, inline CSS, inline JS - zero external fetches that could themselves fail when origin is down).
- Buttondown firewall: the Worker calls Buttondown from Cloudflare egress IPs (different from the home server IP that's already allowlisted). If `subscriber_blocked` errors appear in `npx wrangler tail`, set Buttondown firewall auditing mode to **Enabled** (not Aggressive) - same fix documented under the Newsletter section.

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
| GET | `/api/v1/blog` | List blog posts (filters: page, per_page, category, featured, search) - published only |
| GET | `/api/v1/blog/{slug}` | Public blog post detail |
| GET | `/api/v1/admin/blog` | Admin blog list (includes drafts) |
| POST | `/api/v1/admin/blog` | Create post (auto-slug from title) |
| GET | `/api/v1/admin/blog/{id}` | Admin post by id |
| PUT | `/api/v1/admin/blog/{id}` | Update post (regenerates slug on title change) |
| DELETE | `/api/v1/admin/blog/{id}` | Hard-delete post |
| POST | `/api/v1/auth/register` | Sign up with email + password (also sends verification email) |
| POST | `/api/v1/auth/login` | Sign in with email + password |
| POST | `/api/v1/auth/send-verification` | Re-issue verification link (60s cooldown, no enumeration) |
| GET | `/api/v1/auth/verify?token=...` | Verify email by token → 302 back to `/auth/verify?ok=1` |
| POST | `/api/v1/auth/forgot-password` | Send password reset link (60s cooldown, no enumeration) |
| POST | `/api/v1/auth/reset-password` | Set new password from reset token (1 h TTL) |
| POST | `/api/v1/auth/change-password` | Authed user changes own password (requires current password) |
| DELETE | `/api/v1/users/me` | Permanently delete the authenticated user (cascades saved_grants + alert_logs) |
| GET | `/api/v1/billing/pricing` | Public live pricing (early-bird ₹299 for first 100, else ₹499; spots_remaining) |
| POST | `/api/v1/billing/create-order` | Auth. Creates Razorpay order + `subscriptions` row (status=created); 409 if already Pro-active |
| POST | `/api/v1/billing/verify` | Auth. Verifies HMAC signature, flips subscription to paid, sets user tier=pro, tags in Buttondown |
| POST | `/api/v1/billing/payment-failed` | Auth. Observability: marks failed/dismissed checkouts (204) |
| GET | `/api/v1/health` | Health check |

---

## Blog System

Full blog feature shipped 2026-04-20 (migration `005`):

- **Public**: `/blog` (featured hero + 3-col grid, Ali Abdaal-style) and `/blog/[slug]` (react-markdown + remark-gfm)
- **Admin**: `/admin/blog` (list + delete), `/admin/blog/new`, `/admin/blog/[id]/edit` - all use shared `<BlogForm>` with live markdown preview
- **Content**: Markdown body (headings, bold/italic, links, images, lists, tables, code blocks), cover image URL, excerpt, tags, category, author, read-time, status (draft/published), featured flag
- **SEO per post**: canonical URL, OpenGraph article cards, Twitter summary_large_image, BlogPosting JSON-LD (headline/datePublished/dateModified/author/publisher/image), added to `sitemap.xml` with `lastmod`
- **Styling**: `.blog-prose` class in `globals.css` handles rendered-markdown typography (matches NUUK red/black palette)
- **Slug generation**: python-slugify `slugify()` on title, collision-safe via `_unique_slug()` appending `-2`, `-3`, ...
- **Backend files**: `models/blog_post.py`, `schemas/blog_post.py`, `api/v1/blog.py` (public + admin routers), `alembic/versions/005_add_blog_posts.py`
- **Post-deploy**: `docker compose exec backend alembic upgrade head` runs migration 005

**Writing flow**: Sign in as admin → `/admin/blog/new` → fill form (Markdown body has a "Preview →" toggle) → set Status = Published → Save. SSR revalidates every 5 min, sitemap every 60 min.

---

## Newsletter & Billing

**Newsletter (Buttondown)** - free tier, powers the weekly digest.
- Reusable `<NewsletterSignup variant="inline|footer|card" source="..." />` posts to **our backend** at `POST /api/v1/newsletter/subscribe` (rewritten 2026-04-26, was direct embed-subscribe). Backend calls Buttondown REST API `/v1/subscribers` using `BUTTONDOWN_API_KEY`, returns `{status: 'created' | 'existed'}`. Frontend shows real success copy ("Subscribed. Check your inbox to confirm."), "Already on the list - thanks!" for repeats, and a red error state on upstream failure. Mounted in Footer (`source="footer"`), home hero band (`source="home"`), grant detail (`source="grant-detail"`), `/newsletter`, and `/studio` waitlist (`source="studio-waitlist"`).
- Backend: `app/services/buttondown_service.py` `subscribe(email, tags)` (mirrors `tag_pro` pattern, dev fallback to stdout when no key). Route at `app/api/v1/newsletter.py`, registered in `app/api/v1/router.py`.
- Env: backend `BUTTONDOWN_API_KEY` (Buttondown dashboard → Settings → API). Frontend env var `NEXT_PUBLIC_BUTTONDOWN_USERNAME` is **deprecated** and removed from `.env.local.example`.
- Buttondown dashboard config: Settings → Subscribers → enable "Confirmation emails" (double opt-in) and write a Welcome email. Free tier covers up to 1,000 subscribers.
- **Production state (2026-04-26)**: Buttondown sending domain = `newsletter.grantsetu.in` (Managed setup, NS-delegated to `ns1/ns2.onbuttondown.com`). From address = `argajit@newsletter.grantsetu.in`. Pipeline verified end-to-end via the live site - subscribers land in Buttondown with correct source tags. Apex `grantsetu.in` DNS reserved for Resend (auth emails) + future use.
- Outbound (cold-reach playbook): build a CSV (`email,name,affiliation`) → Buttondown → Subscribers → Import with a batch tag (`outreach-2026-04`) → New email → filter recipients to that tag only → track opens/clicks/unsubs in Analytics.

**Pro paywall (Razorpay, shipped pre-May-4 launch, migration 007)**
- **Pricing rule**: count `subscriptions WHERE tier='pro' AND status='paid'`. If `< PRO_EARLY_BIRD_CAP` (100) → `PRO_EARLY_BIRD_PRICE_PAISE` (₹299). Else → `PRO_REGULAR_PRICE_PAISE` (₹499). Price locked at order-creation (Razorpay order amount is immutable).
- **Flow**: `GET /billing/pricing` (public) → `POST /billing/create-order` (auth, creates Razorpay order + DB row `status=created`) → client opens Razorpay Checkout → handler POSTs `/billing/verify` with `{razorpay_order_id, razorpay_payment_id, razorpay_signature}` → server verifies HMAC via `client.utility.verify_payment_signature`, flips `subscriptions.status=paid`, sets `users.subscription_tier='pro'`, fires `buttondown_service.tag_pro(email)` (non-fatal).
- **Idempotent**: re-verifying an already-paid order returns the existing row. **Duplicate guard**: `/create-order` returns 409 if user has an active paid sub (`ends_at > now`).
- **Observability-only**: `/billing/payment-failed` (204) - modal dismiss + `payment.failed` events post here; flips `status=failed`. Never fatal to UX.
- **Buttondown sync**: `app/services/buttondown_service.py` `tag_pro(email)` uses `BUTTONDOWN_API_KEY` → creates subscriber with `pro` tag, or PATCHes existing. Falls back to stdout when key missing.
- **Env vars**: backend `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `BUTTONDOWN_API_KEY` (blank → 503 on billing endpoints / stdout log for Buttondown). Frontend `NEXT_PUBLIC_RAZORPAY_KEY_ID` (display only; backend still issues order key_id in `/create-order` response).
- **Backend files**: `models/subscription.py`, `schemas/subscription.py`, `api/v1/billing.py`, `services/buttondown_service.py`, `alembic/versions/007_add_subscriptions.py` (adds `subscriptions` table + `users.subscription_tier`).
- **Frontend files**: `components/RazorpayCheckout.tsx` (loads checkout.js via `<Script strategy="lazyOnload">`, handles modal + verify + failed posts), `components/NewsletterSignup.tsx`, wired into `app/newsletter/page.tsx` (dynamic pricing + signin redirect if unauth + inline success state).
- **Razorpay dashboard config** (one-time): Settings → Payment Capture → **Auto-capture: ON** (else authorized payments auto-refund after 5 days). Webhooks deferred to v1.1.

**WhatsApp share** - `ShareButton` component has a WhatsApp branch (brand green `#25D366`) that builds `https://wa.me/?text=` with template `🔬 *{title}* / 📅 Deadline: {formatted} / 🔗 {url}`. Icon-only variant on `GrantCard` quick-links row; full variant on `/grants/[slug]` with `deadline={grant.deadline}`.

---

## Auth & Email Verification

**Providers**: Google OAuth (via NextAuth) and email + password (Credentials provider, bcrypt hashes, HS256 JWT signed with `NEXTAUTH_SECRET`). Both paths issue the same token shape, so backend deps (`get_current_user`, `require_admin`) accept either.

**Email verification** (shipped 2026-04-21, migration 006):
- New credentials signups get a verification email; `users.email_verified` starts `false`, token stored in `email_verification_token` + `email_verification_sent_at`.
- **Soft enforcement**: unverified users can still log in and see the dashboard, but a yellow `VerifyEmailBanner` sits at the top of `/dashboard`, `/profile`, and `/onboarding` until they click the link.
- Google OAuth users are auto-verified (already email-verified by Google) - `/users/sync` sets `email_verified=true` on create and self-heals older rows.
- Flow: email link points to `{FRONTEND_URL}/auth/verify?token=...` → frontend page 302s to `{API_URL}/api/v1/auth/verify?token=...` → backend flips `email_verified=true`, nulls the token, 302s back to `/auth/verify?ok=1` → frontend calls `useSession().update({ emailVerified: true })` so the banner disappears without a full re-login.

**Forgot password**: `/auth/forgot` → backend issues a reset token (1-hour TTL, stored in `password_reset_token` + `password_reset_expires_at`) → email link to `/auth/reset?token=...` → user sets new password → token burned (nulled), "password changed" courtesy email sent → user redirected to `/auth/signin?reset=1`.

**Change password** (logged-in user): Section on `/profile` calls `POST /auth/change-password` with `Authorization: Bearer ${backendToken}`. Hidden automatically for Google-only users (no `password_hash`). Emits "password changed" courtesy email.

**Rate limiting**: Both `send-verification` and `forgot-password` enforce a 60-second cooldown per user using the `email_verification_sent_at` column as a shared rate-limit marker. Both endpoints always return 200 to avoid account enumeration.

**Dev mode**: If `RESEND_API_KEY` is empty (local dev), `app/services/email_service.py` logs the rendered email + action link to stdout and returns success - the full flow is testable without live sends.

**NextAuth propagation**: `emailVerified: boolean` flows through jwt callback (credentials + Google + `trigger === "update"` branches) → session callback → `session.user.emailVerified` in the client. Type augmentation lives in `src/types/next-auth.d.ts`.

**Resend domain setup on grantsetu.in**: Resend dashboard → Add Domain → **Auto configure** (Cloudflare integration) adds MX + SPF TXT + DKIM TXT records in one click. Until all three verify, emails still send but from Resend's shared domain (weaker deliverability).

---

## SEO & LLMO

- **JSON-LD**: Organization + WebSite (with SearchAction) in `layout.tsx`; GovernmentService + BreadcrumbList on each grant detail page; BlogPosting on each blog post
- **OpenGraph / Twitter Cards**: On every page
- **Sitemap**: Dynamic at `/sitemap.xml` (generated from grant slugs)
- **robots.txt**: Dynamic at `/robots.txt`
- **LLMO**: `public/llms.txt` and `public/llms-full.txt` for AI crawler discoverability
- **Canonical URLs**: Set on all pages

---

## Supported Agencies

| Code | Full Name | Scraper Status |
|---|---|---|
| DBT | Department of Biotechnology | Low quality - use manual entry |
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

1. **NextAuth UntrustedHost error** - Production needs `AUTH_TRUST_HOST=true` in frontend `.env.local`. Without this, the site redirects to `/api/auth/error`.
2. **Scrapers are low quality** - They find grant listings but link to generic portal homepages, not individual call pages. Manual curation is the workaround.
3. **Backend dashboard for PI users** - Original request to classify users by domain, suggest grants based on keywords, age, career stage. Profile + recommendations exist but need refinement.
4. **Google OAuth on production** - Credentials are created but login flow is broken until AUTH_TRUST_HOST is set.
5. **Old Gilroy fonts** - `public/fonts/gilroy-*.woff2` files are leftover from an earlier design. They are unused but not yet deleted.
6. **Admin account password flow** - After setting `ADMIN_EMAILS=argajit05@gmail.com` in backend `.env` and restarting the backend, admin status auto-applies on next login/register/sync. If the account was created via Google OAuth and has no password, register at `/auth/signup` with the same email to set one (admin flag re-applies automatically).
7. **Typography rule (HARD)** - Never use the em-dash character. Always use a plain hyphen `-` instead. Applies to UI copy, code comments, commit messages, docs, and CLAUDE.md itself. Enforced 2026-04-19, restated 2026-04-25.
8. **Resend DKIM/SPF verification pending on production** - Until all three Resend DNS records (MX + SPF TXT + DKIM TXT) show green in the Resend dashboard, emails send from Resend's shared fallback domain and deliverability is weaker. Fix: Resend → Domains → `grantsetu.in` → **Auto configure** (Cloudflare integration) or paste records manually into Cloudflare DNS as "DNS only" (grey cloud, not orange).
9. **Soft-enforced email verification** - Unverified users can still log in and access the dashboard; only the yellow banner prompts them. If spam signups become a problem, flip to strict enforcement by adding an `if not user.email_verified: raise HTTPException(...)` check in `POST /auth/login` (backend auth.py).

---

## Mistakes Log - What NOT To Do

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
| 2026-04-29 | Outage fallback Worker (`grantsetu-worker/`): Cloudflare Worker on `grantsetu.in/*` + `www.grantsetu.in/*` that transparently proxies to the home-server tunnel and, when origin returns 502/503/521-526 or `fetch()` throws, serves a branded inline maintenance HTML with email-capture form that posts to Buttondown (`tag: outage-notify`, `type: unactivated`, with `ip_address` + `referrer_url`). `api.grantsetu.in` deliberately left off so API clients see parseable 5xx. New `bash deploy.sh worker` shortcut for `npx wrangler deploy`. Re-engagement after outage = manual Buttondown broadcast filtered by the new tag. (commit pending) |
| 2026-04-26 | Newsletter pipeline live end-to-end. Buttondown sending domain switched from apex `grantsetu.in` to subdomain `newsletter.grantsetu.in` (Managed setup - 2 NS records to `ns1/ns2.onbuttondown.com` in Cloudflare DNS, Buttondown owns DKIM/MX/DMARC/track records on the subdomain). From address: `argajit@newsletter.grantsetu.in`. Subdomain isolates from Resend's apex records and protects future Google Workspace use. Inbound flow verified: site → backend → Buttondown → confirmation email → confirmed list, with source tags landing per form (`footer`, `newsletter`, `home`, `grant-detail`, `studio-waitlist`). Apex `grantsetu.in` DNS untouched. (commit ca8155a) |
| 2026-04-26 | Hotfix: `/newsletter` page had its own inline subscribe form pointing at the deprecated `buttondown.com/api/emails/embed-subscribe/grantsetu` URL - missed in the original c5524c8 rewrite which only updated the shared `<NewsletterSignup>` component. After the Buttondown sender-domain switch the legacy URL 404'd and signups silently failed. Converted both inline forms on `/newsletter` to call `/api/v1/newsletter/subscribe`, dropped `BUTTONDOWN_ACTION/BUTTONDOWN_USERNAME` constants and `mode:'no-cors'` fallback, made the second form's email input controlled. (commit ca8155a) |
| 2026-04-26 | Newsletter subscribe rewritten to go through our backend instead of Buttondown's direct embed endpoint. New `POST /api/v1/newsletter/subscribe` route + `buttondown_service.subscribe()` helper. Frontend `<NewsletterSignup>` now gets real success/error responses (no more `mode:'no-cors'` fire-and-forget), shows "Already on the list" for repeats, "Check your inbox to confirm" copy aligned with double opt-in. Removed unused `NEXT_PUBLIC_BUTTONDOWN_USERNAME`. Post-deploy: set `BUTTONDOWN_API_KEY` in backend .env, enable double opt-in + welcome email in Buttondown dashboard, restart. (commit c5524c8) |
| 2026-04-25 | Studio fix-up: explicit `text-white` on h2/h3 inside the black feature grid + red Pro paywall + final black CTA (globals force `h1-h6 { color: var(--color-black) }` so dark sections need an override). Studio Pro pricing fixed to ₹2,499/year across the Pro paywall headline, body, FAQ, and waitlist subheading (was incorrectly ₹299 from the regular Newsletter Pro early-bird tier). Dropped the conflicting "See Pro pricing" link to `/newsletter#pro`. (commit 82862f5) |
| 2026-04-25 | Studio launch (coming-soon): removed Research Areas dropdown from navbar, replaced with `Studio` link + red `SOON` badge in both desktop nav and mobile drawer. New `/studio` route - six-section coming-soon landing (hero, 6-feature grid, Pro paywall teaser with auth-aware CTA, waitlist signup tagged `studio-waitlist` in Buttondown, 4-question FAQ, final CTA), `/studio/layout.tsx` with full SEO metadata, sitemap entry. Also enforced em-dash ban globally in CLAUDE.md (replaced 31 em-dashes with hyphens, added hard rule at top). (commit 6bc872b) |
| 2026-04-25 | Footer + admin blog fixes: replaced text "GrantSetu" wordmark in Footer with image logo (`/grantsetu-logo-footer.png`), removed 🧬 DNA emoji from Navbar ticker, fixed BlogForm crash + accidental save: Enter in any single-line input no longer submits the form (was bouncing users to /admin/blog when pasting a cover URL and hitting Enter), Markdown preview wrapped in error boundary so malformed body content cannot crash the whole edit page, `tags` init guarded against non-array values. (commits a846934, ee8fae6) |
| 2026-04-22 | Newsletter launch prep (May 4): WhatsApp share buttons on GrantCard + /grants/[slug] (wa.me template), reusable `<NewsletterSignup>` mounted in Footer + home + grant detail, full Razorpay Pro paywall - migration 007 (`subscriptions` table + `users.subscription_tier`), backend `/api/v1/billing/{pricing,create-order,verify,payment-failed}`, `buttondown_service.tag_pro()`, frontend `<RazorpayCheckout>` + dynamic pricing on `/newsletter` (₹299 first 100 → ₹499). Post-deploy: set `RAZORPAY_KEY_ID/SECRET` + `BUTTONDOWN_API_KEY` in backend .env, `NEXT_PUBLIC_RAZORPAY_KEY_ID` + `NEXT_PUBLIC_BUTTONDOWN_USERNAME` in frontend .env.local, enable Auto-capture in Razorpay Dashboard, `alembic upgrade head`. |
| 2026-04-21 | Account deletion: `DELETE /api/v1/users/me` + Danger-zone section on /profile with "type DELETE to confirm" gate. Saved grants + alert logs cascade via existing FKs. Verify page now awaits `update({ emailVerified: true })` and hard-reloads `/dashboard` so the banner clears immediately after a fresh verification. |
| 2026-04-21 | Fix /auth/verify: page was not calling the backend on a raw `?token=...` - it defaulted to the "Link expired" branch so every real link looked broken. On mount with a token the page now 302s to `GET /api/v1/auth/verify?token=...`, which checks the DB and redirects back with `?ok=1` or `?error=invalid`. (commit 25f263e) |
| 2026-04-21 | Email verification + forgot-password + change-password via Resend: new credentials users get a verification email (soft enforcement), Google OAuth users auto-verified, `/auth/forgot` + `/auth/reset` pages, Change Password section on /profile, yellow VerifyEmailBanner on dashboard/profile/onboarding. Migration 006 adds email_verified + 4 token columns to `users` and backfills Google users. Post-deploy: set `RESEND_API_KEY` + `EMAIL_FROM` in backend .env, add SPF+DKIM TXT records for grantsetu.in in Cloudflare DNS (Resend dashboard generates them), then `docker compose exec backend alembic upgrade head`. |
| 2026-04-20 | Blog system: public /blog + /blog/[slug] with react-markdown, admin CRUD at /admin/blog (+ shared BlogForm with live preview), new blog_posts table (migration 005), BlogPosting JSON-LD, sitemap + navbar + admin-home wiring |
| 2026-04-20 | Rebrand + SEO tightening: new GrantSetu logo image in navbar, refreshed favicons with ?v=2 cache-bust, FAQPage JSON-LD on home, enriched GovernmentService schema (datePublished/dateModified/areaServed), hreflang en-IN, verification tokens stubbed, rewritten llms.txt, docs/seo-launch-checklist.md |
| 2026-04-20 | Platform navbar link removed (folded into Dashboard); admin grants list gained hard-delete button (DELETE /admin/grants/{id}?hard=true) alongside soft expire |
| 2026-04-19 | Typography cleanup: replaced every em-dash (-) with a plain hyphen (-) across the frontend (102 replacements in 22 files) |
| 2026-04-18 | Auto-promote admins: /users/sync, /auth/register, /auth/login now set is_admin from ADMIN_EMAILS; added GET /api/v1/admin/users |
| 2026-04-18 | Full admin suite: /admin home redesign (stat tiles + action tiles + scraper health), /admin/grants list with search/filter/pagination, /admin/grants/[id]/edit, /admin/users; new shared <GrantForm> reused by create + edit |
| 2026-04-18 | /admin route protection via middleware: non-admins redirected to /dashboard, admins skip onboarding |
| 2026-04-18 | Dashboard rewrite: greeting strip, 4 stat tiles (Matched/Deadlines/Saved/Profile strength), Deadline Radar, Recommended, Saved rows, Activity feed, Profile card, Notification settings (replaces /alerts), Upgrade-to-Pro card linking to /newsletter#pro |
| 2026-04-18 | Removed /alerts page and all nav/footer/home/sitemap references (backend alert_* tables/fields kept dormant for future Pro feature) |
| 2026-04-10 | Created CLAUDE.md for the project |
| 2026-04-10 | Pushed indicium.ai redesign with fonts applied across all pages |
| 2026-04-09 | Complete indicium.ai-style redesign - navy/blue palette, Inter Display + Roboto Mono fonts, hero video, transparent navbar |
| 2026-04-09 | ChatSpark-exact redesign - dark rounded nav, icon+wordmark logo, gradient hero |
| 2026-04-08 | Comprehensive SEO + LLMO overhaul - JSON-LD, sitemap, robots.txt, llms.txt, OpenGraph |
| 2026-04-08 | Added proper favicons and PWA icons for all platforms |
| 2026-04-07 | Initial commit - full-stack with Docker deployment, Cloudflare Tunnel setup |
