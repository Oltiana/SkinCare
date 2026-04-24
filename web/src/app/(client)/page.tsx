import Link from "next/link";

type HomeProps = {
  searchParams: Promise<{ forbidden?: string }>;
};

export default async function Home({ searchParams }: HomeProps) {
  const sp = await searchParams;
  const forbidden = sp.forbidden === "1";

  return (
    <div className="bg-[#faf9f7] min-h-screen px-6 md:px-20 py-10 space-y-10">
      {/* ⚠️ WARNING */}
      {forbidden && (
        <div className="mx-auto w-full max-w-md rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-center text-sm text-amber-950 shadow-sm">
          You don&apos;t have access to that page (admin role required).
        </div>
      )}

      {/* HERO SECTION */}
      <section className="flex flex-col md:flex-row items-center justify-between gap-10 rounded-2xl border border-white/10 bg-white/70 shadow-sm p-10">
        {/* LEFT */}
        <div className="max-w-xl">
          <h1 className="text-5xl font-bold text-gray-800 leading-tight">
            Glow Naturally with Premium Skincare
          </h1>

          <p className="mt-5 text-gray-500">
            Discover high-quality skincare products designed to nourish and
            protect your skin every day.
          </p>

          <Link href="/products">
            <button className="mt-6 bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition">
              Explore Products
            </button>
          </Link>
        </div>

        {/* IMAGE */}
        <div>
          <img
            src="https://www.shutterstock.com/shutterstock/videos/3694129327/thumb/1.jpg?ip=x480"
            alt="Skincare"
            className="w-[550px] md:w-[650px] rounded-2xl shadow-md"
          />
        </div>
      </section>

      {/* ABOUT */}
      <section className="text-center rounded-2xl border border-white/10 bg-white/70 shadow-sm p-10">
        <h2 className="text-3xl font-semibold text-gray-800">About Us</h2>

        <p className="mt-4 text-gray-500 max-w-2xl mx-auto">
          We are committed to providing premium skincare products made with
          natural ingredients and science-backed formulas for all skin types.
        </p>

        <Link href="/about">
          <button className="mt-6 border border-gray-300 px-6 py-2 rounded-xl hover:bg-black hover:text-white transition">
            Learn More
          </button>
        </Link>
      </section>

      {/* FEATURES */}
      <section className="rounded-2xl border border-white/10 bg-white/70 shadow-sm p-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <h3 className="font-semibold text-lg">Free Delivery</h3>
            <p className="text-gray-500 mt-2">
              Free shipping on orders over 50€
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg">Secure Payment</h3>
            <p className="text-gray-500 mt-2">Safe and encrypted checkout</p>
          </div>

          <div>
            <h3 className="font-semibold text-lg">Quality Products</h3>
            <p className="text-gray-500 mt-2">
              Carefully selected skincare products
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
