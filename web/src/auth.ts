import NextAuth, { type NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import type { UserRole } from "@/lib/server/auth/roles";
import { isAdminEmail } from "@/lib/server/auth/roles";

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
      if (!email || !password) {
        return null;
      }
      const { connectDb } = await import("@/lib/server/db");
      const { User } = await import("@/lib/server/models/User");
      await connectDb();
      const user = await User.findOne({ email });
      if (!user?.password) {
        return null;
      }
      const valid = await compare(password, user.password);
      if (!valid) {
        return null;
      }
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

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 },
  pages: { signIn: "/login" },
  providers,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const u = user as { id?: string; email?: string | null; role?: UserRole };
        token.sub = u.id;
        token.id = u.id;
        token.email = u.email ?? undefined;
        token.role = u.role ?? "user";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = (token.id as string) ?? token.sub ?? "";
        session.user.email = (token.email as string) ?? session.user.email ?? "";
        session.user.role = (token.role as UserRole) ?? "user";
      }
      return session;
    },
  },
});
