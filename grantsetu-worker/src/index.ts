/**
 * GrantSetu downtime fallback Worker.
 *
 * Sits in front of grantsetu.in + www.grantsetu.in. On every request:
 *   - POST /__downtime/notify  -> handle ourselves (Buttondown signup with
 *                                 tag "outage-notify"); never proxied.
 *   - anything else            -> fetch origin (the Cloudflare Tunnel route).
 *                                 If origin is reachable and healthy, return
 *                                 its response unchanged. If origin is
 *                                 unreachable or returns a tunnel-down
 *                                 status (521-526, 502, 503), serve the
 *                                 inline branded maintenance HTML.
 *
 * The maintenance page is fully self-contained: inline SVG logo, inline
 * CSS, inline JS. No external font / image / script fetches that could
 * themselves fail when the origin is down.
 */

interface Env {
  BUTTONDOWN_API_KEY?: string;
  OUTAGE_TAG?: string;
}

const DOWN_STATUSES = new Set([502, 503, 521, 522, 523, 524, 525, 526]);

export default {
  async fetch(request: Request, env: Env, _ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    // Worker-handled signup endpoint - must work even when origin is dead.
    if (request.method === "POST" && url.pathname === "/__downtime/notify") {
      return handleNotify(request, env);
    }

    // Everything else: try the origin, fall back to maintenance page.
    try {
      const originRes = await fetch(request);
      if (DOWN_STATUSES.has(originRes.status)) {
        return maintenanceResponse();
      }
      return originRes;
    } catch {
      return maintenanceResponse();
    }
  },
};

// ───────────────────────────────────────────────────────────────────────────
// Email capture
// ───────────────────────────────────────────────────────────────────────────

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function handleNotify(request: Request, env: Env): Promise<Response> {
  let email = "";
  try {
    const body = (await request.json()) as { email?: unknown };
    if (typeof body.email === "string") email = body.email.trim().toLowerCase();
  } catch {
    return jsonResponse({ ok: false, error: "invalid_json" }, 400);
  }

  if (!email || !EMAIL_RE.test(email) || email.length > 254) {
    return jsonResponse({ ok: false, error: "invalid_email" }, 400);
  }

  if (!env.BUTTONDOWN_API_KEY) {
    // Dev / misconfigured deploy. Don't 500 on the user; quietly succeed so
    // the UI still shows a friendly state. Visible in `wrangler tail`.
    console.warn("[downtime] BUTTONDOWN_API_KEY not set - skipping subscribe");
    return jsonResponse({ ok: true, status: "created" });
  }

  const tag = env.OUTAGE_TAG || "outage-notify";
  const ip =
    request.headers.get("cf-connecting-ip") ||
    (request.headers.get("x-forwarded-for") || "").split(",")[0].trim() ||
    undefined;
  const referrerUrl = request.headers.get("referer") || undefined;

  const payload: Record<string, unknown> = {
    email_address: email,
    tags: [tag],
    type: "unactivated",
  };
  if (ip) payload.ip_address = ip;
  if (referrerUrl) payload.referrer_url = referrerUrl;

  try {
    const resp = await fetch("https://api.buttondown.com/v1/subscribers", {
      method: "POST",
      headers: {
        Authorization: `Token ${env.BUTTONDOWN_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (resp.status === 200 || resp.status === 201) {
      // Trigger the confirmation email immediately - same pattern the FastAPI
      // backend uses (api-created unactivated subscribers don't otherwise get
      // a confirmation until the 24h reminder cron fires).
      sendReminderBestEffort(env.BUTTONDOWN_API_KEY, email);
      return jsonResponse({ ok: true, status: "created" });
    }

    const text = await resp.text();
    if (resp.status === 400 && text.toLowerCase().includes("already")) {
      sendReminderBestEffort(env.BUTTONDOWN_API_KEY, email);
      return jsonResponse({ ok: true, status: "existed" });
    }

    console.error(`[downtime] Buttondown ${resp.status}: ${text.slice(0, 300)}`);
    return jsonResponse({ ok: false, error: "upstream_error" }, 502);
  } catch (err) {
    console.error("[downtime] Buttondown network error:", err);
    return jsonResponse({ ok: false, error: "network_error" }, 502);
  }
}

async function sendReminderBestEffort(apiKey: string, email: string): Promise<void> {
  const candidates: Array<[string, unknown | null]> = [
    [`https://api.buttondown.com/v1/subscribers/${encodeURIComponent(email)}/send-reminder`, null],
    [`https://api.buttondown.com/v1/subscribers/${encodeURIComponent(email)}/emails`, { type: "reminder" }],
    [`https://api.buttondown.com/v1/subscribers/${encodeURIComponent(email)}/emit-event`, { event: "remind" }],
  ];
  for (const [url, body] of candidates) {
    try {
      const r = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Token ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: body == null ? undefined : JSON.stringify(body),
      });
      if (r.status >= 200 && r.status < 300) return;
    } catch {
      // try next variant
    }
  }
  console.warn(`[downtime] confirmation send-reminder failed for ${email}`);
}

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}

// ───────────────────────────────────────────────────────────────────────────
// Maintenance page
// ───────────────────────────────────────────────────────────────────────────

function maintenanceResponse(): Response {
  return new Response(MAINTENANCE_HTML, {
    status: 503,
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "no-store",
      "retry-after": "300",
    },
  });
}

