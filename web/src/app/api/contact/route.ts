import { NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().trim().min(2, "Name is required"),
  email: z.string().trim().email("Please enter a valid email"),
  subject: z.string().trim().min(3, "Subject is required"),
  message: z.string().trim().min(10, "Message must be at least 10 characters"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = contactSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid contact form data." },
        { status: 400 },
      );
    }

    const { name, email, subject, message } = parsed.data;

    if (process.env.RESEND_API_KEY?.trim()) {
      try {
        const resend = new Resend(process.env.RESEND_API_KEY);
        await resend.emails.send({
          from: process.env.EMAIL_FROM || "SkinCare <onboarding@resend.dev>",
          to: ["support@skincare.com"],
          replyTo: email,
          subject: `SkinCare contact: ${subject}`,
          html: `
            <h2>New contact message</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Message:</strong><br />${message.replace(/\n/g, "<br />")}</p>
          `,
        });
      } catch (emailError) {
        console.error("[contact] Email send failed:", emailError);
        return NextResponse.json(
          { ok: false, error: "The message was not sent. Please try again later." },
          { status: 500 },
        );
      }
    } else {
      console.info("[contact] RESEND_API_KEY not set; message accepted in dev mode.", {
        name,
        email,
        subject,
      });
    }

    return NextResponse.json({
      ok: true,
      message: "Thank you for contacting SkinCare. We will reach out soon.",
    });
  } catch (error) {
    console.error("[contact] Unexpected error:", error);
    return NextResponse.json(
      { ok: false, error: "Unexpected error while submitting the contact form." },
      { status: 500 },
    );
  }
}
