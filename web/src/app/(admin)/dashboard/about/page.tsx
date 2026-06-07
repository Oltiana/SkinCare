"use client";

import { useEffect, useState } from "react";

export default function AboutAdminPage() {
  const [json, setJson] = useState("{}\n");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let mounted = true;

    async function load() {
      const res = await fetch("/api/admin/about");
      const data = await res.json();

      if (!mounted) return;

      if (data.ok && data.data) {
        setJson(JSON.stringify(data.data, null, 2));
      } else {
        setJson(JSON.stringify({
          slug: "about",
          heroTitle: "Beauty Rooted in Nature, Perfected by Science",
          heroSubtitle:
            "Since 2018, SkinCare has been on a mission to create premium skincare products that celebrate natural beauty — without compromising on effectiveness, ethics, or the environment.",
          storyTitle: "How It All Began",
          storyParagraph1:
            "It started with a simple frustration: our founder couldn’t find skincare products that were both truly natural and genuinely effective.",
          storyParagraph2:
            "Armed with a background in dermatology and a deep love for botanical science, she partnered with biochemist Driton to build formulas from scratch.",
          storyParagraph3:
            "Today, SkinCare is trusted by over 50,000 customers across 30+ countries — and we’re just getting started.",
          missionTitle: "Our Mission",
          missionText:
            "To make premium, clean skincare accessible to everyone — creating products that honour your skin's natural biology while delivering results you can see and feel.",
          visionTitle: "Our Vision",
          visionText:
            "A world where beauty routines are a celebration of self — where every product is transparent, effective, sustainable, and crafted with genuine care for people and planet.",
          stats: [
            { value: "2018", label: "Founded" },
            { value: "120+", label: "Products" },
            { value: "50k+", label: "Happy Customers" },
            { value: "30+", label: "Countries" },
          ],
          values: [],
          teamMembers: [],
        }, null, 2));
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
      const res = await fetch("/api/admin/about", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed),
      });
      const data = await res.json();

      if (!res.ok || !data.ok) {
        throw new Error(data.message || "Unable to save content");
      }

      setMessage("About page content saved successfully.");
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
          <h1 className="mt-2 text-3xl font-semibold text-stone-900">Manage About Page</h1>
          <p className="mt-2 text-stone-500">
            Edit the About page content here. The changes are stored in MongoDB and shown on the public About page.
          </p>
        </div>

        <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
          <label className="mb-2 block text-sm font-semibold text-stone-700" htmlFor="about-json">
            About page JSON
          </label>
          <p className="mb-4 text-sm text-stone-500">
            You can add or update team members, values, stats, and all text blocks from here.
          </p>
          <textarea
            id="about-json"
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
              {saving ? "Saving..." : "Save About Content"}
            </button>

            <p className="text-sm text-emerald-700">{message}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
