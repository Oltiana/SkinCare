"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useDashboardSearch } from "./dashboard-search-context";

export type CustomerRow = {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
};

type CustomersTableProps = {
  users: CustomerRow[];
  currentUserId: string;
};

function formatRegistered(iso: string) {
  if (!iso) return "—";
  try {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(iso));
  } catch {
    return "—";
  }
}

const thBase =
  "px-3 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.06em] text-stone-400 sm:px-4";
const tdBase = "px-3 py-3.5 align-middle sm:px-4";

export function CustomersTable({ users, currentUserId }: CustomersTableProps) {
  const router = useRouter();
  const { searchQuery } = useDashboardSearch();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return users;
    return users.filter(
      (u) =>
        u.email.toLowerCase().includes(q) ||
        u.name.toLowerCase().includes(q) ||
        u.role.toLowerCase().includes(q),
    );
  }, [users, searchQuery]);

  async function onDelete(id: string) {
    if (!confirm("Delete this customer? This cannot be undone.")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        alert(data.error ?? "Delete failed.");
        return;
      }
      router.refresh();
    } finally {
      setDeletingId(null);
    }
  }

  const q = searchQuery.trim();

  return (
    <div className="w-full pl-8 pr-6 pb-14 pt-8 lg:pl-12 lg:pr-10">
      <h1 className="text-[1.75rem] font-bold tracking-tight text-stone-900 lg:text-[2rem]">Customers</h1>
      <p className="mt-2 text-[0.9375rem] text-stone-500">
        {users.length} customer(s).
        {q && users.length !== filtered.length ? (
          <span className="text-stone-400"> Showing {filtered.length} match(es).</span>
        ) : null}
      </p>

      <div className="mt-8 overflow-x-auto">
        <table className="w-full min-w-[820px] border-collapse text-left">
          <thead>
            <tr className="border-b border-stone-200/70">
              <th className={thBase}>Name</th>
              <th className={thBase}>Email</th>
              <th className={thBase}>Registered</th>
              <th className={thBase}>Total orders</th>
              <th className={thBase}>Last order</th>
              <th className={thBase}>Role</th>
              <th className={thBase}>Actions</th>
            </tr>
          </thead>
          <tbody className="text-[0.9375rem] text-stone-800">
            {filtered.map((u, rowIndex) => {
              const isAdmin = u.id === currentUserId;
              const rowRule =
                rowIndex < filtered.length - 1 ? "border-b border-stone-200/45" : "";
              return (
                <tr key={u.id} className="bg-white hover:bg-stone-50/50">
                  <td className={`${tdBase} ${rowRule} font-medium text-stone-900`}>{u.name || "—"}</td>
                  <td className={`${tdBase} ${rowRule} text-stone-600`}>{u.email}</td>
                  <td className={`${tdBase} ${rowRule} text-stone-600`}>{formatRegistered(u.createdAt)}</td>
                  <td className={`${tdBase} ${rowRule} tabular-nums text-stone-600`}>0</td>
                  <td className={`${tdBase} ${rowRule} text-stone-500`}>No orders yet</td>
                  <td className={`${tdBase} ${rowRule} text-stone-600`}>{isAdmin ? "Admin" : "Customer"}</td>
                  <td className={`${tdBase} ${rowRule}`}>
                    {isAdmin ? (
                      <span className="text-stone-300">—</span>
                    ) : (
                      <button
                        type="button"
                        disabled={deletingId === u.id}
                        onClick={() => onDelete(u.id)}
                        className="rounded border border-rose-300 bg-transparent px-3 py-1 text-xs font-medium text-rose-600 transition hover:bg-rose-50 disabled:opacity-50"
                      >
                        {deletingId === u.id ? "…" : "Delete"}
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {users.length === 0 && (
        <p className="mt-12 text-sm text-stone-500">No customers yet.</p>
      )}
      {users.length > 0 && filtered.length === 0 && q && (
        <p className="mt-8 text-sm text-stone-500">No customers match “{searchQuery.trim()}”.</p>
      )}
    </div>
  );
}
