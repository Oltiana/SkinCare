import { type NextRequest, NextResponse } from "next/server";
import {
  getFacebookOAuthCredentials,
  getGoogleOAuthCredentials,
} from "@/lib/server/oauth-env";

function originFromRequest(request: NextRequest): string | null {
  const host =
    request.headers.get("x-forwarded-host")?.split(",")[0]?.trim() ||
    request.headers.get("host");
  if (!host) return null;
  const protoHeader = request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim();
  let proto = protoHeader;
  if (!proto) {
    try {
      proto = new URL(request.url).protocol.replace(":", "");
    } catch {
      proto = "http";
    }
  }
  return `${proto}://${host}`;
}

function normalizeBase(url: string): string {
  return url.trim().replace(/\/+$/, "");
}

/**
 * Open in browser: /api/auth/oauth-status
 * Shows whether the server sees OAuth keys (without exposing secrets).
 * Includes callback URLs for this request’s host (correct port).
 */
export async function GET(request: NextRequest) {
  const google = getGoogleOAuthCredentials();
  const facebook = getFacebookOAuthCredentials();
  const origin = originFromRequest(request);

  const authUrlEnvRaw = process.env.AUTH_URL?.trim() || null;
  const authUrlEnv = authUrlEnvRaw ? normalizeBase(authUrlEnvRaw) : null;

  let authUrlMatchesRequestOrigin: boolean | null = null;
  let authUrlHint: string | null = null;
  if (origin && authUrlEnv) {
    authUrlMatchesRequestOrigin = normalizeBase(origin) === authUrlEnv;
    if (!authUrlMatchesRequestOrigin) {
      authUrlHint = `AUTH_URL in .env.local is "${authUrlEnvRaw}" but the app is opened from "${origin}". Set AUTH_URL to match the origin (or remove AUTH_URL in dev), then restart npm run dev.`;
    }
  } else if (authUrlEnv && !origin) {
    authUrlHint = "Could not read Host — set AUTH_URL in dev if you see CSRF errors.";
  }

  const googleCallback = origin ? `${origin}/api/auth/callback/google` : null;
  const facebookCallback = origin ? `${origin}/api/auth/callback/facebook` : null;

  return NextResponse.json({
    google: {
      ok: google !== null,
      hint: google
        ? "Google OAuth is enabled on the server."
        : "Missing AUTH_GOOGLE_ID or AUTH_GOOGLE_SECRET (or GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET).",
    },
    facebook: {
      ok: facebook !== null,
      hint: facebook
        ? "Facebook OAuth is enabled on the server."
        : "Missing AUTH_FACEBOOK_ID or AUTH_FACEBOOK_SECRET (or FACEBOOK_CLIENT_ID / FACEBOOK_CLIENT_SECRET).",
    },
    requestOrigin: origin,
    callbackUrls: {
      google: googleCallback,
      facebook: facebookCallback,
    },
    authUrl: {
      set: Boolean(authUrlEnvRaw),
      value: authUrlEnvRaw,
      matchesRequestOrigin: authUrlMatchesRequestOrigin,
      hint: authUrlHint,
    },
    redirectUrisToAddInConsoles: {
      google:
        googleCallback ??
        "http://localhost:3000/api/auth/callback/google  (open /login from your port and copy the callback URL)",
      facebook:
        facebookCallback ??
        "http://localhost:3000/api/auth/callback/facebook",
    },
  });
}
