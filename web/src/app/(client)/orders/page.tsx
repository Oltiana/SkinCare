"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { status } = useSession();

  useEffect(() => {
    // ✅ Nëse nuk është i loguar, dërgo në login
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    // ✅ Prit derisa session të ngarkohet
    if (status === "authenticated") {
      fetchOrders();
    }
  }, [status]);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/orders");
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Shfaq loading derisa session kontrollohet
  if (status === "loading") {
    return (
      <div className="flex min-h-[calc(100svh-3.5rem)] items-center justify-center bg-[#faf9f7]">
        <p className="text-sm text-gray-500">Duke u ngarkuar...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100svh-3.5rem)] flex-col bg-[#faf9f7] px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto w-full max-w-2xl">
        {/* HEADER */}
        <div className="relative text-center">
          <Link
            href="/cart"
            className="absolute left-0 top-0 text-sm text-[#5c4a45] hover:underline"
          >
            ← Back
          </Link>

          <div className="h-px w-14 mx-auto bg-gradient-to-r from-transparent via-[#c9a8ad]/50 to-transparent" />

          <h1 className="mt-10 text-3xl font-semibold italic text-[#6b5346] sm:text-4xl">
            Your Orders
          </h1>
        </div>

        {/* LOADING */}
        {loading && (
          <p className="mt-10 text-center text-sm text-gray-500">
            Loading orders...
          </p>
        )}

        {/* EMPTY */}
        {!loading && orders.length === 0 && (
          <div className="mt-10 text-center">
            <p className="text-sm text-stone-500">You have no orders yet.</p>

            <Link
              href="/"
              className="mt-6 inline-flex rounded-full border border-[#e5e2dc] bg-[#f5f2ed]/90 px-6 py-2 text-sm text-[#5c4a45]"
            >
              Go Shopping
            </Link>
          </div>
        )}

        {/* ORDERS LIST */}
        <div className="mt-10 space-y-6">
          {orders.map((order, index) => (
            <div
              key={index}
              className="rounded-2xl border border-[#e5e2dc] bg-[#f5f2ed]/70 p-5"
            >
              {/* ORDER INFO */}
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-semibold text-[#5c4a45]">
                  Order #{index + 1}
                </h2>

                <span className="text-sm text-green-600">
                  {order.status || "Completed"}
                </span>
              </div>

              {/* ITEMS */}
              <div className="space-y-2">
                {order.items.map((item: any) => (
                  <div
                    key={item.productId}
                    className="flex justify-between text-sm text-stone-600"
                  >
                    <span>
                      {item.name} x {item.quantity}
                    </span>
                    <span>{item.price * item.quantity}€</span>
                  </div>
                ))}
              </div>

              {/* TOTAL */}
              <div className="mt-4 pt-3 border-t border-[#e5e2dc] text-right">
                <span className="font-semibold text-[#5c4a45]">
                  Total: {order.total}€
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
