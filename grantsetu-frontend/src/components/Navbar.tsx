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
  { href: "/grants?agency=DST", label: "DST", desc: "Dept. of Science & Technology" },
  { href: "/grants?agency=ICMR", label: "ICMR", desc: "Indian Council of Medical Research" },
  { href: "/grants?agency=ANRF", label: "ANRF", desc: "Anusandhan National Research Foundation" },
  { href: "/grants?agency=BIRAC", label: "BIRAC", desc: "Biotech Industry Research Assistance Council" },
  { href: "/grants?agency=CSIR", label: "CSIR", desc: "Council of Scientific & Industrial Research" },
  { href: "/grants?agency=UGC", label: "UGC", desc: "University Grants Commission" },
  { href: "/grants?agency=AYUSH", label: "AYUSH", desc: "Ministry of AYUSH" },
];

const RESOURCES_ITEMS = [
  { href: "/grants?career_stage=Early+Career", label: "Early Career Grants", desc: "PM-ECRG, INSPIRE, Start-Up Grants" },
  { href: "/grants?career_stage=Women+Scientists", label: "Women in Science", desc: "WOS-A, BioCARe, POWER schemes" },
  { href: "/grants?subject_area=Life+Sciences", label: "Life Sciences", desc: "Biology, Biotech, Medical research" },
  { href: "/grants?subject_area=Engineering", label: "Engineering & Tech", desc: "Core engineering, CS, Electronics" },
];

/* ── Chevron icon — indicium.ai style ── */
function ChevronDown({ className }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={className || "w-3.5 h-3.5"}>
      <path fillRule="evenodd" clipRule="evenodd" d="M2.558 6.295a.25.25 0 010-.353l.884-.884a.25.25 0 01.354 0L8 9.263l4.205-4.205a.25.25 0 01.353 0l.884.884a.25.25 0 010 .353L8.177 11.56a.25.25 0 01-.354 0L2.558 6.295z" fill="currentColor" />
    </svg>
  );
}

