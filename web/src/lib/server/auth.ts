import NextAuth, { type NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Facebook from "next-auth/providers/facebook";
import Google from "next-auth/providers/google";
import { compare } from "bcryptjs";
import type { UserRole } from "@/lib/server/auth/roles";
import { isAdminEmail, roleForNewUser } from "@/lib/server/auth/roles";
import {
  getFacebookOAuthCredentials,
  getGoogleOAuthCredentials,
} from "@/lib/server/oauth-env";

const providers: NextAuthConfig["providers"] = [
  Credentials({
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
      const emailRaw = credentials?.email;
      const passwordRaw = credentials?.password;

      const email =
        typeof emailRaw === "string" ? emailRaw.trim().toLowerCase() : "";
      const password = typeof passwordRaw === "string" ? passwordRaw : "";

      if (!email || !password) return null;

      const { connectDb } = await import("@/lib/server/db");
      const { User } = await import("@/lib/server/models/User");

      await connectDb();

      const user = await User.findOne({ email });
      if (!user?.password) return null;

      const valid = await compare(password, user.password);
      if (!valid) return null;

      let role: UserRole = (user.role as UserRole) ?? "user";

      if (isAdminEmail(user.email)) {
        role = "admin";
        if (user.role !== "admin") {
          user.role = "admin";
          await user.save();
        }
      }

      return {
        id: user._id.toString(),
        email: user.email,
        name: user.name || undefined,
        role,
      };
    },
  }),
];

// OAuth providers
const googleCreds = getGoogleOAuthCredentials();
if (googleCreds) {
  providers.push(
    Google({
      clientId: googleCreds.id,
      clientSecret: googleCreds.secret,
      allowDangerousEmailAccountLinking: true,
    }),
  );
}

const facebookCreds = getFacebookOAuthCredentials();
if (facebookCreds) {
  providers.push(
    Facebook({
      clientId: facebookCreds.id,
      clientSecret: facebookCreds.secret,
      allowDangerousEmailAccountLinking: true,
      client: { token_endpoint_auth_method: "client_secret_post" },
    }),
  );
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  pages: {
    signIn: "/login",
  },

  providers,

  callbacks: {
    async jwt({ token, user, account }) {
      // 🟢 LOGIN (first time)
      if (user) {
        token.id = (user as any).id;
        token.sub = (user as any).id;
        token.email = (user as any).email;
        token.role = (user as any).role ?? "user";
      }

      // 🟢 OAuth users DB sync
      if (account && account.provider !== "credentials") {
        const email = (token.email as string)?.toLowerCase().trim();

        if (!email) return token;

        const { connectDb } = await import("@/lib/server/db");
        const { User } = await import("@/lib/server/models/User");

        await connectDb();

        let dbUser = await User.findOne({ email });

        if (!dbUser) {
          dbUser = await User.create({
            email,
            name: (token.name ?? "").slice(0, 200),
            role: roleForNewUser(email),
          });
        }

        token.id = dbUser._id.toString();
        token.sub = dbUser._id.toString();
        token.email = dbUser.email;
        token.role =
          isAdminEmail(dbUser.email) || dbUser.role === "admin"
            ? "admin"
            : "user";
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = (token.id as string) || (token.sub as string) || "";
        session.user.email = (token.email as string) || session.user.email;
        session.user.role = (token.role as UserRole) || "user";
      }

      return session;
    },
  },
});
