import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-[#e5e2dc] bg-[#f5f2ed]">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        
        <div className="flex flex-col gap-6 sm:flex-row sm:justify-between">
          
          {/* Logo / Brand */}
          <div>
            <h2 className="text-xl font-semibold text-[#8B7355]">
              SkinCare
            </h2>
            <p className="mt-2 text-sm text-stone-600">
              Your beauty, our care.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-col gap-2 text-sm">
            <Link href="/" className="hover:text-[#8f5f6a]">
              Home
            </Link>
            <Link href="/products" className="hover:text-[#8f5f6a]">
              Products
            </Link>
            <Link href="/about" className="hover:text-[#8f5f6a]">
              About
            </Link>
          </div>

          {/* Contact */}
          <div className="text-sm text-stone-600">
            <p>Email: support@skincare.com</p>
            <p>Phone: +383 44 000 000</p>
          </div>

        </div>

        <div className="mt-8 border-t pt-4 text-center text-xs text-stone-500">
          © {new Date().getFullYear()} SkinCare. All rights reserved.
        </div>

      </div>
    </footer>
  );
}