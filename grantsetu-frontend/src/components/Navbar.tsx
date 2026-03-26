"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef, useCallback } from "react";
import { useSession, signOut } from "next-auth/react";

/* ── Dropdown data ── */
const PLATFORM_ITEMS = [
  { href: "/grants", label: "Browse Grants", desc: "Search all active grant calls from 8+ agencies" },
  { href: "/alerts", label: "Email Alerts", desc: "Get matched grants delivered to your inbox" },
  { href: "/dashboard", label: "Dashboard", desc: "Track your saved grants and applications", auth: true },
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

/* ── Caret icon ── */
function CaretDown({ className }: { className?: string }) {
  return (
    <svg stroke="currentColor" fill="currentColor" strokeWidth={0} viewBox="0 0 24 24" aria-hidden="true" className={className || "w-3.5 h-3.5"}>
      <path fillRule="evenodd" d="M12.53 16.28a.75.75 0 01-1.06 0l-7.5-7.5a.75.75 0 011.06-1.06L12 14.69l6.97-6.97a.75.75 0 111.06 1.06l-7.5 7.5z" clipRule="evenodd" />
    </svg>
  );
}

/* ── Dropdown component — ChatSpark style ── */
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
        className="flex items-center gap-[2px] py-2.5 px-[2px] cursor-pointer font-medium text-[15px] leading-5 tracking-[-0.01em] text-white/80 hover:text-white transition-colors duration-150 whitespace-nowrap"
        onClick={onToggle}
        aria-expanded={open}
        type="button"
      >
        <span>{label}</span>
        <CaretDown className={`w-3.5 h-3.5 ml-0.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      <div className={`dropdown-panel ${open ? "open" : ""}`}>
        <div className="space-y-0.5">
          {items
            .filter((item) => !("auth" in item) || isAuthenticated)
            .map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-start gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors group"
                onClick={onToggle}
              >
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[14px] font-semibold text-gray-900 group-hover:text-blue-600 transition-colors block">{item.label}</span>
                  <span className="text-[12px] text-gray-400 leading-snug block mt-0.5">{item.desc}</span>
                </div>
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

  /* Close dropdowns on outside click or scroll */
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
      if (navRef.current && !navRef.current.contains(e.target as Node)) setOpenDropdown(null);
    }
    function handleScroll() { setOpenDropdown(null); }
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
      {/* ── Dark nav wrapper — ChatSpark exact: fixed, max-w-1400, dark bg, rounded ── */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[1400px] z-[9999] px-4 pt-3">
        <nav
          ref={navRef}
          className="w-full bg-[#1E293B] rounded-2xl px-5 py-3"
        >
          <div className="flex items-center justify-between gap-2">
            {/* Logo — small icon + text wordmark like ChatSpark ⚡ChatSpark */}
            <Link href="/" className="flex items-center gap-2 flex-shrink-0">
              <Image
                src="/grantsetu-logo.png"
                alt=""
                width={28}
                height={28}
                className="object-contain rounded-md"
                priority
              />
              <span className="text-white font-bold text-[18px] tracking-[-0.02em]">GrantSetu</span>
            </Link>

            {/* Desktop nav links — ChatSpark: 15px/500, 5 items, gap-8 */}
            <div className="hidden lg:flex items-center gap-8 flex-1 ml-10">
              <Link href="/grants" className="flex items-center py-2.5 px-[2px] font-medium text-[15px] text-white/80 hover:text-white transition-colors duration-150 whitespace-nowrap">
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
                <Link href="/admin" className="flex items-center py-2.5 px-[2px] font-medium text-[15px] text-white/80 hover:text-white transition-colors duration-150">
                  Admin
                </Link>
              )}
            </div>

            {/* Right — Auth CTA: ChatSpark "Log in" ghost + "Get Started Free" blue */}
            <div className="hidden lg:flex items-center gap-3 flex-shrink-0">
              {status === "loading" && (
                <div className="h-[38px] w-[120px] bg-white/10 rounded-lg animate-pulse" />
              )}
              {status === "unauthenticated" && (
                <>
                  <Link
                    href="/auth/signin"
                    className="text-[15px] font-medium text-white/70 hover:text-white transition-colors duration-150 py-2 px-3"
                  >
                    Log in
                  </Link>
                  <Link
                    href="/grants"
                    className="inline-flex items-center justify-center w-[160px] h-[38px] bg-blue-500 text-white text-[14px] font-semibold rounded-lg hover:bg-blue-600 active:bg-blue-700 transition-all duration-150"
                  >
                    Get Started Free
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
                      <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-semibold">
                        {session.user.name?.[0]?.toUpperCase() || "U"}
                      </div>
                    )}
                    <span className="text-[14px] font-medium text-white/80 max-w-[120px] truncate">
                      {session.user.name || "User"}
                    </span>
                    <CaretDown className="w-3.5 h-3.5 text-white/50" />
                  </button>
                  {menuOpen && (
                    <div className="absolute right-0 mt-2 w-52 bg-white border border-gray-100 rounded-2xl shadow-xl py-2 z-50">
                      <Link href="/dashboard" className="block px-4 py-2.5 text-[14px] text-gray-700 hover:bg-gray-50" onClick={() => setMenuOpen(false)}>Dashboard</Link>
                      <Link href="/profile" className="block px-4 py-2.5 text-[14px] text-gray-700 hover:bg-gray-50" onClick={() => setMenuOpen(false)}>Edit Profile</Link>
                      <hr className="my-1.5 border-gray-100" />
                      <button onClick={() => signOut({ callbackUrl: "/" })} className="block w-full text-left px-4 py-2.5 text-[14px] text-red-600 hover:bg-red-50">Sign Out</button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Mobile hamburger — white icon on dark */}
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

          {/* Mobile drawer — slides down inside the dark nav */}
          {mobileOpen && (
            <div className="lg:hidden border-t border-white/10 mt-3 pt-4 pb-2">
              <div className="space-y-1">
                <p className="text-xs font-semibold text-white/40 uppercase tracking-wider px-2 pb-1">Platform</p>
                {PLATFORM_ITEMS
                  .filter((item) => !("auth" in item) || isAuthenticated)
                  .map((item) => (
                    <Link key={item.href} href={item.href} className="block py-2.5 px-3 text-white/80 font-medium rounded-lg hover:bg-white/10 transition-colors text-[15px]" onClick={() => setMobileOpen(false)}>
                      {item.label}
                      <span className="block text-xs text-white/40 font-normal mt-0.5">{item.desc}</span>
                    </Link>
                  ))}

                <p className="text-xs font-semibold text-white/40 uppercase tracking-wider px-2 pt-3 pb-1">Agencies</p>
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

                <div className="pt-4 flex flex-col gap-2.5">
                  {isAuthenticated ? (
                    <>
                      <div className="flex items-center gap-3 px-3 py-2">
                        {session.user.image ? (
                          <Image src={session.user.image} alt="" width={36} height={36} className="rounded-full" />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-semibold">
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
                      <Link href="/grants" onClick={() => setMobileOpen(false)} className="block w-full text-center bg-blue-500 text-white py-2.5 rounded-lg font-semibold text-[14px] hover:bg-blue-600 transition-colors">Get Started Free</Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </nav>
      </div>

      {/* Spacer — accounts for fixed nav + padding */}
      <div style={{ height: "calc(var(--nav-height) + 12px)" }} />
    </>
  );
}
