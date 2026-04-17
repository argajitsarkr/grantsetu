"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef, useCallback } from "react";
import { useSession, signOut } from "next-auth/react";

/* ── Dropdown data ── */
const PLATFORM_ITEMS = [
  { href: "/grants", label: "Browse Grants", desc: "Search all active grant calls" },
  { href: "/alerts", label: "Email Alerts", desc: "Matched grants to your inbox" },
  { href: "/dashboard", label: "Dashboard", desc: "Track saved grants & applications", auth: true },
];

const AGENCIES_ITEMS = [
  { href: "/grants?agency=DBT", label: "DBT", desc: "Department of Biotechnology" },
  { href: "/grants?agency=BIRAC", label: "BIRAC", desc: "Biotech Industry Research Council" },
  { href: "/grants?agency=ICMR", label: "ICMR", desc: "Indian Council of Medical Research" },
  { href: "/grants?agency=CSIR", label: "CSIR", desc: "Council of Scientific & Industrial Research" },
  { href: "/grants?agency=AYUSH", label: "AYUSH", desc: "Ministry of AYUSH" },
  { href: "/grants?agency=DST", label: "DST", desc: "Dept. of Science & Technology" },
  { href: "/grants?agency=ANRF", label: "ANRF", desc: "Anusandhan National Research Foundation" },
];

const RESOURCES_ITEMS = [
  { href: "/grants?subject_area=Biotechnology", label: "Biotechnology", desc: "Core biotech, synbio, agri-biotech" },
  { href: "/grants?subject_area=Medical+Research", label: "Medical Research", desc: "Clinical, translational, public health" },
  { href: "/grants?subject_area=Drug+Discovery", label: "Drug Discovery", desc: "Pharmacology, vaccines, therapeutics" },
  { href: "/grants?career_stage=Early+Career", label: "Early Career", desc: "PM-ECRG, Ramalingaswami, INSPIRE" },
];

/* ── Chevron icon ── */
function ChevronDown({ className }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={className || "w-3.5 h-3.5"}>
      <path fillRule="evenodd" clipRule="evenodd" d="M2.558 6.295a.25.25 0 010-.353l.884-.884a.25.25 0 01.354 0L8 9.263l4.205-4.205a.25.25 0 01.353 0l.884.884a.25.25 0 010 .353L8.177 11.56a.25.25 0 01-.354 0L2.558 6.295z" fill="currentColor" />
    </svg>
  );
}

