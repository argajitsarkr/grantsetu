import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-brand-900 text-white mt-auto relative overflow-hidden">
      {/* Subtle grid bg like Topmate dark sections */}
      <div className="absolute inset-0 bg-grid opacity-60 pointer-events-none" />

      <div className="relative container-main py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          {/* Brand */}
          <div className="md:col-span-5">
            <div className="mb-5">
              <Image
                src="/grantsetu-logo.png"
                alt="GrantSetu"
                width={120}
                height={36}
                className="object-contain"
              />
            </div>
            <p className="text-brand-400 text-sm leading-relaxed max-w-xs">
              Helping Indian researchers discover government research grants — all in one place.
              Updated daily from official agency portals.
            </p>
            {/* Made in India badge */}
            <div className="mt-6 inline-flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-pill border border-white/10 text-xs text-brand-400">
              🇮🇳 Made in India — for Indian researchers
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3">
            <h4 className="text-sm font-semibold text-white/50 uppercase tracking-[0.1em] mb-5">Platform</h4>
            <ul className="space-y-3">
              {[
                { href: "/grants", label: "Browse Grants" },
                { href: "/alerts", label: "Set Up Alerts" },
                { href: "/admin",  label: "Admin Dashboard" },
                { href: "/auth/signin", label: "Sign In" },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-sm text-brand-400 hover:text-white transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Agencies */}
          <div className="md:col-span-4">
            <h4 className="text-sm font-semibold text-white/50 uppercase tracking-[0.1em] mb-5">Agencies Tracked</h4>
            <div className="flex flex-wrap gap-2">
              {["DBT", "DST", "ICMR", "ANRF", "BIRAC", "CSIR", "UGC", "AYUSH"].map((a) => (
                <span key={a} className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-md text-xs text-brand-400 font-medium">
                  {a}
                </span>
              ))}
            </div>
            <p className="mt-5 text-xs text-brand-500 leading-relaxed">
              Data sourced from official government portals. GrantSetu is not affiliated with any agency.
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-brand-500">
            &copy; {new Date().getFullYear()} GrantSetu. Built by a PhD researcher, for researchers.
          </p>
          <div className="flex items-center gap-5">
            <a href="#" className="text-brand-500 hover:text-white transition-colors" aria-label="X / Twitter">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a href="#" className="text-brand-500 hover:text-white transition-colors" aria-label="LinkedIn">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