const MAINTENANCE_HTML = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex">
<title>GrantSetu - briefly offline</title>
<style>
  *,*::before,*::after{box-sizing:border-box}
  html,body{margin:0;padding:0;height:100%;background:#fff;color:#0A0A0A}
  body{
    font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;
    -webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;
    display:flex;flex-direction:column;min-height:100vh;
  }
  .topbar{height:4px;background:#E9283D}
  main{
    flex:1;display:flex;align-items:center;justify-content:center;
    padding:32px 20px;
  }
  .card{
    width:100%;max-width:560px;
    border:2px solid #0A0A0A;border-radius:18px;
    padding:36px 32px;
    box-shadow:8px 8px 0 0 #E9283D;
    background:#fff;
  }
  .brand{
    display:inline-flex;align-items:center;gap:10px;
    font-weight:800;font-size:18px;letter-spacing:-0.01em;
    margin-bottom:28px;
  }
  .brand-mark{
    width:30px;height:30px;border-radius:8px;background:#E9283D;
    display:inline-flex;align-items:center;justify-content:center;
    color:#fff;font-weight:900;font-size:15px;
  }
  .pill{
    display:inline-block;font-size:11px;font-weight:700;
    text-transform:uppercase;letter-spacing:0.15em;
    color:#fff;background:#E9283D;padding:5px 10px;border-radius:999px;
    margin-bottom:18px;
  }
  h1{
    font-size:30px;line-height:1.1;margin:0 0 14px;
    letter-spacing:-0.02em;font-weight:800;
  }
  p{font-size:15.5px;line-height:1.55;margin:0 0 14px;color:#3a3a3a}
  p.muted{font-size:13px;color:#6b7280;margin-top:18px}
  form{
    display:flex;gap:8px;margin-top:22px;flex-wrap:wrap;
  }
  input[type=email]{
    flex:1;min-width:0;
    padding:13px 14px;font-size:15px;
    border:2px solid #0A0A0A;border-radius:10px;
    background:#fff;color:#0A0A0A;outline:none;
    font-family:inherit;
  }
  input[type=email]:focus{box-shadow:0 0 0 3px rgba(233,40,61,0.25)}
  button{
    padding:13px 22px;font-size:14px;font-weight:700;
    text-transform:uppercase;letter-spacing:0.08em;
    border:2px solid #0A0A0A;border-radius:10px;
    background:#0A0A0A;color:#fff;cursor:pointer;
    font-family:inherit;transition:transform .08s ease;
  }
  button:hover{background:#E9283D;border-color:#E9283D}
  button:active{transform:translateY(1px)}
  button[disabled]{opacity:0.5;cursor:not-allowed}
  .status{
    margin-top:14px;font-size:13.5px;line-height:1.5;
    min-height:20px;
  }
  .status.ok{color:#0a7d3a}
  .status.err{color:#c91e30}
  footer{
    text-align:center;padding:18px;
    font-size:12px;color:#6b7280;
    border-top:1px solid #eee;
  }
  @media(max-width:520px){
    .card{padding:28px 22px;box-shadow:6px 6px 0 0 #E9283D}
    h1{font-size:25px}
    button{width:100%}
  }
</style>
</head>
<body>
<div class="topbar"></div>
<main>
  <div class="card">
    <div class="brand"><span class="brand-mark">G</span> GrantSetu</div>
    <span class="pill">Briefly offline</span>
    <h1>We're catching our breath.</h1>
    <p>The GrantSetu server is recovering from a power cut at our location. We'll be back in a few minutes - usually under an hour.</p>
    <p>Drop your email and we'll ping you the moment we're back online.</p>
    <form id="notify-form" novalidate>
      <input type="email" name="email" id="email" placeholder="you@university.ac.in" autocomplete="email" required>
      <button type="submit" id="submit">Notify me</button>
    </form>
    <div class="status" id="status" role="status" aria-live="polite"></div>
    <p class="muted">No newsletter spam - one email when the site is back, nothing else. You can unsubscribe in one click.</p>
  </div>
</main>
<footer>GrantSetu - India's grant discovery platform for life sciences &amp; biotech researchers</footer>
<script>
(function(){
  var form = document.getElementById('notify-form');
  var input = document.getElementById('email');
  var btn = document.getElementById('submit');
  var status = document.getElementById('status');
  form.addEventListener('submit', function(e){
    e.preventDefault();
    var email = (input.value || '').trim();
    if (!email || !/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email)) {
      status.className = 'status err';
      status.textContent = 'Please enter a valid email address.';
      return;
    }
    btn.disabled = true;
    var prev = btn.textContent;
    btn.textContent = 'Sending...';
    status.className = 'status';
    status.textContent = '';
    fetch('/__downtime/notify', {
      method: 'POST',
      headers: {'content-type':'application/json'},
      body: JSON.stringify({email: email})
    })
    .then(function(r){ return r.json().then(function(j){ return {status: r.status, body: j}; }); })
    .then(function(res){
      if (res.body && res.body.ok) {
        form.style.display = 'none';
        status.className = 'status ok';
        status.textContent = res.body.status === 'existed'
          ? "You're already on the list - we'll email you the moment we're back."
          : "Got it. Check your inbox to confirm, and we'll ping you when the site returns.";
      } else {
        status.className = 'status err';
        status.textContent = "Couldn't save your email right now. Please try again in a minute.";
        btn.disabled = false;
        btn.textContent = prev;
      }
    })
    .catch(function(){
      status.className = 'status err';
      status.textContent = "Network hiccup - please try again.";
      btn.disabled = false;
      btn.textContent = prev;
    });
  });
})();
</script>
</body>
</html>`;
