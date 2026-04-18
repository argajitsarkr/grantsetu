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
    const onboardingCompleted = req.auth.user.onboardingCompleted;

    // Admins skip onboarding redirect — they may not need a research profile.
    const skipOnboarding = req.auth.user.isAdmin || isAdminPath;

    if (
      !onboardingCompleted &&
      !skipOnboarding &&
      !path.startsWith("/onboarding") &&
      isProtected
    ) {
      return NextResponse.redirect(new URL("/onboarding", nextUrl));
    }

    if (onboardingCompleted && path.startsWith("/onboarding")) {
      return NextResponse.redirect(new URL("/dashboard", nextUrl));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*", "/onboarding/:path*", "/admin/:path*"],
};
