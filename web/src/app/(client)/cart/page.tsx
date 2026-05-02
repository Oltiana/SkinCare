"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { Trash2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";

const GUEST_CART_KEY = "guest_cart";

function getGuestCart() {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(GUEST_CART_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveGuestCart(items: any[]) {
  localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items));
}

function clearGuestCart() {
  localStorage.removeItem(GUEST_CART_KEY);
}

export default function CartPage() {
  const [cart, setCart] = useState<any>({ items: [] });
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { status } = useSession();
  const checkoutDone = useRef(false);

  const fetchCart = async (): Promise<any> => {
    try {
      setLoading(true);

      if (status === "authenticated") {
        const guestItems = getGuestCart();
        if (guestItems.length > 0) {
          await fetch("/api/cart/merge", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ items: guestItems }),
          });
          clearGuestCart();
        }

        const res = await fetch("/api/cart");
        if (!res.ok) {
          setCart({ items: [] });
          return { items: [] };
        }
        const data = await res.json();
        setCart(data);
        return data;
      } else if (status === "unauthenticated") {
        const items = getGuestCart();
        setCart({ items });
        return { items };
      }
    } catch (err) {
      console.error(err);
      setCart({ items: [] });
      return { items: [] };
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = async () => {
    try {
      const res = await fetch("/api/checkout", { method: "POST" });
      if (res.ok) {
        setCart({ items: [] });
        router.push("/orders");
      } else {
        const data = await res.json();
        alert(data.message || "Checkout failed");
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (status === "loading") return;

    // ✅ Nëse erdhi nga login me ?checkout=true, fetch pastaj checkout
    if (
      status === "authenticated" &&
      searchParams.get("checkout") === "true" &&
      !checkoutDone.current
    ) {
      checkoutDone.current = true;
      fetchCart().then((data) => {
        if (data?.items?.length > 0) {
          handleCheckout();
        } else {
          router.push("/orders");
        }
      });
    } else {
      fetchCart();
    }
  }, [status]);

  const increase = async (item: any) => {
    if (status === "authenticated") {
      setCart((prev: any) => ({
        ...prev,
        items: prev.items.map((i: any) =>
          i.productId === item.productId
            ? { ...i, quantity: i.quantity + 1 }
            : i,
        ),
      }));
      await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: item.productId,
          name: item.name,
          price: item.price,
        }),
      });
    } else {
      const items = getGuestCart();
      const exist = items.find((i: any) => i.productId === item.productId);
      if (exist) exist.quantity += 1;
      saveGuestCart(items);
      setCart({ items: [...items] });
    }
  };

  const decrease = async (item: any) => {
    if (status === "authenticated") {
      setCart((prev: any) => ({
        ...prev,
        items: prev.items
          .map((i: any) =>
            i.productId === item.productId
              ? { ...i, quantity: i.quantity - 1 }
              : i,
          )
          .filter((i: any) => i.quantity > 0),
      }));
      await fetch("/api/cart/decrease", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: item.productId }),
      });
    } else {
      let items = getGuestCart();
      items = items
        .map((i: any) =>
          i.productId === item.productId
            ? { ...i, quantity: i.quantity - 1 }
            : i,
        )
        .filter((i: any) => i.quantity > 0);
      saveGuestCart(items);
      setCart({ items: [...items] });
    }
  };

  const remove = async (id: string) => {
    if (status === "authenticated") {
      setCart((prev: any) => ({
        ...prev,
        items: prev.items.filter((i: any) => i.productId !== id),
      }));
      await fetch("/api/cart", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: id }),
      });
    } else {
      const items = getGuestCart().filter((i: any) => i.productId !== id);
      saveGuestCart(items);
      setCart({ items: [...items] });
    }
  };

  const total =
    cart?.items?.reduce(
      (sum: number, item: any) => sum + item.price * item.quantity,
      0,
    ) || 0;

  if (status === "loading" || loading) {
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
            href="/orders" // ✅ jo /dashboard/orders
            className="absolute right-0 top-0 text-sm text-[#5c4a45] hover:underline"
          >
            View your orders
          </Link>

          <div className="h-px w-14 mx-auto bg-gradient-to-r from-transparent via-[#c9a8ad]/50 to-transparent" />

          <h1 className="mt-10 text-3xl font-semibold italic text-[#6b5346] sm:text-4xl">
            Cart
          </h1>
        </div>

        {/* EMPTY */}
        {cart.items.length === 0 && (
          <div className="mt-10 text-center">
            <p className="text-sm text-stone-500">Your cart is empty.</p>
            <Link
              href="/"
              className="mt-8 inline-flex rounded-full border border-[#e5e2dc] bg-[#f5f2ed]/90 px-8 py-3 text-sm font-semibold text-[#5c4a45]"
            >
              Back to home
            </Link>
          </div>
        )}

        {/* ITEMS */}
        <div className="mt-10 space-y-6">
          {cart.items.map((item: any) => (
            <div
              key={item.productId}
              className="grid grid-cols-[2fr_1fr_auto] items-center rounded-2xl border border-[#e5e2dc] bg-[#f5f2ed]/70 p-5"
            >
              <div>
                <h2 className="font-semibold text-[#5c4a45]">{item.name}</h2>
                <p className="text-sm text-stone-500">{item.price}€</p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => decrease(item)}
                  className="px-3 py-1 rounded bg-[#e5e2dc]"
                >
                  -
                </button>
                <span>{item.quantity}</span>
                <button
                  onClick={() => increase(item)}
                  className="px-3 py-1 rounded bg-[#e5e2dc]"
                >
                  +
                </button>
              </div>

              <button
                onClick={() => remove(item.productId)}
                className="p-2 rounded-full hover:bg-red-100"
              >
                <Trash2 size={18} className="text-red-400" />
              </button>
            </div>
          ))}
        </div>

        {/* TOTAL */}
        {cart.items.length > 0 && (
          <div className="mt-10 rounded-2xl border border-[#e5e2dc] bg-[#f5f2ed]/70 p-6 text-center">
            <h2 className="text-lg font-semibold text-[#5c4a45]">
              Total: {total.toFixed(2)}€
            </h2>

            {status === "authenticated" ? (
              <button
                onClick={handleCheckout}
                className="mt-4 w-full rounded-full bg-[#6b5346] py-3 text-white hover:bg-[#5c4a45] transition"
              >
                Checkout
              </button>
            ) : (
              <button
                onClick={() => {
                  saveGuestCart(cart.items);
                  router.push("/login?callbackUrl=/cart%3Fcheckout%3Dtrue");
                }}
                className="mt-4 w-full rounded-full bg-[#6b5346] py-3 text-white hover:bg-[#5c4a45] transition"
              >
                Login to Checkout
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
