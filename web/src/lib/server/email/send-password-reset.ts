import { Resend } from "resend";
import { getPublicAppName } from "@/lib/server/config";

function isEmailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY?.trim());
}

export function canSendPasswordResetEmail(): boolean {
  return isEmailConfigured();
}

export async function sendPasswordResetCodeEmail(
  to: string,
  code: string,
): Promise<{ sent: boolean; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    return { sent: false, error: "RESEND_API_KEY is not set" };
  }

  const from =
    process.env.EMAIL_FROM?.trim() || "SkinCare <onboarding@resend.dev>";
  const appName = getPublicAppName();

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from,
    to,
    subject: `${appName} — your password reset code`,
    html: `
      <div style="font-family:system-ui,sans-serif;max-width:480px;margin:0 auto;color:#1c1917">
        <h1 style="font-size:1.25rem;font-weight:600">Password reset code</h1>
        <p style="line-height:1.6;color:#57534e">
          Use this code on the reset password page for your ${appName} account.
          It expires in 15 minutes.
        </p>
        <p style="margin:28px 0;font-size:2rem;font-weight:700;letter-spacing:0.35em;text-align:center;color:#8B7355">
          ${code}
        </p>
        <p style="font-size:0.875rem;color:#a8a29e">
          If you did not request this, you can ignore this email.
        </p>
      </div>
    `,
  });

  if (error) {
    console.error("[email] password reset code failed:", error);
    return { sent: false, error: error.message };
  }

  return { sent: true };
}
