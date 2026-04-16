import { AuthUnifiedCard } from "@/components/client/auth-unified-card";
import { getOauthProviderFlags } from "@/lib/server/oauth-flags";

export default function LoginPage() {
  const oauth = getOauthProviderFlags();

  return <AuthUnifiedCard oauth={oauth} />;
}
