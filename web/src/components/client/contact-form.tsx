"use client";

import { useState } from "react";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    const form = new FormData(event.currentTarget);
    const payload = {
      name: String(form.get("name") || "").trim(),
      email: String(form.get("email") || "").trim(),
      subject: String(form.get("subject") || "").trim(),
      message: String(form.get("message") || "").trim(),
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok || data.ok === false) {
        throw new Error(data.error || "Your message could not be sent.");
      }

      setStatus("success");
      setMessage(data.message || "Thank you! Your message has been received.");
      event.currentTarget.reset();
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Something went wrong.");
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5 rounded-3xl border border-[#ebe6de] bg-white p-6 shadow-sm">
      <div className="grid gap-5 md:grid-cols-2">
        <label className="grid gap-2 text-sm text-stone-700">
          Full Name
          <input
            name="name"
            type="text"
            required
            placeholder="Your name"
            className="rounded-2xl border border-[#e6e0d9] bg-[#faf8f5] px-4 py-3 outline-none transition focus:border-[#cba58f] focus:ring-2 focus:ring-[#efe3da]"
          />
        </label>

        <label className="grid gap-2 text-sm text-stone-700">
          Email
          <input
            name="email"
            type="email"
            required
            placeholder="you@example.com"
            className="rounded-2xl border border-[#e6e0d9] bg-[#faf8f5] px-4 py-3 outline-none transition focus:border-[#cba58f] focus:ring-2 focus:ring-[#efe3da]"
          />
        </label>
      </div>

      <label className="grid gap-2 text-sm text-stone-700">
        Subject
        <input
          name="subject"
          type="text"
          required
          placeholder="How can we help?"
          className="rounded-2xl border border-[#e6e0d9] bg-[#faf8f5] px-4 py-3 outline-none transition focus:border-[#cba58f] focus:ring-2 focus:ring-[#efe3da]"
        />
      </label>

      <label className="grid gap-2 text-sm text-stone-700">
        Message
        <textarea
          name="message"
          required
          rows={6}
          placeholder="Tell us about your skincare question, order, or feedback..."
          className="rounded-2xl border border-[#e6e0d9] bg-[#faf8f5] px-4 py-3 outline-none transition focus:border-[#cba58f] focus:ring-2 focus:ring-[#efe3da]"
        />
      </label>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="submit"
          disabled={status === "loading"}
          className="rounded-full bg-[#8f5f6a] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#7a4d5c] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {status === "loading" ? "Sending..." : "Send Message"}
        </button>

        <p className="text-xs text-stone-500">We usually reply within 24 hours.</p>
      </div>

      {message ? (
        <p
          className={`rounded-2xl border px-4 py-3 text-sm ${
            status === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-rose-200 bg-rose-50 text-rose-700"
          }`}
        >
          {message}
        </p>
      ) : null}
    </form>
  );
}
