import { auth } from "@/auth";
import type { UserRole } from "@/lib/server/auth/roles";

const authRoutes = ["/login", "/register", "/forgot-password", "/reset-password"];

function userRole(authUser: { role?: UserRole } | undefined): UserRole {
  return authUser?.role ?? "user";
}

function hasValidSessionUser(
  auth: { user?: { email?: string | null; id?: string } } | null,
): boolean {
  const u = auth?.user;
  if (!u) return false;
  const email = typeof u.email === "string" ? u.email.trim() : "";
  const id = typeof u.id === "string" ? u.id.trim() : "";
  return Boolean(email || id);
}

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isAuthed = hasValidSessionUser(req.auth);
  const role = userRole(req.auth?.user);
  const isAuthRoute = authRoutes.some((p) => pathname === p);

  if (isAuthRoute && isAuthed) {
    return Response.redirect(new URL("/post-login", req.url));
  }

  /**
   * Routes that require sign-in (any role): profile, shopping (products/cart), post-login.
   * Guests cannot browse products or cart — must log in first.
   */
  const userOnlyPrefixes = ["/profile", "/post-login", "/products", "/cart"];
  const needsUser = userOnlyPrefixes.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );
  if (needsUser && !isAuthed) {
    const login = new URL("/login", req.url);
    const returnTo = `${req.nextUrl.pathname}${req.nextUrl.search}`;
    login.searchParams.set("callbackUrl", returnTo.startsWith("/") ? returnTo : "/");
    return Response.redirect(login);
  }

  /** Admin only */
  const isAdminPath =
    pathname === "/admin" ||
    pathname.startsWith("/admin/") ||
    pathname === "/dashboard" ||
    pathname.startsWith("/dashboard/");
  if (isAdminPath) {
    if (!isAuthed) {
      const login = new URL("/login", req.url);
      login.searchParams.set("callbackUrl", pathname);
      return Response.redirect(login);
    }
    if (role !== "admin") {
      return Response.redirect(new URL("/?forbidden=1", req.url));
    }
  }

  return undefined;
});

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
