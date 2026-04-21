"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AddToCartButton from "@/components/client/AddToCartButton";

type Product = {
  _id: string;
  name: string;
  price: number;
  image: string;
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const router = useRouter();

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetch(`/api/products?search=${search}`)
        .then(async (res) => {
          if (!res.ok) {
            return [];
          }
          return res.json();
        })
        .then((data) => {
          // ✅ FIX: konverto _id në string
          const fixed = data.map((p: any) => ({
            ...p,
            _id: p._id?.$oid || p._id,
          }));
          setProducts(fixed);
        })
        .catch(() => setProducts([]));
    }, 300);

    return () => clearTimeout(timeout);
  }, [search]);

  return (
    <div className="min-h-screen bg-[#F9F9F9] p-10">

      {/* HEADER */}
      <div className="flex flex-col items-center mb-14">
        <h1 className="mt-10 font-[family-name:var(--font-luxury-serif)] text-3xl font-semibold italic text-[#6b5346] sm:text-6xl">
          Products
        </h1>

        {/* SEARCH (vetëm e shtum, pa ndryshu stilin) */}
        <input
          placeholder="Search products..."
          onChange={(e) => setSearch(e.target.value)}
          className="mt-6 p-3 w-[300px] rounded-xl border border-stone-200 bg-white shadow-sm
                     focus:outline-none focus:ring-2 focus:ring-stone-300"
        />
      </div>

      {/* PRODUCTS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-12">
        {products.map((product) => (
          <div
            key={product._id}
            onClick={() =>router.push(`/products/${product._id}`)}
            className="relative z-10 bg-white rounded-3xl border border-stone-200 p-8 cursor-pointer transition duration-300 hover:shadow-lg hover:-translate-y-1"
          >
            <div className="overflow-hidden rounded-xl mb-6">
              <img
                src={
                  product.image.startsWith("http")
                    ? product.image
                    : `/${product.image}`
                }
                alt={product.name}
                className="w-full h-53 object-cover transition duration-500 hover:scale-105"
              />
            </div>

            <h2 className="text-base font-medium text-stone-900 mb-3 tracking-[0.04em]">
              {product.name}
            </h2>


            <p className="text-stone-900 font-medium text-sm mb-5 tracking-wide">
              €{product.price}
            </p>

            {/* BUTTON (pa e prish click-in e card-it) */}
            <div onClick={(e) => e.stopPropagation()}>
              <AddToCartButton product={product} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}