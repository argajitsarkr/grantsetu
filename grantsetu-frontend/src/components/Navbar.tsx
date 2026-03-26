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

/* ── Caret icon ── */
function CaretDown({ className }: { className?: string }) {
  return (
    <svg
      stroke="currentColor"
      fill="currentColor"
      strokeWidth={0}
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className || "w-3.5 h-3.5"}
    >
      <path
        fillRule="evenodd"
        d="M12.53 16.28a.75.75 0 01-1.06 0l-7.5-7.5a.75.75 0 011.06-1.06L12 14.69l6.97-6.97a.75.75 0 111.06 1.06l-7.5 7.5z"
        clipRule="evenodd"
      />
    </svg>
  );
}

/* ── Dropdown component ── */
function NavDropdown({
  label,
  items,
  open,
  onToggle,
  isAuthenticated,
}: {
  label: string;
  items: typeof PLATFORM_ITEMS;
  open: boolean;
  onToggle: () => void;
  isAuthenticated: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div className="relative" ref={ref}>
      <button
        className="nav-link-cs"
        onClick={onToggle}
        aria-expanded={open}
        type="button"
      >
        <span>{label}</span>
        <CaretDown className={`w-3.5 h-3.5 ml-0.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>

      <div
        className={`dropdown-panel ${open ? "open" : ""}`}
        style={{ minWidth: 320 }}
      >
        {items
          .filter((item) => !("auth" in item) || isAuthenticated)
          .map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col gap-0.5 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors group"
              onClick={onToggle}
            >
              <span className="text-[14px] font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                {item.label}
              </span>
              <span className="text-[13px] text-gray-500 leading-snug">{item.desc}</span>
            </Link>
          ))}
      </div>
    </div>
  );
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const { data: session, status } = useSession();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Close dropdowns on outside click */
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const isAuthenticated = status === "authenticated" && !!session?.user;

  const toggleDropdown = useCallback((name: string) => {
    setOpenDropdown((prev) => (prev === name ? null : name));
  }, []);

  return (
    <>
      <nav
        ref={navRef}
        className={`fixed left-0 right-0 top-0 z-50 bg-white transition-shadow duration-300 ${
          scrolled ? "shadow-[0_1px_3px_rgba(0,0,0,0.08)]" : ""
        }`}
        style={{ height: "var(--nav-height)" }}
      >
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 h-full">
          <div className="flex items-center justify-between h-full gap-2">

            {/* Logo */}
            <Link href="/" className="flex items-center flex-shrink-0" style={{ minWidth: 128, height: 32 }}>
              <Image
                src="/grantsetu-logo.png"
                alt="GrantSetu"
                width={128}
                height={32}
                className="object-contain"
                priority
              />
            </Link>

            {/* Desktop nav links — ChatSpark style with dropdowns */}
            <div className="hidden lg:flex items-center gap-8 flex-1 ml-10">
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
              <Link href="/grants" className="nav-link-cs">
                <span>Grants</span>
              </Link>
              <Link href="/alerts" className="nav-link-cs">
                <span>Alerts</span>
              </Link>
              {isAuthenticated && session.user.isAdmin && (
                <Link href="/admin" className="nav-link-cs">
                  <span>Admin</span>
                </Link>
              )}
            </div>

            {/* Right — Auth CTA */}
            <div className="hidden lg:flex items-center gap-3 flex-shrink-0">
              {status === "loading" && (
                <div className="h-[38px] w-[120px] bg-gray-100 rounded-lg animate-pulse" />
              )}
              {status === "unauthenticated" && (
                <>
                  <Link
                    href="/auth/signin"
                    className="text-[15px] font-medium text-gray-800 hover:text-gray-900 transition-colors duration-150 py-2.5 px-3"
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
                    className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    {session.user.image ? (
                      <Image
                        src={session.user.image}
                        alt=""
                        width={32}
                        height={32}
                        className="rounded-full"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-semibold">
                        {session.user.name?.[0]?.toUpperCase() || "U"}
                      </div>
                    )}
                    <span className="text-[15px] font-medium text-gray-700 max-w-[120px] truncate">
                      {session.user.name || "User"}
                    </span>
                    <CaretDown className="w-3.5 h-3.5 text-gray-400" />
                  </button>

                  {menuOpen && (
                    <div className="absolute right-0 mt-2 w-52 bg-white border border-gray-100 rounded-2xl shadow-xl py-2 z-50">
                      <Link
                        href="/dashboard"
                        className="block px-4 py-2.5 text-[14px] text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setMenuOpen(false)}
                      >
                        Dashboard
                      </Link>
                      <Link
                        href="/profile"
                        className="block px-4 py-2.5 text-[14px] text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setMenuOpen(false)}
                      >
                        Edit Profile
                      </Link>
                      <hr className="my-1.5 border-gray-100" />
                      <button
                        onClick={() => signOut({ callbackUrl: "/" })}
                        className="block w-full text-left px-4 py-2.5 text-[14px] text-red-600 hover:bg-red-50 transition-colors"
                      >
                        Sign Out
                      </button>
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
              <svg className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                }
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile drawer */}
        {mobileOpen && (
          <div className="lg:hidden bg-white border-t border-gray-100 shadow-lg max-h-[80vh] overflow-y-auto">
            <div className="px-5 py-5 space-y-1">
              {/* Platform section */}
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 pt-2 pb-1">Platform</p>
              {PLATFORM_ITEMS
                .filter((item) => !("auth" in item) || isAuthenticated)
                .map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block py-2.5 px-3 text-gray-800 font-medium rounded-lg hover:bg-gray-50 transition-colors text-[15px]"
                    onClick={() => setMobileOpen(false)}
                  >
                    {item.label}
                    <span className="block text-xs text-gray-400 font-normal mt-0.5">{item.desc}</span>
                  </Link>
                ))}

              {/* Agencies section */}
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 pt-4 pb-1">Agencies</p>
              <div className="grid grid-cols-2 gap-1 px-1">
                {AGENCIES_ITEMS.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="py-2 px-2 text-[14px] text-gray-800 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                    onClick={() => setMobileOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>

              {isAuthenticated && session.user.isAdmin && (
                <>
                  <hr className="my-2 border-gray-100" />
                  <Link
                    href="/admin"
                    className="block py-2.5 px-3 text-gray-800 font-medium rounded-lg hover:bg-gray-50 transition-colors text-[15px]"
                    onClick={() => setMobileOpen(false)}
                  >
                    Admin
                  </Link>
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
                        <div className="text-[14px] font-medium text-gray-900">{session.user.name}</div>
                        <div className="text-xs text-gray-400">{session.user.email}</div>
                      </div>
                    </div>
                    <Link
                      href="/profile"
                      className="block w-full text-center border border-gray-200 text-gray-900 py-2.5 rounded-lg font-medium text-[14px] hover:bg-gray-50 transition-colors"
                      onClick={() => setMobileOpen(false)}
                    >
                      Edit Profile
                    </Link>
                    <button
                      onClick={() => { signOut({ callbackUrl: "/" }); setMobileOpen(false); }}
                      className="block w-full text-center bg-red-50 text-red-600 py-2.5 rounded-lg font-medium text-[14px] hover:bg-red-100 transition-colors"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/auth/signin" onClick={() => setMobileOpen(false)}
                      className="block w-full text-center border border-gray-200 text-gray-900 py-2.5 rounded-lg font-medium text-[14px] hover:bg-gray-50 transition-colors">
                      Log in
                    </Link>
                    <Link href="/grants" onClick={() => setMobileOpen(false)}
                      className="block w-full text-center bg-blue-500 text-white py-2.5 rounded-lg font-semibold text-[14px] hover:bg-blue-600 transition-colors">
                      Get Started Free
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Spacer */}
      <div style={{ height: "var(--nav-height)" }} />
    </>
  );
}
