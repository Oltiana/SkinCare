"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
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

export default function CartPage() {
  const [cart, setCart] = useState<any>({ items: [] });
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [paying, setPaying] = useState(false);
  const [form, setForm] = useState({
    name: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });
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
  }, [status]);

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
            href="/orders"
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
                onClick={() => setShowModal(true)}
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

      {/* MODAL PAGESA */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="relative w-full max-w-md rounded-3xl bg-[#faf9f7] p-8 shadow-2xl">
            {/* CLOSE */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute right-5 top-5 p-1 rounded-full hover:bg-[#e5e2dc] transition"
            >
              <X size={18} className="text-[#5c4a45]" />
            </button>

            <h2 className="text-2xl font-semibold italic text-[#6b5346] mb-6">
              Payment Details
            </h2>

            <div className="space-y-4">
              {/* EMRI */}
              <div>
                <label className="text-sm text-[#5c4a45] font-medium">
                  Cardholder Name
                </label>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-[#e5e2dc] bg-white px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#c9a8ad]"
                />
                {errors.name && (
                  <p className="text-xs text-red-400 mt-1">{errors.name}</p>
                )}
              </div>

              {/* NUMRI I KARTES */}
              <div>
                <label className="text-sm text-[#5c4a45] font-medium">
                  Card Number
                </label>
                <input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  value={form.cardNumber}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      cardNumber: formatCardNumber(e.target.value),
                    })
                  }
                  className="mt-1 w-full rounded-xl border border-[#e5e2dc] bg-white px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#c9a8ad]"
                />
                {errors.cardNumber && (
                  <p className="text-xs text-red-400 mt-1">
                    {errors.cardNumber}
                  </p>
                )}
              </div>

              {/* EXPIRY + CVV */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-[#5c4a45] font-medium">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    value={form.expiry}
                    onChange={(e) =>
                      setForm({ ...form, expiry: formatExpiry(e.target.value) })
                    }
                    className="mt-1 w-full rounded-xl border border-[#e5e2dc] bg-white px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#c9a8ad]"
                  />
                  {errors.expiry && (
                    <p className="text-xs text-red-400 mt-1">{errors.expiry}</p>
                  )}
                </div>

                <div>
                  <label className="text-sm text-[#5c4a45] font-medium">
                    CVV
                  </label>
                  <input
                    type="password"
                    placeholder="•••"
                    maxLength={4}
                    value={form.cvv}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        cvv: e.target.value.replace(/\D/g, ""),
                      })
                    }
                    className="mt-1 w-full rounded-xl border border-[#e5e2dc] bg-white px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#c9a8ad]"
                  />
                  {errors.cvv && (
                    <p className="text-xs text-red-400 mt-1">{errors.cvv}</p>
                  )}
                </div>
              </div>

              {/* TOTAL */}
              <div className="pt-2 border-t border-[#e5e2dc] flex justify-between items-center">
                <span className="text-sm text-stone-500">Total</span>
                <span className="font-semibold text-[#5c4a45]">
                  {total.toFixed(2)}€
                </span>
              </div>

              {/* BUTONI */}
              <button
                onClick={handleCheckout}
                disabled={paying}
                className="w-full rounded-full bg-[#6b5346] py-3 text-white hover:bg-[#5c4a45] transition disabled:opacity-60"
              >
                {paying ? "Duke procesuar..." : "Konfirmo Porosinë"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
