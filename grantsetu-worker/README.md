# grantsetu-worker

Tiny Cloudflare Worker (~15 lines of logic) that fronts `grantsetu.in` and `www.grantsetu.in`. When the home-server origin is healthy, it's a transparent passthrough. When the origin returns a tunnel-down status (502/503/521-526) or `fetch()` throws, it 302-redirects the visitor to the GitHub Pages maintenance site:

> https://argajitsarkr.github.io/grantsetu-offline/

That GitHub Pages site lives in a different repo (`argajitsarkr/argajitsarkr.github.io`, folder `grantsetu-offline/`) and contains the branded HTML + Buttondown embed-subscribe form tagged `outage-notify`. To change what visitors see during an outage, edit `index.html` in that other repo - the Worker doesn't need to be redeployed.

`api.grantsetu.in` is intentionally not routed through this Worker so JSON clients (the frontend, future SDKs) see Cloudflare's parseable 5xx instead of an HTML redirect.

---

## One-time setup

Run these from your laptop (only once):

```bash
cd grantsetu-worker
npm install
npx wrangler login            # browser tab, log in as argajit05@gmail.com, Allow
npx wrangler deploy           # creates the Worker + binds the routes
```

After the first deploy, in the Cloudflare dashboard verify the routes under
**Workers & Pages -> grantsetu-downtime -> Settings -> Triggers**:
- `grantsetu.in/*`
- `www.grantsetu.in/*`

That's it. No secrets to set, no Buttondown key needed in the Worker.

---

## Updating

```bash
# Edit Worker logic
npm run deploy

# Edit the maintenance content (different repo)
cd ../../argajitsarkr.github.io/grantsetu-offline
# edit index.html, commit, push - GitHub Pages publishes within ~1 minute

# Tail Worker logs (great for verifying redirects during a real outage)
npm run tail
```

---

## After every power cut

1. Wait for the home server to boot. `systemctl status cloudflared` should show the tunnel back up.
2. Refresh `https://grantsetu.in` once - you should land on the live site again (Worker is now passing through transparently).
3. Buttondown -> Subscribers -> filter `tag: outage-notify`.
4. Emails -> New email. Recipients = the filtered segment. Subject like *"GrantSetu is back online"*. Send.
5. Optional: bulk-untag those subscribers so the next outage lands as a fresh batch.

---

## Why this is split across two places

- **GitHub Pages** is where the maintenance HTML lives. Easy to edit, has GitHub's web editor, no Wrangler needed for content changes, free hosting.
- **Cloudflare Worker** is the ~15-line trigger. It only knows two things: (a) is the origin healthy, (b) where to redirect if not. It never serves HTML and never talks to Buttondown.

The split means content changes don't touch the Worker, and Worker logic doesn't constrain what the maintenance page can do.

## Cost

Workers free tier = 100,000 requests/day. GitHub Pages free hosting. Buttondown free tier (up to 1,000 subscribers). Total monthly cost: 0.
