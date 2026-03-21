"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { data: session, status } = useSession();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close user menu on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const isAuthenticated = status === "authenticated" && session?.user;

  return (
    <>
      {/* Fixed nav — transparent → white on scroll (Topmate exact) */}
      <nav
        className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-white shadow-nav-scrolled" : "bg-white/95 shadow-nav"
        }`}
        style={{ height: "var(--nav-height)" }}
      >
        <div className="container-main h-full">
          <div className="flex items-center justify-between h-full">

            {/* Logo */}
            <Link href="/" className="flex items-center flex-shrink-0">
              <Image
                src="/grantsetu-logo.png"
                alt="GrantSetu"
                width={36}
                height={36}
                className="object-contain"
                priority
              />
            </Link>

            {/* Centre pill nav — Topmate exact */}
            <div className="hidden md:flex items-center border border-brand-200/80 rounded-pill px-1 py-1 gap-0.5">
              <Link href="/grants" className="nav-link">Grants</Link>
              {isAuthenticated && (
                <Link href="/dashboard" className="nav-link">Dashboard</Link>
              )}
              <Link href="/alerts" className="nav-link">Alerts</Link>
              {isAuthenticated && session.user.isAdmin && (
                <Link href="/admin" className="nav-link">Admin</Link>
              )}
            </div>

            {/* Right — Auth state */}
            <div className="hidden md:flex items-center gap-2">
              {status === "loading" && (
                <div className="h-8 w-20 bg-brand-100 rounded-lg animate-pulse" />
              )}
              {status === "unauthenticated" && (
                <>
                  <Link href="/auth/signin" className="nav-btn-login">Sign In</Link>
                  <Link href="/grants" className="nav-btn-cta">Browse Grants</Link>
                </>
              )}
              {isAuthenticated && (
                <div className="relative" ref={menuRef}>
                  <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-brand-50 transition-colors"
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
                      <div className="w-8 h-8 rounded-full bg-accent-500 flex items-center justify-center text-white text-sm font-semibold">
                        {session.user.name?.[0]?.toUpperCase() || "U"}
                      </div>
                    )}
                    <span className="text-sm font-medium text-brand-700 max-w-[120px] truncate">
                      {session.user.name || "User"}
                    </span>
                    <svg className="h-4 w-4 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {menuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-brand-200 rounded-xl shadow-lg py-1 z-50">
                      <Link
                        href="/dashboard"
                        className="block px-4 py-2 text-sm text-brand-700 hover:bg-brand-50"
                        onClick={() => setMenuOpen(false)}
                      >
                        Dashboard
                      </Link>
                      <Link
                        href="/profile"
                        className="block px-4 py-2 text-sm text-brand-700 hover:bg-brand-50"
                        onClick={() => setMenuOpen(false)}
                      >
                        Edit Profile
                      </Link>
                      <hr className="my-1 border-brand-100" />
                      <button
                        onClick={() => signOut({ callbackUrl: "/" })}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
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
              className="md:hidden p-2 rounded-lg hover:bg-brand-100 transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              <svg className="h-5 w-5 text-brand-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
          <div className="md:hidden bg-white border-t border-brand-100 shadow-lg">
            <div className="px-4 py-4 space-y-1">
              <Link
                href="/grants"
                className="block py-2.5 px-3 text-brand-700 font-medium rounded-lg hover:bg-brand-50 transition-colors text-sm"
                onClick={() => setMobileOpen(false)}
              >
                Grants
              </Link>
              {isAuthenticated && (
                <Link
                  href="/dashboard"
                  className="block py-2.5 px-3 text-brand-700 font-medium rounded-lg hover:bg-brand-50 transition-colors text-sm"
                  onClick={() => setMobileOpen(false)}
                >
                  Dashboard
                </Link>
              )}
              <Link
                href="/alerts"
                className="block py-2.5 px-3 text-brand-700 font-medium rounded-lg hover:bg-brand-50 transition-colors text-sm"
                onClick={() => setMobileOpen(false)}
              >
                Alerts
              </Link>
              {isAuthenticated && session.user.isAdmin && (
                <Link
                  href="/admin"
                  className="block py-2.5 px-3 text-brand-700 font-medium rounded-lg hover:bg-brand-50 transition-colors text-sm"
                  onClick={() => setMobileOpen(false)}
                >
                  Admin
                </Link>
              )}

              <div className="pt-3 flex flex-col gap-2">
                {isAuthenticated ? (
                  <>
                    <div className="flex items-center gap-3 px-3 py-2">
                      {session.user.image ? (
                        <Image src={session.user.image} alt="" width={36} height={36} className="rounded-full" />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-accent-500 flex items-center justify-center text-white text-sm font-semibold">
                          {session.user.name?.[0]?.toUpperCase() || "U"}
                        </div>
                      )}
                      <div>
                        <div className="text-sm font-medium text-brand-900">{session.user.name}</div>
                        <div className="text-xs text-brand-400">{session.user.email}</div>
                      </div>
                    </div>
                    <Link
                      href="/profile"
                      className="block w-full text-center border border-brand-200 text-brand-900 py-2.5 rounded-xl font-medium text-sm hover:bg-brand-50 transition-colors"
                      onClick={() => setMobileOpen(false)}
                    >
                      Edit Profile
                    </Link>
                    <button
                      onClick={() => { signOut({ callbackUrl: "/" }); setMobileOpen(false); }}
                      className="block w-full text-center bg-red-50 text-red-600 py-2.5 rounded-xl font-medium text-sm hover:bg-red-100 transition-colors"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/auth/signin" onClick={() => setMobileOpen(false)}
                      className="block w-full text-center border border-brand-200 text-brand-900 py-2.5 rounded-xl font-medium text-sm hover:bg-brand-50 transition-colors">
                      Sign In
                    </Link>
                    <Link href="/grants" onClick={() => setMobileOpen(false)}
                      className="block w-full text-center bg-brand-900 text-white py-2.5 rounded-xl font-semibold text-sm hover:bg-brand-800 transition-colors">
                      Browse Grants
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Spacer — prevents content hiding behind fixed nav */}
      <div style={{ height: "var(--nav-height)" }} />
    </>
  );
}
