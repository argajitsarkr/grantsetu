import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-[#0F172A] text-white">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          {/* Brand */}
          <div className="md:col-span-4">
            <div className="mb-5">
              <Image
                src="/grantsetu-logo.png"
                alt="GrantSetu"
                width={128}
                height={32}
                className="object-contain brightness-200"
              />
            </div>
            <p className="text-gray-400 text-[14px] leading-relaxed max-w-xs">
              India&apos;s free research grant discovery platform. Aggregating active grant calls from 8+ government agencies — updated daily.
            </p>
          </div>

          {/* Platform */}
          <div className="md:col-span-2">
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-5">Platform</h4>
            <ul className="space-y-3">
              {[
                { href: "/grants", label: "Browse Grants" },
                { href: "/alerts", label: "Email Alerts" },
                { href: "/auth/signin", label: "Sign In" },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-[14px] text-gray-400 hover:text-white transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Agencies */}
          <div className="md:col-span-3">
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-5">Agencies</h4>
            <ul className="space-y-3">
              {[
                { href: "/grants?agency=DBT", label: "DBT" },
                { href: "/grants?agency=DST", label: "DST" },
                { href: "/grants?agency=ICMR", label: "ICMR" },
                { href: "/grants?agency=ANRF", label: "ANRF" },
                { href: "/grants?agency=BIRAC", label: "BIRAC" },
                { href: "/grants?agency=CSIR", label: "CSIR" },
                { href: "/grants?agency=UGC", label: "UGC" },
                { href: "/grants?agency=AYUSH", label: "AYUSH" },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-[14px] text-gray-400 hover:text-white transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className="md:col-span-3">
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-5">Company</h4>
            <ul className="space-y-3">
              {[
                { href: "/admin", label: "Admin Dashboard" },
                { href: "https://github.com/argajitsarkr/grantsetu", label: "GitHub" },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-[14px] text-gray-400 hover:text-white transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-xs text-gray-600 leading-relaxed">
              Data sourced from official government portals. GrantSetu is not affiliated with any agency.
            </p>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-14 pt-8 border-t border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} GrantSetu. Built by a PhD researcher, for researchers.
          </p>
          <div className="flex items-center gap-5">
            <a href="https://twitter.com/grantsetu" className="text-gray-500 hover:text-white transition-colors" aria-label="X / Twitter">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a href="https://linkedin.com/company/grantsetu" className="text-gray-500 hover:text-white transition-colors" aria-label="LinkedIn">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </a>
            <a href="https://github.com/argajitsarkr/grantsetu" className="text-gray-500 hover:text-white transition-colors" aria-label="GitHub">
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
