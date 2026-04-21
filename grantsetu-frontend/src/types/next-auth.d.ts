import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    backendToken?: string;
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      onboardingCompleted?: boolean;
      isAdmin?: boolean;
      emailVerified?: boolean;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    backendToken?: string;
    onboardingCompleted?: boolean;
    isAdmin?: boolean;
    emailVerified?: boolean;
    userId?: number;
  }
}
