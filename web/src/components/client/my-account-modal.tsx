"use client";

import type { Session } from "next-auth";
import { signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

type MeOrderItem = { name: string; quantity: number; priceCents?: number };
type MeOrder = { id: string; createdAt: string; items: MeOrderItem[]; totalCents: number | null };

function formatOrderDate(iso: string) {
  try {
    return new Intl.DateTimeFormat("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

function formatMoney(cents: number | null) {
  if (cents == null) return null;
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "EUR" }).format(cents / 100);
}

function firstName(session: Session): string {
  const name = session.user?.name?.trim();
  if (name) {
    return name.split(/\s+/)[0] ?? name;
  }
  const email = session.user?.email?.trim();
  if (email) {
    return email.split("@")[0] ?? email;
  }
  return "User";
}

function UserAvatar({ name }: { name: string }) {
  const initial = name.charAt(0).toUpperCase() || "?";
  return (
    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-stone-200 text-xl font-semibold text-stone-600">
      {initial}
    </div>
  );
}

function LogoutIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points="16 17 21 12 16 7" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="21" y1="12" x2="9" y2="12" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

type MyAccountModalProps = {
  session: Session;
  isOpen: boolean;
  onClose: () => void;
};

export function MyAccountModal({ session, isOpen, onClose }: MyAccountModalProps) {
  const [orders, setOrders] = useState<MeOrder[] | null>(null);
  const [ordersLoading, setOrdersLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  const fname = firstName(session);
  const isAdmin = session.user?.role === "admin";

  useEffect(() => {
    if (!isOpen || isAdmin) return;
    let cancelled = false;
    setOrdersLoading(true);
    fetch("/api/me/orders")
      .then((r) => {
        if (!r.ok) throw new Error("orders");
        return r.json() as Promise<{ orders?: MeOrder[] }>;
      })
      .then((data) => {
        if (!cancelled) setOrders(Array.isArray(data.orders) ? data.orders : []);
      })
      .catch(() => {
        if (!cancelled) setOrders([]);
      })
      .finally(() => {
        if (!cancelled) setOrdersLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [isOpen, isAdmin]);

  if (!isOpen || typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="account-modal-title">
      <button
        type="button"
        className="absolute inset-0 bg-stone-900/45 backdrop-blur-[2px]"
        aria-label="Close"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-md rounded-[1.75rem] bg-white p-6 shadow-2xl sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <h2 id="account-modal-title" className="text-lg font-semibold text-stone-900">
            My account
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 text-stone-400 transition hover:bg-stone-100 hover:text-stone-700"
            aria-label="Close"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="mt-8 flex flex-col items-center text-center">
          <UserAvatar name={fname} />
          <p className="mt-5 text-xl font-semibold text-stone-900 sm:text-2xl">
            Welcome, {fname}!
          </p>
          <p className="mt-2 text-sm text-stone-500">You&apos;re signed in.</p>
        </div>

        <div className="mt-8 border-t border-stone-100 pt-6">
          {isAdmin ? (
            <p className="text-center text-sm leading-relaxed text-stone-600">
              Welcome back to the admin dashboard.
            </p>
          ) : ordersLoading ? (
            <p className="text-center text-sm text-stone-400">Loading orders…</p>
          ) : !orders || orders.length === 0 ? (
            <p className="text-center text-sm text-stone-600">No orders yet.</p>
          ) : (
            <div>
              <p className="mb-3 text-center text-xs font-medium uppercase tracking-wide text-stone-400">
                Your orders
              </p>
              <ul className="max-h-[220px] overflow-y-auto border-t border-stone-200/70">
                {orders.map((o) => {
                  const totalLabel = formatMoney(o.totalCents);
                  return (
                    <li key={o.id} className="border-b border-stone-200/50 px-1 py-3 last:border-b-0">
                      <p className="text-xs font-medium text-stone-400">{formatOrderDate(o.createdAt)}</p>
                      <ul className="mt-1.5 space-y-0.5 text-sm text-stone-700">
                        {o.items.map((it, i) => (
                          <li key={`${o.id}-${i}`}>
                            {it.quantity}× {it.name}
                          </li>
                        ))}
                      </ul>
                      {totalLabel ? (
                        <p className="mt-1.5 text-xs font-medium text-stone-500">{totalLabel}</p>
                      ) : null}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/" })}
          className="mt-8 flex w-full items-center justify-center gap-2 rounded-full border-2 border-stone-300 bg-white py-3.5 text-sm font-semibold text-stone-800 transition hover:border-stone-400 hover:bg-stone-50"
        >
          <LogoutIcon className="h-5 w-5" />
          Logout
        </button>
      </div>
    </div>,
    document.body,
  );
}
