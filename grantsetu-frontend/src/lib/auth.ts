import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { SignJWT } from "jose";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

function getSecret() {
  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret) throw new Error("NEXTAUTH_SECRET is not set");
  return new TextEncoder().encode(secret);
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    async jwt({ token, account, profile }) {
      // On initial sign-in, sync user to backend and generate backend token
      if (account && profile) {
        try {
          // Sync user to backend
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

        // Generate a signed JWT for backend API calls
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
