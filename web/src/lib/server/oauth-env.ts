/**
 * Reads OAuth keys from env. Accepts quoted values in .env.
 */

function trimEnv(v: string | undefined): string {
  if (!v) return "";
  let t = v.trim();
  if (
    (t.startsWith('"') && t.endsWith('"')) ||
    (t.startsWith("'") && t.endsWith("'"))
  ) {
    t = t.slice(1, -1).trim();
  }
  return t;
}

export function getGoogleOAuthCredentials(): { id: string; secret: string } | null {
  const id = trimEnv(
    process.env.AUTH_GOOGLE_ID || process.env.GOOGLE_CLIENT_ID,
  );
  const secret = trimEnv(
    process.env.AUTH_GOOGLE_SECRET || process.env.GOOGLE_CLIENT_SECRET,
  );
  if (!id || !secret) return null;
  return { id, secret };
}

export function getFacebookOAuthCredentials(): { id: string; secret: string } | null {
  const id = trimEnv(
    process.env.AUTH_FACEBOOK_ID || process.env.FACEBOOK_CLIENT_ID,
  );
  const secret = trimEnv(
    process.env.AUTH_FACEBOOK_SECRET || process.env.FACEBOOK_CLIENT_SECRET,
  );
  if (!id || !secret) return null;
  return { id, secret };
}
