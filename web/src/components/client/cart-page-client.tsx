"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Trash2, X } from "lucide-react";
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

function formatCardNumber(value: string) {
  return value
    .replace(/\D/g, "")
    .slice(0, 16)
    .replace(/(.{4})/g, "$1 ")
    .trim();
}

function formatExpiry(value: string) {
  return value
    .replace(/\D/g, "")
    .slice(0, 4)
    .replace(/^(\d{2})(\d)/, "$1/$2");
}

export function CartPageClient() {
  const [cart, setCart] = useState<any>({ items: [] });
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [paying, setPaying] = useState(false);
  const [form, setForm] = useState({ name: "", cardNumber: "", expiry: "", cvv: "" });
  const [errors, setErrors] = useState<any>({});

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

  useEffect(() => {
    if (status === "loading") return;

    if (
      status === "authenticated" &&
      searchParams.get("checkout") === "true" &&
      !checkoutDone.current
    ) {
      checkoutDone.current = true;
      fetchCart().then((data) => {
        if (data?.items?.length > 0) {
          setShowModal(true);
        } else {
          router.push("/orders");
        }
      });
    } else {
      fetchCart();
    }
  }, [status, searchParams, router]);

  const validate = () => {
    const e: any = {};
    if (!form.name.trim()) e.name = "Emri është i detyrueshëm";
    if (form.cardNumber.replace(/\s/g, "").length !== 16)
      e.cardNumber = "Numri i kartës duhet të jetë 16 shifra";
    if (form.expiry.length !== 5) e.expiry = "Data duhet të jetë MM/YY";
    if (form.cvv.length < 3) e.cvv = "CVV duhet të jetë 3-4 shifra";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleCheckout = async () => {
    if (!validate()) return;

    try {
      setPaying(true);
      const res = await fetch("/api/checkout", { method: "POST" });
      if (res.ok) {
        setCart({ items: [] });
        setShowModal(false);
        router.push("/orders");
      } else {
        const data = await res.json();
        alert(data.message || "Checkout failed");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setPaying(false);
    }
  };

  const increase = async (item: any) => {
    if (status === "authenticated") {
      setCart((prev: any) => ({
        ...prev,
        items: prev.items.map((i: any) =>
          i.productId === item.productId ? { ...i, quantity: i.quantity + 1 } : i,
        ),
      }));
      await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: item.productId, name: item.name, price: item.price }),
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
          .map((i: any) => (i.productId === item.productId ? { ...i, quantity: i.quantity - 1 } : i))
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
        .map((i: any) => (i.productId === item.productId ? { ...i, quantity: i.quantity - 1 } : i))
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

  const total = cart?.items?.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0) || 0;

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
        <div className="relative text-center">
          <Link href="/orders" className="absolute right-0 top-0 text-sm text-[#5c4a45] hover:underline">View your orders</Link>
          <div className="mx-auto h-px w-14 bg-gradient-to-r from-transparent via-[#c9a8ad]/50 to-transparent" />
          <h1 className="mt-10 text-3xl font-semibold italic text-[#6b5346] sm:text-4xl">Cart</h1>
        </div>

        {cart.items.length === 0 ? (
          <div className="mt-10 rounded-3xl border border-[#e9e4dd] bg-white p-8 text-center shadow-sm">
            <p className="text-sm text-stone-500">Your cart is empty.</p>
            <Link href="/products" className="mt-4 inline-flex rounded-full bg-[#8f5f6a] px-4 py-2 text-sm font-semibold text-white hover:bg-[#7b4c5b]">Continue shopping</Link>
          </div>
        ) : (
          <div className="mt-10 rounded-3xl border border-[#e9e4dd] bg-white p-6 shadow-sm sm:p-8">
            <div className="space-y-4">
              {cart.items.map((item: any) => (
                <article key={item.productId} className="rounded-2xl border border-[#efe7df] bg-[#fffaf6] p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-base font-semibold text-stone-900">{item.name}</h2>
                      <p className="mt-1 text-sm text-stone-500">€{item.price} each</p>
                    </div>
                    <button type="button" onClick={() => remove(item.productId)} className="rounded-full p-2 text-stone-400 hover:bg-[#f8efeb] hover:text-[#8f5f6a]" aria-label="Remove item">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="mt-4 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 rounded-full bg-white p-1 shadow-sm border border-[#efe7df]">
                      <button type="button" onClick={() => decrease(item)} className="h-8 w-8 rounded-full text-lg text-stone-700 hover:bg-[#f6efe9]">−</button>
                      <span className="min-w-8 text-center text-sm font-semibold text-stone-800">{item.quantity}</span>
                      <button type="button" onClick={() => increase(item)} className="h-8 w-8 rounded-full text-lg text-stone-700 hover:bg-[#f6efe9]">+</button>
                    </div>
                    <p className="text-sm font-semibold text-stone-900">€{item.price * item.quantity}</p>
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-6 rounded-2xl bg-[#f7f2ed] p-4 text-sm text-stone-600">
              <div className="flex items-center justify-between text-base font-semibold text-stone-900">
                <span>Total</span>
                <span>€{total.toFixed(2)}</span>
              </div>
              <p className="mt-2 text-xs text-stone-500">Shipping and tax calculated at checkout.</p>
            </div>

            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="mt-6 w-full rounded-full bg-[#8f5f6a] px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#7a4d5c]"
            >
              Proceed to checkout
            </button>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-stone-900">Checkout</h2>
                <p className="mt-1 text-sm text-stone-500">Complete your payment details to place the order.</p>
              </div>
              <button type="button" onClick={() => setShowModal(false)} className="rounded-full p-2 text-stone-400 hover:bg-[#f7f0eb] hover:text-stone-700" aria-label="Close checkout">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-6 space-y-4">
              <label className="grid gap-2 text-sm text-stone-700">
                Name on card
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="rounded-2xl border border-[#e6e0d9] bg-[#faf8f5] px-4 py-3" placeholder="John Doe" />
                {errors.name && <span className="text-xs text-rose-500">{errors.name}</span>}
              </label>

              <label className="grid gap-2 text-sm text-stone-700">
                Card number
                <input value={form.cardNumber} onChange={(e) => setForm({ ...form, cardNumber: formatCardNumber(e.target.value) })} className="rounded-2xl border border-[#e6e0d9] bg-[#faf8f5] px-4 py-3" placeholder="4242 4242 4242 4242" />
                {errors.cardNumber && <span className="text-xs text-rose-500">{errors.cardNumber}</span>}
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-2 text-sm text-stone-700">
                  Expiry
                  <input value={form.expiry} onChange={(e) => setForm({ ...form, expiry: formatExpiry(e.target.value) })} className="rounded-2xl border border-[#e6e0d9] bg-[#faf8f5] px-4 py-3" placeholder="MM/YY" />
                  {errors.expiry && <span className="text-xs text-rose-500">{errors.expiry}</span>}
                </label>
                <label className="grid gap-2 text-sm text-stone-700">
                  CVV
                  <input value={form.cvv} onChange={(e) => setForm({ ...form, cvv: e.target.value.replace(/\D/g, "").slice(0, 4) })} className="rounded-2xl border border-[#e6e0d9] bg-[#faf8f5] px-4 py-3" placeholder="123" />
                  {errors.cvv && <span className="text-xs text-rose-500">{errors.cvv}</span>}
                </label>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button type="button" onClick={() => setShowModal(false)} className="rounded-full border border-[#e6e0d9] px-4 py-2.5 text-sm font-semibold text-stone-700 hover:bg-[#f6f3ef]">Cancel</button>
              <button type="button" onClick={handleCheckout} disabled={paying} className="rounded-full bg-[#8f5f6a] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#7b4c5b] disabled:cursor-not-allowed disabled:opacity-70">{paying ? "Processing..." : "Pay now"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
