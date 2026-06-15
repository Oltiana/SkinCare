"use client";

import { useEffect, useState } from "react";
import { defaultFaqContent } from "@/lib/server/content/faq-defaults";

export default function FaqAdminPage() {
  const [json, setJson] = useState("{}\n");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let mounted = true;

    async function load() {
      const res = await fetch("/api/admin/faq");
      const data = await res.json();

      if (!mounted) return;

      if (data.ok && data.data) {
        setJson(JSON.stringify(data.data, null, 2));
      } else {
        setJson(JSON.stringify(defaultFaqContent, null, 2));
      }
    }

    load();

    return () => {
      mounted = false;
    };
  }, []);

  async function handleSave() {
    setSaving(true);
    setMessage("");

    try {
      const parsed = JSON.parse(json);
      const res = await fetch("/api/admin/faq", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed),
      });
      const data = await res.json();

      if (!res.ok || !data.ok) {
        throw new Error(data.message || "Unable to save content");
      }

      setMessage("FAQ page content saved successfully.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to save content");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-full bg-white px-6 py-8 sm:px-10 sm:py-10">
      <div className="mx-auto max-w-6xl space-y-6">
        <div>
          <p className="text-sm uppercase tracking-[0.22em] text-[#9a7b56]">Admin</p>
          <h1 className="mt-2 text-3xl font-semibold text-stone-900">Manage FAQ Page</h1>
          <p className="mt-2 text-stone-500">
            Edit the FAQ page content here. The changes are stored in MongoDB and shown on the public FAQ page.
          </p>
        </div>

        <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
          <label className="mb-2 block text-sm font-semibold text-stone-700" htmlFor="faq-json">
            FAQ page JSON
          </label>
          <p className="mb-4 text-sm text-stone-500">
            You can add or update categories, questions, answers, and hero text from here.
          </p>
          <textarea
            id="faq-json"
            value={json}
            onChange={(e) => setJson(e.target.value)}
            spellCheck={false}
            className="min-h-[420px] w-full rounded-2xl border border-stone-200 bg-stone-50 p-4 font-mono text-sm text-stone-800 outline-none ring-0 transition focus:border-[#d8c9b8] focus:bg-white"
          />

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="rounded-xl bg-[#6b5346] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#5c4a45] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save FAQ Content"}
            </button>

            <p className="text-sm text-emerald-700">{message}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
