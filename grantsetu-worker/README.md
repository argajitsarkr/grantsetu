# grantsetu-worker

Cloudflare Worker that fronts `grantsetu.in` and `www.grantsetu.in` and serves a branded fallback page (with a "notify me when back" email form) whenever the home-server origin is unreachable. When the origin is healthy, the Worker is a transparent passthrough.

`api.grantsetu.in` is intentionally not routed through this Worker - the API is allowed to fail with Cloudflare's default 5xx so JSON clients (frontend, future SDKs) see a parseable error instead of HTML.

---

## One-time setup

Run these from your laptop (you only do this once):

```bash
cd grantsetu-worker
npm install

# Authenticate the Cloudflare account that owns grantsetu.in
npx wrangler login

# Set the Buttondown API key as a Worker secret (paste the same value
# already in grantsetu-backend/.env -> BUTTONDOWN_API_KEY)
npx wrangler secret put BUTTONDOWN_API_KEY

# Deploy. wrangler.toml binds the routes automatically.
npx wrangler deploy
```

After the first deploy, confirm the routes in the Cloudflare dashboard:
**Workers & Pages -> grantsetu-downtime -> Triggers -> Routes**
should list `grantsetu.in/*` and `www.grantsetu.in/*`.

---

## Day-to-day commands

```bash
# Local dev (against the live origin)
npm run dev

# Push a new version after editing src/index.ts
npm run deploy

# Tail live logs (great for verifying signups during an outage)
npm run tail
```

---

## After every power cut

1. Wait for the home server to boot. `systemctl status cloudflared` on the server should show the tunnel back up.
2. Refresh `https://grantsetu.in` once - you should see the live site (not the maintenance page). The Worker is now passing through transparently.
3. Open Buttondown -> **Subscribers** -> filter by tag `outage-notify`.
4. **Emails -> New email**. Recipients = the filtered segment. Subject like *"GrantSetu is back online"*. Body: short, warm, link back to the site. Send.
5. Optional: bulk-edit those subscribers to remove the `outage-notify` tag so the next outage lands as a fresh batch.

That's the whole loop. ~30 seconds of manual work per outage; no other infra changes.

---

## Files

```
grantsetu-worker/
├── wrangler.toml      # routes, vars, compatibility_date
├── package.json       # wrangler + types + scripts
├── tsconfig.json      # strict TS for the Worker
├── src/index.ts       # the entire Worker (proxy + notify endpoint + inline maintenance HTML)
└── README.md          # this file
```

---

## Why this Worker over Cloudflare's "Always Online"?

`Always Online` serves a stale snapshot from the Wayback Machine when origin is down. It works, but:
- visitors don't know it's a temporary outage,
- there's no way to capture intent,
- it can serve very stale data (last successful crawl could be days old).

This Worker gives a clear "we're temporarily down, here's how to be notified" message and lands the visitor in the same Buttondown list the rest of the site uses, with a distinct `outage-notify` tag so the re-engagement email doesn't pollute the regular weekly newsletter segment.

## Cost

Workers free tier = 100,000 requests/day. Even a moderate traffic spike during an outage is well under this. No KV / D1 / Durable Objects are used; the Worker is fully stateless.
