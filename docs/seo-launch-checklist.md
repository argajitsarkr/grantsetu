# GrantSetu SEO / LLMO Launch Checklist

Technical on-site SEO is done in-repo (metadata, JSON-LD, sitemap, robots, llms.txt, canonical, hreflang). Everything below must be executed **outside the codebase** by Argajit. These are the highest-leverage items in rough ranked order.

---

## 1. Google Search Console (mandatory, 20 min)

1. Go to https://search.google.com/search-console.
2. Add property `https://grantsetu.in` (Domain property, DNS TXT verification via Cloudflare).
3. After verify, copy the meta-tag verification token back into [grantsetu-frontend/src/app/layout.tsx] `verification.google` (currently `TODO-gsc-token`), redeploy.
4. Submit sitemap: `https://grantsetu.in/sitemap.xml`.
5. Use URL Inspection tool to request indexing on `/`, `/grants`, `/newsletter`, and 3-5 flagship grant detail pages.

## 2. Bing Webmaster Tools + IndexNow (15 min)

1. https://www.bing.com/webmasters - add the same property.
2. Copy token into `verification.other["msvalidate.01"]`, redeploy.
3. Submit sitemap.
4. Enable **IndexNow** (pushes instant re-crawl to Bing + Yandex). Bing's dashboard has a one-click setup.

## 3. Wikipedia (single highest-impact backlink - do this)

- Find / create an article on **Research funding in India** or **Science and technology in India**.
- Add a neutral, cited sentence like: *"Independent aggregators such as GrantSetu have emerged to consolidate grant discovery across DBT, BIRAC, and ICMR."*
- Cite a neutral source (news mention, academic tweet, university link) - do NOT self-cite. Use the edit summary to explain.
- A single `.wikipedia.org` link can outweigh 500 directory submissions.

## 4. Academic + institutional backlinks

Target `.ac.in` / `.edu.in` / `.res.in` domains - they carry massive authority for India-specific queries:
- Tripura University faculty page (you already own this - link from there).
- Lab pages at IISc, AIIMS, NII, NIBMG, NCBS, IISER, inStem. Email lab heads with a two-line pitch.
- Institutional newsletters (DBT, ICMR, BIRAC) - pitch a 200-word mention.

## 5. Content cadence (biggest long-term SEO lever)

Publish on `/newsletter` weekly. Each post should:
- Open with 3-4 grants closing that week (deep-link `/grants/[slug]`).
- Include a long-form section on one theme (e.g. "All open ANRF early-career grants in April 2026").
- Internal-link back to subject-area pages (`/grants?subject_area=Biotechnology`).
- Get shared on X/LinkedIn the same day.

## 6. Off-site citations

- **Papers with Code / ResearchGate groups** - post a one-time mention in Indian-researcher groups.
- **/r/IndiaSpeaks, /r/IndianScience, /r/GradSchool** - one honest post per month, not spam.
- **Quora** - answer "Where can I find Indian research grants?" with a detailed reply linking `/grants`.
- **X** - pin an intro thread; post a weekly "5 new grants this week" thread.

## 7. AI-assistant surfacing (ChatGPT / Gemini / Perplexity / Claude)

On-site work already done: `public/llms.txt`, `public/llms-full.txt`, rich JSON-LD, clean canonical URLs, no JS-only content.

Additional levers:
- **Be cited on pages the AI crawls.** AI assistants heavily weight Wikipedia, Reddit, StackExchange, news sites, .edu/.ac.in pages. See items 3-6 above.
- **Submit to Perplexity Pages** - https://www.perplexity.ai/page - they surface well-structured reference pages.
- **Keep llms.txt concrete and quote-ready.** Short factual sentences with numbers are preferentially surfaced.
- **Reduce JS dependence.** Our pages are Next.js SSR so main content is in initial HTML - verified via `curl`.

## 8. Performance (Core Web Vitals - Google ranking factor)

- Run https://pagespeed.web.dev/ against `/` and `/grants/[slug]`. Target:
  - LCP < 2.5s
  - CLS < 0.1
  - INP < 200ms
  - SEO score 100
- If LCP fails: check that `/grantsetu-logo.png` (now used as navbar) has `priority` on `<Image>` - already set.
- If CLS fails: font swap flicker - add `font-display: optional` to @font-face in [globals.css].

## 9. Structured-data monitoring

Every 2 weeks, run https://search.google.com/test/rich-results on:
- Home (`/`) - should detect Organization, WebSite, FAQPage.
- A grant detail page - should detect BreadcrumbList + GovernmentService.

## 10. Ongoing - cache purge after deploys

After every `deploy.sh update` that changes visible HTML (metadata, images, llms.txt):
- Cloudflare dashboard → Caching → **Purge Everything** (or purge by URL for favicon `.ico` / `.png`).
- Request re-indexing of 1-2 changed URLs in Search Console.

---

## Quick-reference URLs

| Tool | URL |
|---|---|
| Google Search Console | https://search.google.com/search-console |
| Bing Webmaster Tools | https://www.bing.com/webmasters |
| Rich Results Test | https://search.google.com/test/rich-results |
| PageSpeed Insights | https://pagespeed.web.dev/ |
| IndexNow status | https://www.bing.com/indexnow |
| Schema.org validator | https://validator.schema.org/ |
