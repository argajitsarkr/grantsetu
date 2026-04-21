import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-black text-white border-t-2 border-[#E9283D]">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          {/* Brand */}
          <div className="md:col-span-4">
            <Link href="/" className="inline-block mb-5">
              <span
                className="text-[#E9283D] font-black text-[28px] uppercase tracking-tight"
                style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.02em" }}
              >
                GrantSetu
              </span>
            </Link>
            <p
              className="text-white/60 text-[14px] leading-relaxed max-w-xs"
              style={{ fontFamily: "var(--font-body)" }}
            >
              India&apos;s #1 grant discovery platform for{" "}
              <span className="text-white font-semibold">Life Sciences &amp; Biotechnology</span>.
              Curated calls from DBT, BIRAC, ICMR and more - updated daily.
            </p>
            <div className="mt-6 inline-flex items-center gap-2 px-3 py-1.5 border border-white/20 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E9283D] animate-pulse" />
              <span
                className="text-[11px] uppercase tracking-wider text-white/70"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                Life Sci · Biotech Focus
              </span>
            </div>
          </div>

          {/* Platform */}
          <div className="md:col-span-2">
            <h4
              className="text-[11px] tracking-[0.15em] uppercase text-[#E9283D] mb-5 font-semibold"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              Platform
            </h4>
            <ul className="space-y-3">
              {[
                { href: "/grants", label: "Browse Grants" },
                { href: "/newsletter", label: "Weekly Newsletter" },
                { href: "/dashboard", label: "Dashboard" },
                { href: "/auth/signin", label: "Sign In" },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-[14px] text-white/60 hover:text-white transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Agencies - Life Sci priority */}
          <div className="md:col-span-3">
            <h4
              className="text-[11px] tracking-[0.15em] uppercase text-[#E9283D] mb-5 font-semibold"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              Agencies
            </h4>
            <ul className="space-y-3">
              {[
                { href: "/grants?agency=DBT", label: "DBT", tag: "Primary" },
                { href: "/grants?agency=BIRAC", label: "BIRAC", tag: "Primary" },
                { href: "/grants?agency=ICMR", label: "ICMR", tag: "Primary" },
                { href: "/grants?agency=CSIR", label: "CSIR", tag: null },
                { href: "/grants?agency=AYUSH", label: "AYUSH", tag: null },
                { href: "/grants?agency=DST", label: "DST", tag: null },
                { href: "/grants?agency=ANRF", label: "ANRF", tag: null },
              ].map(({ href, label, tag }) => (
                <li key={href} className="flex items-center gap-2">
                  <Link href={href} className="text-[14px] text-white/60 hover:text-white transition-colors">
                    {label}
                  </Link>
                  {tag && (
                    <span
                      className="text-[9px] uppercase tracking-wider text-[#E9283D] border border-[#E9283D]/40 px-1.5 py-0.5 rounded-full"
                      style={{ fontFamily: "var(--font-mono)" }}
                    >
                      {tag}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className="md:col-span-3">
            <h4
              className="text-[11px] tracking-[0.15em] uppercase text-[#E9283D] mb-5 font-semibold"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              Company
            </h4>
            <ul className="space-y-3">
              {[
                { href: "/admin", label: "Admin Dashboard" },
                { href: "https://github.com/argajitsarkr/grantsetu", label: "GitHub" },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-[14px] text-white/60 hover:text-white transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-xs text-white/40 leading-relaxed">
              Data sourced from official government portals. GrantSetu is not affiliated with any agency.
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-14 mb-8 h-px bg-white/10" />

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <p
            className="text-xs text-white/50"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            &copy; {new Date().getFullYear()} GRANTSETU · BUILT BY A PHD RESEARCHER, FOR RESEARCHERS
          </p>
          <div className="flex items-center gap-5">
            <a href="https://twitter.com/grantsetu" className="text-white/50 hover:text-[#E9283D] transition-colors" aria-label="X / Twitter">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a href="https://linkedin.com/company/grantsetu" className="text-white/50 hover:text-[#E9283D] transition-colors" aria-label="LinkedIn">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </a>
            <a href="https://github.com/argajitsarkr/grantsetu" className="text-white/50 hover:text-[#E9283D] transition-colors" aria-label="GitHub">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
