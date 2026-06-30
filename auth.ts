import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { verifyCredentials, upsertOAuthUser } from "@/lib/users";

// Google is only registered when credentials are present, so the app runs fine
// before the user sets up OAuth (they can still use email/password).
const googleEnabled = !!(process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET);

export const { handlers, auth, signIn, signOut } = NextAuth({
  // JWT sessions — no database adapter needed; the user store only tracks scans.
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [
    ...(googleEnabled ? [Google] : []),
    Credentials({
      name: "Email and password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(creds) {
        const email = typeof creds?.email === "string" ? creds.email : "";
        const password = typeof creds?.password === "string" ? creds.password : "";
        if (!email || !password) return null;
        const user = await verifyCredentials(email, password);
        if (!user) return null;
        return { id: user.id, email: user.email, name: user.name ?? undefined };
      },
    }),
  ],
  callbacks: {
    // Persist Google users into the local store on first sign-in so their scan
    // quota can be tracked just like password accounts.
    async signIn({ user, account }) {
      if (account?.provider === "google" && user.email) {
        await upsertOAuthUser({ email: user.email, name: user.name ?? null });
      }
      return true;
    },
  },
});

/** Exposed so UI can conditionally render the Google button. */
export const isGoogleEnabled = googleEnabled;
