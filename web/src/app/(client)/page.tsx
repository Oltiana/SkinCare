import Link from "next/link";
import BestSellers from "@/components/client/BestSellers";
import BestSellersSlider from "@/components/client/BestSellersSlider";
import { Leaf, ShieldCheck, Sparkles, Truck } from "lucide-react";

type HomeProps = {
  searchParams: Promise<{ forbidden?: string }>;
};

export default async function Home({ searchParams }: HomeProps) {
  const sp = await searchParams;
  const forbidden = sp.forbidden === "1";

  return (
    <div className="bg-[#faf9f7] min-h-screen px-6 md:px-20 py-12 space-y-16">
      {/* WARNING */}
      {forbidden && (
        <div className="mx-auto max-w-md rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-center text-sm text-amber-900 shadow-sm">
          You don&apos;t have access to that page (admin role required).
        </div>
      )}

      {/* HERO */}
      <section className="flex flex-col md:flex-row items-center gap-10 rounded-2xl border border-white/10 bg-white/70 shadow-sm p-10">
        <div className="max-w-xl space-y-5">
          <span className="inline-flex items-center gap-2 text-sm text-gray-500">
            <Sparkles size={16} /> Premium Skincare Collection
          </span>

          <h1 className="text-5xl font-bold text-gray-800 leading-tight">
            Glow Naturally with Premium Skincare
          </h1>

          <p className="text-gray-500">
            Discover high-quality skincare products designed to nourish and
            protect your skin every day.
          </p>

          <Link href="/products">
            <button className="mt-2 bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition">
              Explore Products
            </button>
          </Link>
        </div>

        <div className="relative">
          <img
            src="https://www.shutterstock.com/shutterstock/videos/3694129327/thumb/1.jpg?ip=x480"
            alt="Skincare"
            className="w-[550px] rounded-2xl shadow-md"
          />

          <div className="absolute -bottom-4 -left-4 bg-white border border-white/10 shadow-sm px-4 py-2 rounded-xl text-sm text-gray-600">
            ✨ Glow formula
          </div>
        </div>
      </section>

      {/* FEATURES ICONS */}
      <section className="grid md:grid-cols-4 gap-6">
        <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/70 p-5 shadow-sm">
          <Leaf className="text-green-600" />
          <div>
            <h3 className="font-semibold">Natural</h3>
            <p className="text-xs text-gray-500">Clean ingredients</p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/70 p-5 shadow-sm">
          <ShieldCheck className="text-blue-600" />
          <div>
            <h3 className="font-semibold">Safe</h3>
            <p className="text-xs text-gray-500">Dermatologist tested</p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/70 p-5 shadow-sm">
          <Sparkles className="text-purple-600" />
          <div>
            <h3 className="font-semibold">Glow</h3>
            <p className="text-xs text-gray-500">Visible results</p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/70 p-5 shadow-sm">
          <Truck className="text-orange-500" />
          <div>
            <h3 className="font-semibold">Fast delivery</h3>
            <p className="text-xs text-gray-500">Across Europe</p>
          </div>
        </div>
      </section>

      {/* BEST SELLERS (SLIDER) */}
      <section className="rounded-2xl border border-white/10 bg-white/70 shadow-sm p-10 space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-semibold text-gray-800">Best Sellers</h2>
          <p className="text-gray-500">Our most loved skincare products</p>
        </div>

        <BestSellersSlider>
          <BestSellers />
        </BestSellersSlider>
      </section>

      {/* WHY CHOOSE US */}
      <section className="rounded-2xl border border-white/10 bg-white/70 shadow-sm p-10 space-y-8">
        <h2 className="text-3xl font-semibold text-center text-gray-800">
          Why Choose Us
        </h2>

        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div className="p-6 rounded-xl border border-white/10 bg-white/60 shadow-sm">
            <Leaf className="mx-auto mb-3 text-green-600" />
            <h3 className="font-semibold">Natural Ingredients</h3>
            <p className="text-gray-500 mt-2 text-sm">
              Safe formulas made with nature in mind.
            </p>
          </div>

          <div className="p-6 rounded-xl border border-white/10 bg-white/60 shadow-sm">
            <ShieldCheck className="mx-auto mb-3 text-blue-600" />
            <h3 className="font-semibold">Dermatologist Approved</h3>
            <p className="text-gray-500 mt-2 text-sm">
              Tested and trusted by skincare experts.
            </p>
          </div>

          <div className="p-6 rounded-xl border border-white/10 bg-white/60 shadow-sm">
            <Sparkles className="mx-auto mb-3 text-purple-600" />
            <h3 className="font-semibold">Visible Results</h3>
            <p className="text-gray-500 mt-2 text-sm">
              See improvement in just a few weeks.
            </p>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="rounded-2xl border border-white/10 bg-white/70 shadow-sm p-10 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-semibold text-gray-800">
            What Our Customers Say
          </h2>
          <p className="text-gray-500">Real feedback from verified customers</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-6 rounded-xl border border-white/10 bg-white shadow-sm space-y-3">
            <div className="text-yellow-500">★★★★★</div>
            <p className="text-gray-600 text-sm">
              “After 2 weeks my skin is much smoother and hydrated.”
            </p>
            <p className="font-semibold text-sm">Elira M.</p>
            <p className="text-xs text-gray-400">Verified Buyer</p>
          </div>

          <div className="p-6 rounded-xl border border-white/10 bg-white shadow-sm space-y-3">
            <div className="text-yellow-500">★★★★★</div>
            <p className="text-gray-600 text-sm">
              “Great quality and fast delivery. Very gentle on skin.”
            </p>
            <p className="font-semibold text-sm">Arta K.</p>
            <p className="text-xs text-gray-400">Verified Buyer</p>
          </div>

          <div className="p-6 rounded-xl border border-white/10 bg-white shadow-sm space-y-3">
            <div className="text-yellow-500">★★★★★</div>
            <p className="text-gray-600 text-sm">
              “No irritation at all. Finally found the right product.”
            </p>
            <p className="font-semibold text-sm">Dren B.</p>
            <p className="text-xs text-gray-400">Verified Buyer</p>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="rounded-2xl border border-white/10 bg-white/70 shadow-sm p-10 text-center space-y-5">
        <h2 className="text-3xl font-semibold text-gray-800">About Us</h2>

        <p className="text-gray-500 max-w-2xl mx-auto">
          We create premium skincare products with natural ingredients and
          science-backed formulas for all skin types.
        </p>

        <Link href="/about">
          <button className="border border-gray-300 px-6 py-2 rounded-xl hover:bg-black hover:text-white transition">
            Learn More
          </button>
        </Link>
      </section>
    </div>
  );
}