/* ── Dropdown — NUUK style: white panel, black text, red hover ── */
function NavDropdown({
  label, items, open, onToggle, isAuthenticated,
}: {
  label: string;
  items: typeof PLATFORM_ITEMS;
  open: boolean;
  onToggle: () => void;
  isAuthenticated: boolean;
}) {
  return (
    <div className="relative">
      <button
        className="flex items-center gap-1 py-2 cursor-pointer text-[13px] font-semibold tracking-[0.06em] uppercase text-black hover:text-[#E9283D] transition-colors duration-200 whitespace-nowrap"
        style={{ fontFamily: "var(--font-mono)" }}
        onClick={onToggle}
        aria-expanded={open}
        type="button"
      >
        <span>{label}</span>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      <div className={`dropdown-panel ${open ? "open" : ""}`}>
        <div className="space-y-0.5">
          {items
            .filter((item) => !("auth" in item) || isAuthenticated)
            .map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors group"
                onClick={onToggle}
              >
                <span className="text-[14px] font-bold text-black group-hover:text-[#E9283D] transition-colors uppercase tracking-wide" style={{ fontFamily: "var(--font-mono)" }}>{item.label}</span>
                <span className="text-[12px] text-gray-500 leading-snug mt-0.5">{item.desc}</span>
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const { data: session, status } = useSession();

  /* Close dropdowns on outside click + scroll */
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
      if (navRef.current && !navRef.current.contains(e.target as Node)) setOpenDropdown(null);
    }
    function handleScroll() {
      setOpenDropdown(null);
    }
    document.addEventListener("mousedown", handleClick);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      document.removeEventListener("mousedown", handleClick);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const isAuthenticated = status === "authenticated" && !!session?.user;
  const toggleDropdown = useCallback((name: string) => {
    setOpenDropdown((prev) => (prev === name ? null : name));
  }, []);

  return (
    <>
      {/* ── Top ticker banner — NUUK style red strip ── */}
      <div className="ticker-banner">
        <div className="ticker-track">
          {Array.from({ length: 6 }).map((_, i) => (
            <span key={i} className="text-[12px] font-semibold uppercase tracking-wider">
              🧬 India&apos;s #1 Grant Platform for Life Sciences & Biotechnology&nbsp;&nbsp;•&nbsp;&nbsp;Updated Daily from DBT, BIRAC, ICMR
            </span>
          ))}
        </div>
      </div>

      {/* ── Navbar — NUUK: white, black text, red accents ── */}
      <nav
        ref={navRef}
        className="sticky top-0 z-[9999] bg-white border-b-2 border-black"
      >
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8">
          <div className="flex items-center justify-between h-[var(--nav-height)]">
            {/* Logo — NUUK: wordmark, heavy, red */}
            <Link href="/" className="flex items-center flex-shrink-0">
              <span
                className="text-[#E9283D] font-black text-[28px] tracking-[-0.03em] uppercase"
                style={{ fontFamily: "var(--font-display)" }}
              >
                GrantSetu
              </span>
            </Link>

            {/* Desktop nav */}
            <div className="hidden lg:flex items-center gap-8 flex-1 justify-center">
              <Link
                href="/grants"
                className="py-2 text-[13px] font-semibold tracking-[0.06em] uppercase text-black hover:text-[#E9283D] transition-colors duration-200 whitespace-nowrap"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                Grants
              </Link>
              <NavDropdown
                label="Agencies"
                items={AGENCIES_ITEMS}
                open={openDropdown === "agencies"}
                onToggle={() => toggleDropdown("agencies")}
                isAuthenticated={isAuthenticated}
              />
              <NavDropdown
                label="Research Areas"
                items={RESOURCES_ITEMS}
                open={openDropdown === "resources"}
                onToggle={() => toggleDropdown("resources")}
                isAuthenticated={isAuthenticated}
              />
              <NavDropdown
                label="Platform"
                items={PLATFORM_ITEMS}
                open={openDropdown === "platform"}
                onToggle={() => toggleDropdown("platform")}
                isAuthenticated={isAuthenticated}
              />
              {isAuthenticated && session.user.isAdmin && (
                <Link
                  href="/admin"
                  className="py-2 text-[13px] font-semibold tracking-[0.06em] uppercase text-black hover:text-[#E9283D] transition-colors duration-200"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  Admin
                </Link>
              )}
            </div>

            {/* Right side — Auth + CTA */}
            <div className="hidden lg:flex items-center gap-3 flex-shrink-0">
              {status === "loading" && (
                <div className="h-[40px] w-[120px] bg-gray-100 rounded-lg animate-pulse" />
              )}
              {status === "unauthenticated" && (
                <>
                  <Link
                    href="/auth/signin"
                    className="text-[13px] font-semibold tracking-[0.06em] uppercase text-black hover:text-[#E9283D] transition-colors duration-200 py-2 px-3"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    Log in
                  </Link>
                  <Link
                    href="/grants"
                    className="inline-flex items-center justify-center h-[40px] px-6 bg-[#E9283D] text-white text-[13px] font-bold rounded-lg hover:bg-[#C91E30] hover:shadow-lg transition-all duration-200 uppercase tracking-wider"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    Browse Grants
                  </Link>
                </>
              )}
              {isAuthenticated && (
                <div className="relative" ref={menuRef}>
                  <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    {session.user.image ? (
                      <Image src={session.user.image} alt="" width={32} height={32} className="rounded-full" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-[#E9283D] flex items-center justify-center text-white text-sm font-bold">
                        {session.user.name?.[0]?.toUpperCase() || "U"}
                      </div>
                    )}
                    <span className="text-[14px] font-semibold text-black max-w-[120px] truncate">
                      {session.user.name || "User"}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
                  </button>
                  {menuOpen && (
                    <div className="absolute right-0 mt-2 w-52 bg-white border-2 border-black rounded-xl shadow-2xl py-2 z-50">
                      <Link href="/dashboard" className="block px-4 py-2.5 text-[14px] text-black hover:bg-gray-50 hover:text-[#E9283D] font-medium" onClick={() => setMenuOpen(false)}>Dashboard</Link>
                      <Link href="/profile" className="block px-4 py-2.5 text-[14px] text-black hover:bg-gray-50 hover:text-[#E9283D] font-medium" onClick={() => setMenuOpen(false)}>Edit Profile</Link>
                      <hr className="my-1.5 border-gray-200" />
                      <button onClick={() => signOut({ callbackUrl: "/" })} className="block w-full text-left px-4 py-2.5 text-[14px] text-[#E9283D] hover:bg-red-50 font-semibold">Sign Out</button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Mobile hamburger */}
            <button
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              <svg className="h-5 w-5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                }
              </svg>
            </button>
          </div>

          {/* Mobile drawer */}
          {mobileOpen && (
            <div className="lg:hidden border-t-2 border-black pb-6 pt-4">
              <div className="space-y-1">
                <p className="label-mono px-3 pb-1">Platform</p>
                {PLATFORM_ITEMS
                  .filter((item) => !("auth" in item) || isAuthenticated)
                  .map((item) => (
                    <Link key={item.href} href={item.href} className="block py-2.5 px-3 text-black font-semibold rounded-lg hover:bg-gray-50 hover:text-[#E9283D] transition-colors text-[15px]" onClick={() => setMobileOpen(false)}>
                      {item.label}
                      <span className="block text-xs text-gray-500 font-normal mt-0.5">{item.desc}</span>
                    </Link>
                  ))}

                <p className="label-mono px-3 pt-4 pb-1">Agencies</p>
                <div className="grid grid-cols-2 gap-1 px-1">
                  {AGENCIES_ITEMS.map((item) => (
                    <Link key={item.href} href={item.href} className="py-2 px-2 text-[14px] text-black font-semibold uppercase rounded-lg hover:bg-gray-50 hover:text-[#E9283D] transition-colors" style={{ fontFamily: "var(--font-mono)" }} onClick={() => setMobileOpen(false)}>
                      {item.label}
                    </Link>
                  ))}
                </div>

                {isAuthenticated && session.user.isAdmin && (
                  <>
                    <hr className="my-2 border-gray-200" />
                    <Link href="/admin" className="block py-2.5 px-3 text-black font-semibold rounded-lg hover:bg-gray-50 hover:text-[#E9283D] transition-colors text-[15px]" onClick={() => setMobileOpen(false)}>Admin</Link>
                  </>
                )}

                <div className="pt-6 flex flex-col gap-2.5">
                  {isAuthenticated ? (
                    <>
                      <div className="flex items-center gap-3 px-3 py-2">
                        {session.user.image ? (
                          <Image src={session.user.image} alt="" width={36} height={36} className="rounded-full" />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-[#E9283D] flex items-center justify-center text-white text-sm font-bold">
                            {session.user.name?.[0]?.toUpperCase() || "U"}
                          </div>
                        )}
                        <div>
                          <div className="text-[14px] font-semibold text-black">{session.user.name}</div>
                          <div className="text-xs text-gray-500">{session.user.email}</div>
                        </div>
                      </div>
                      <Link href="/profile" className="block w-full text-center border-2 border-black text-black py-2.5 rounded-lg font-bold text-[14px] uppercase tracking-wider hover:bg-black hover:text-white transition-colors" style={{ fontFamily: "var(--font-mono)" }} onClick={() => setMobileOpen(false)}>Edit Profile</Link>
                      <button onClick={() => { signOut({ callbackUrl: "/" }); setMobileOpen(false); }} className="block w-full text-center bg-[#E9283D] text-white py-2.5 rounded-lg font-bold text-[14px] uppercase tracking-wider hover:bg-[#C91E30] transition-colors" style={{ fontFamily: "var(--font-mono)" }}>Sign Out</button>
                    </>
                  ) : (
                    <>
                      <Link href="/auth/signin" onClick={() => setMobileOpen(false)} className="block w-full text-center border-2 border-black text-black py-2.5 rounded-lg font-bold text-[14px] uppercase tracking-wider hover:bg-black hover:text-white transition-colors" style={{ fontFamily: "var(--font-mono)" }}>Log in</Link>
                      <Link href="/grants" onClick={() => setMobileOpen(false)} className="block w-full text-center bg-[#E9283D] text-white py-2.5 rounded-lg font-bold text-[14px] uppercase tracking-wider hover:bg-[#C91E30] transition-all" style={{ fontFamily: "var(--font-mono)" }}>Browse Grants</Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );
}
