import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { nextUrl } = req;
  const isAuthenticated = !!req.auth;
  const path = nextUrl.pathname;

  // Protected routes require authentication
  const protectedPaths = ["/dashboard", "/profile", "/onboarding"];
  const isProtected = protectedPaths.some((p) => path.startsWith(p));

  if (isProtected && !isAuthenticated) {
    return NextResponse.redirect(new URL("/auth/signin", nextUrl));
  }

  // Redirect to onboarding if not completed
  if (isAuthenticated && req.auth?.user) {
    const onboardingCompleted = req.auth.user.onboardingCompleted;

    // If on a protected route (not onboarding) and onboarding not done → redirect
    if (!onboardingCompleted && !path.startsWith("/onboarding") && isProtected) {
      return NextResponse.redirect(new URL("/onboarding", nextUrl));
    }

    // If onboarding is done and user is on /onboarding → redirect to dashboard
    if (onboardingCompleted && path.startsWith("/onboarding")) {
      return NextResponse.redirect(new URL("/dashboard", nextUrl));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*", "/onboarding/:path*"],
};
