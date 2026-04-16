"use client";

import { useState } from "react";

/** Client component: calls /api/health for a quick backend check. */
export function ApiStatus() {
  const [payload, setPayload] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function pingApi() {
    setLoading(true);
    try {
      const res = await fetch("/api/health");
      const data = await res.json();
      setPayload(JSON.stringify(data, null, 2));
    } catch {
      setPayload("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mt-8 w-full max-w-md rounded-xl border border-zinc-200 bg-zinc-50/80 p-4 text-left dark:border-zinc-800 dark:bg-zinc-950/40">
      <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
        Client → API (backend)
      </h2>
      <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
        This block uses <code className="rounded bg-zinc-200/80 px-1 dark:bg-zinc-800">use client</code> and calls{" "}
        <code className="rounded bg-zinc-200/80 px-1 dark:bg-zinc-800">/api/health</code>.
      </p>
      <button
        type="button"
        onClick={pingApi}
        disabled={loading}
        className="mt-3 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
      >
        {loading ? "Loading…" : "Call API"}
      </button>
      {payload !== null && (
        <pre className="mt-3 overflow-x-auto rounded-lg bg-zinc-900 p-3 text-xs text-emerald-300">
          {payload}
        </pre>
      )}
    </section>
  );
}
