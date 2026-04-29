/**
 * GrantSetu downtime redirect Worker.
 *
 * Sits in front of grantsetu.in + www.grantsetu.in. Every request:
 *   - try fetch(origin) (the existing Cloudflare Tunnel route)
 *   - if origin returns a tunnel-down status (502/503/521-526) or fetch
 *     itself throws, 302-redirect the visitor to the GitHub Pages
 *     maintenance site (FALLBACK_URL)
 *   - otherwise, pass the origin response through unchanged
 *
 * That GitHub Pages site (separate repo: argajitsarkr.github.io) hosts the
 * branded "we're briefly offline" HTML and a Buttondown embed-subscribe
 * form tagged "outage-notify" - no API key or email handling lives in the
 * Worker. To update content, edit the GitHub Pages page; the Worker never
 * needs to be touched again.
 */

// Cloudflare returns HTTP 530 for tunnel-disconnected errors (the visible
// "Error 1033" page) and 520 for "unknown origin error". 521-526 cover
// origin-unreachable / SSL / timeout cases. 502/503 cover bad-gateway and
// service-unavailable from any layer in front of the tunnel.
const DOWN_STATUSES = new Set([502, 503, 520, 521, 522, 523, 524, 525, 526, 530]);

export default {
  async fetch(request, env) {
    const fallback = env.FALLBACK_URL || "https://argajitsarkr.github.io/grantsetu-offline/";
    try {
      const res = await fetch(request);
      if (DOWN_STATUSES.has(res.status)) {
        return Response.redirect(fallback, 302);
      }
      return res;
    } catch {
      return Response.redirect(fallback, 302);
    }
  },
};
