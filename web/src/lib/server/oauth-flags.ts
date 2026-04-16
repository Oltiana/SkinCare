import type { OauthAvailability } from "@/types/oauth-availability";
import { getFacebookOAuthCredentials, getGoogleOAuthCredentials } from "@/lib/server/oauth-env";

/** Server Components only (reads env without exposing it to the client). */
export function getOauthProviderFlags(): OauthAvailability {
  return {
    google: getGoogleOAuthCredentials() !== null,
    facebook: getFacebookOAuthCredentials() !== null,
  };
}
