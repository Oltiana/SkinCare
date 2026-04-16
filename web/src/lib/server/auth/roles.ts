export type UserRole = "user" | "admin";

/** Default admin (extend with ADMIN_EMAILS in .env). */
const DEFAULT_ADMIN_EMAILS = ["loretabilalli8@gmail.com"];

export function parseAdminEmails(): Set<string> {
  return new Set(
    (process.env.ADMIN_EMAILS ?? "")
      .split(",")
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean),
  );
}

export function isAdminEmail(email: string): boolean {
  const e = email.trim().toLowerCase();
  if (DEFAULT_ADMIN_EMAILS.includes(e)) return true;
  return parseAdminEmails().has(e);
}

/** Used when a new user is created (register or OAuth). */
export function roleForNewUser(email: string): UserRole {
  return isAdminEmail(email) ? "admin" : "user";
}
