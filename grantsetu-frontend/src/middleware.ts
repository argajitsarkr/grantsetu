import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { nextUrl } = req;
  const isAuthenticated = !!req.auth;
  const path = nextUrl.pathname;

  const protectedPaths = ["/dashboard", "/profile", "/onboarding", "/admin"];
  const isProtected = protectedPaths.some((p) => path.startsWith(p));
  const isAdminPath = path.startsWith("/admin");

  if (isProtected && !isAuthenticated) {
    const signinUrl = new URL("/auth/signin", nextUrl);
    signinUrl.searchParams.set("callbackUrl", path);
    return NextResponse.redirect(signinUrl);
  }

  if (isAdminPath && isAuthenticated && !req.auth?.user?.isAdmin) {
    return NextResponse.redirect(new URL("/dashboard", nextUrl));
  }

  if (isAuthenticated && req.auth?.user) {
    // Soft onboarding: new users land on /dashboard with a yellow
    // "complete your profile" nudge instead of being force-redirected.
    // Only the inverse still applies - completed users hitting /onboarding
    // get bounced back to /dashboard.
    if (req.auth.user.onboardingCompleted && path.startsWith("/onboarding")) {
      return NextResponse.redirect(new URL("/dashboard", nextUrl));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*", "/onboarding/:path*", "/admin/:path*"],
};
