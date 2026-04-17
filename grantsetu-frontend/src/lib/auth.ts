import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { SignJWT } from "jose";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

function getSecret() {
  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret) throw new Error("NEXTAUTH_SECRET is not set");
  return new TextEncoder().encode(secret);
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Credentials({
      name: "Email & Password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        try {
          const res = await fetch(`${API_URL}/api/v1/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });
          if (!res.ok) return null;
          const data = await res.json();
          return {
            id: String(data.user.id),
            email: data.user.email,
            name: data.user.name,
            image: data.user.image_url ?? null,
            backendToken: data.access_token,
            onboardingCompleted: data.user.onboarding_completed,
            isAdmin: data.user.is_admin,
          } as unknown as { id: string };
        } catch (err) {
          console.error("Credentials authorize failed:", err);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    async jwt({ token, account, profile, user }) {
      // Credentials path: the authorize() callback returned a user with an
      // already-signed backend token and DB-derived flags.
      if (account?.provider === "credentials" && user) {
        const u = user as unknown as {
          backendToken?: string;
          onboardingCompleted?: boolean;
          isAdmin?: boolean;
          id?: string;
        };
        if (u.backendToken) token.backendToken = u.backendToken;
        token.onboardingCompleted = u.onboardingCompleted ?? false;
        token.isAdmin = u.isAdmin ?? false;
        if (u.id) token.userId = u.id;
        return token;
      }

      // Google OAuth path: sync with backend + mint our own backend JWT.
      if (account && profile) {
        try {
          const syncRes = await fetch(`${API_URL}/api/v1/users/sync`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: profile.name || token.name || "User",
              email: profile.email || token.email,
              image_url: profile.picture || token.picture,
              auth_provider: account.provider,
            }),
          });

          if (syncRes.ok) {
            const userData = await syncRes.json();
            token.userId = userData.id;
            token.onboardingCompleted = userData.onboarding_completed;
            token.isAdmin = userData.is_admin;
          }
        } catch (err) {
          console.error("Failed to sync user to backend:", err);
        }

        try {
          const backendToken = await new SignJWT({
            email: profile.email || token.email,
            name: profile.name || token.name,
            sub: token.sub,
          })
            .setProtectedHeader({ alg: "HS256" })
            .setIssuedAt()
            .setExpirationTime("30d")
            .sign(getSecret());

          token.backendToken = backendToken;
        } catch (err) {
          console.error("Failed to generate backend token:", err);
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (token.backendToken) {
        session.backendToken = token.backendToken;
      }
      if (session.user) {
        session.user.onboardingCompleted = token.onboardingCompleted ?? false;
        session.user.isAdmin = token.isAdmin ?? false;
        if (token.sub) {
          session.user.id = token.sub;
        }
      }
      return session;
    },
  },
});
