/**
 * Open /dashboard without login — development ONLY.
 *
 * Set in .env.local (restart `npm run dev` after changing):
 *   DEV_OPEN_DASHBOARD=true
 *
 * If middleware still redirects, use (Edge reads this reliably in dev):
 *   NEXT_PUBLIC_DEV_OPEN_DASHBOARD=true
 *
 * Remove both before production.
 */
function envFlag(name: string): boolean {
  const v = process.env[name];
  if (v == null || v === "") return false;
  return ["true", "1", "yes"].includes(v.trim().toLowerCase());
}

export function isDevDashboardOpen(): boolean {
  if (process.env.NODE_ENV !== "development") return false;
  return envFlag("DEV_OPEN_DASHBOARD") || envFlag("NEXT_PUBLIC_DEV_OPEN_DASHBOARD");
}
