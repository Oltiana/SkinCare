import { createHash, randomBytes, randomInt } from "node:crypto";

export function generateRawResetToken(): string {
  return randomBytes(32).toString("hex");
}

/** 6-digit code for password reset (email OTP). */
export function generateResetCode(): string {
  return randomInt(0, 1_000_000).toString().padStart(6, "0");
}

export function hashResetToken(raw: string): string {
  return createHash("sha256").update(raw).digest("hex");
}