/* ── Dropdown component — indicium.ai style ── */
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
        className="flex items-center gap-1 py-2 cursor-pointer text-[13px] tracking-[0.04em] uppercase text-white/70 hover:text-white transition-colors duration-200 whitespace-nowrap"
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
                <span className="text-[14px] font-medium text-gray-900 group-hover:text-[#2451F3] transition-colors">{item.label}</span>
                <span className="text-[12px] text-gray-400 leading-snug mt-0.5">{item.desc}</span>
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
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const { data: session, status } = useSession();

  /* Scroll effect + close dropdowns */
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
      if (navRef.current && !navRef.current.contains(e.target as Node)) setOpenDropdown(null);
    }
    function handleScroll() {
      setOpenDropdown(null);
      setScrolled(window.scrollY > 50);
    }
    document.addEventListener("mousedown", handleClick);
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
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
      {/* ── Navbar — indicium.ai: fixed, full-width, transparent→solid on scroll ── */}
      <nav
        ref={navRef}
        className={`fixed top-0 left-0 right-0 z-[9999] transition-all duration-300 ${
          scrolled
            ? "bg-[#05073F]/95 backdrop-blur-xl shadow-lg"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8">
          <div className="flex items-center justify-between h-[var(--nav-height)]">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
              <Image
                src="/grantsetu-logo.png"
                alt=""
                width={32}
                height={32}
                className="object-contain rounded-md"
                priority
              />
              <span className="text-white font-medium text-[18px] tracking-[-0.01em]" style={{ fontFamily: "var(--font-display)" }}>
                GrantSetu
              </span>
            </Link>

            {/* Desktop nav — indicium.ai: mono labels, uppercase, spaced */}
            <div className="hidden lg:flex items-center gap-7 flex-1 justify-center">
              <Link
                href="/grants"
                className="py-2 text-[13px] tracking-[0.04em] uppercase text-white/70 hover:text-white transition-colors duration-200 whitespace-nowrap"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                Grants
              </Link>
              <NavDropdown
                label="Platform"
                items={PLATFORM_ITEMS}
                open={openDropdown === "platform"}
                onToggle={() => toggleDropdown("platform")}
                isAuthenticated={isAuthenticated}
              />
              <NavDropdown
                label="Agencies"
                items={AGENCIES_ITEMS}
                open={openDropdown === "agencies"}
                onToggle={() => toggleDropdown("agencies")}
                isAuthenticated={isAuthenticated}
              />
              <NavDropdown
                label="Resources"
                items={RESOURCES_ITEMS}
                open={openDropdown === "resources"}
                onToggle={() => toggleDropdown("resources")}
                isAuthenticated={isAuthenticated}
              />
              {isAuthenticated && session.user.isAdmin && (
                <Link
                  href="/admin"
                  className="py-2 text-[13px] tracking-[0.04em] uppercase text-white/70 hover:text-white transition-colors duration-200"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  Admin
                </Link>
              )}
            </div>

            {/* Right side — Auth + CTA */}
            <div className="hidden lg:flex items-center gap-4 flex-shrink-0">
              {status === "loading" && (
                <div className="h-[40px] w-[120px] bg-white/10 rounded-lg animate-pulse" />
              )}
              {status === "unauthenticated" && (
                <>
                  <Link
                    href="/auth/signin"
                    className="text-[13px] tracking-[0.04em] uppercase text-white/60 hover:text-white transition-colors duration-200 py-2 px-3"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    Log in
                  </Link>
                  <Link
                    href="/grants"
                    className="inline-flex items-center justify-center h-[40px] px-6 bg-[#2451F3] text-white text-[13px] font-medium rounded-lg hover:brightness-110 hover:shadow-lg transition-all duration-200"
                  >
                    Browse Grants
                  </Link>
                </>
              )}
              {isAuthenticated && (
                <div className="relative" ref={menuRef}>
                  <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    {session.user.image ? (
                      <Image src={session.user.image} alt="" width={32} height={32} className="rounded-full" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-[#2451F3] flex items-center justify-center text-white text-sm font-medium">
                        {session.user.name?.[0]?.toUpperCase() || "U"}
                      </div>
                    )}
                    <span className="text-[14px] font-medium text-white/80 max-w-[120px] truncate">
                      {session.user.name || "User"}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-white/50" />
                  </button>
                  {menuOpen && (
                    <div className="absolute right-0 mt-2 w-52 bg-white/95 backdrop-blur-xl border border-gray-100 rounded-xl shadow-2xl py-2 z-50">
                      <Link href="/dashboard" className="block px-4 py-2.5 text-[14px] text-gray-700 hover:bg-gray-50" onClick={() => setMenuOpen(false)}>Dashboard</Link>
                      <Link href="/profile" className="block px-4 py-2.5 text-[14px] text-gray-700 hover:bg-gray-50" onClick={() => setMenuOpen(false)}>Edit Profile</Link>
                      <hr className="my-1.5 border-gray-100" />
                      <button onClick={() => signOut({ callbackUrl: "/" })} className="block w-full text-left px-4 py-2.5 text-[14px] text-red-600 hover:bg-red-50">Sign Out</button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Mobile hamburger */}
            <button
              className="lg:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                }
              </svg>
            </button>
          </div>

          {/* Mobile drawer */}
          {mobileOpen && (
            <div className="lg:hidden border-t border-white/10 pb-6 pt-4">
              <div className="space-y-1">
                <p className="label-mono px-3 pb-1 text-[10px]">Platform</p>
                {PLATFORM_ITEMS
                  .filter((item) => !("auth" in item) || isAuthenticated)
                  .map((item) => (
                    <Link key={item.href} href={item.href} className="block py-2.5 px-3 text-white/80 font-medium rounded-lg hover:bg-white/10 transition-colors text-[15px]" onClick={() => setMobileOpen(false)}>
                      {item.label}
                      <span className="block text-xs text-white/40 font-normal mt-0.5">{item.desc}</span>
                    </Link>
                  ))}

                <p className="label-mono px-3 pt-4 pb-1 text-[10px]">Agencies</p>
                <div className="grid grid-cols-2 gap-1 px-1">
                  {AGENCIES_ITEMS.map((item) => (
                    <Link key={item.href} href={item.href} className="py-2 px-2 text-[14px] text-white/80 font-medium rounded-lg hover:bg-white/10 transition-colors" onClick={() => setMobileOpen(false)}>
                      {item.label}
                    </Link>
                  ))}
                </div>

                {isAuthenticated && session.user.isAdmin && (
                  <>
                    <hr className="my-2 border-white/10" />
                    <Link href="/admin" className="block py-2.5 px-3 text-white/80 font-medium rounded-lg hover:bg-white/10 transition-colors text-[15px]" onClick={() => setMobileOpen(false)}>Admin</Link>
                  </>
                )}

                <div className="pt-6 flex flex-col gap-2.5">
                  {isAuthenticated ? (
                    <>
                      <div className="flex items-center gap-3 px-3 py-2">
                        {session.user.image ? (
                          <Image src={session.user.image} alt="" width={36} height={36} className="rounded-full" />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-[#2451F3] flex items-center justify-center text-white text-sm font-medium">
                            {session.user.name?.[0]?.toUpperCase() || "U"}
                          </div>
                        )}
                        <div>
                          <div className="text-[14px] font-medium text-white">{session.user.name}</div>
                          <div className="text-xs text-white/40">{session.user.email}</div>
                        </div>
                      </div>
                      <Link href="/profile" className="block w-full text-center border border-white/20 text-white py-2.5 rounded-lg font-medium text-[14px] hover:bg-white/5 transition-colors" onClick={() => setMobileOpen(false)}>Edit Profile</Link>
                      <button onClick={() => { signOut({ callbackUrl: "/" }); setMobileOpen(false); }} className="block w-full text-center bg-red-500/20 text-red-400 py-2.5 rounded-lg font-medium text-[14px] hover:bg-red-500/30 transition-colors">Sign Out</button>
                    </>
                  ) : (
                    <>
                      <Link href="/auth/signin" onClick={() => setMobileOpen(false)} className="block w-full text-center border border-white/20 text-white py-2.5 rounded-lg font-medium text-[14px] hover:bg-white/5 transition-colors">Log in</Link>
                      <Link href="/grants" onClick={() => setMobileOpen(false)} className="block w-full text-center bg-[#2451F3] text-white py-2.5 rounded-lg font-medium text-[14px] hover:brightness-110 transition-all">Browse Grants</Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Spacer */}
      <div style={{ height: "var(--nav-height)" }} />
    </>
  );
}
