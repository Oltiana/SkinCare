import { Suspense } from "react";
import { CartPageClient } from "@/components/client/cart-page-client";

export default function CartPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[calc(100svh-3.5rem)] items-center justify-center bg-[#faf9f7]">
          <p className="text-sm text-gray-500">Loading cart...</p>
        </div>
      }
    >
      <CartPageClient />
    </Suspense>
  );
}

