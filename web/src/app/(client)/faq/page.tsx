import { HelpCircle } from "lucide-react";
import FaqAccordion from "./FaqAccordion";

export const metadata = {
  title: "FAQ | SkinCare",
  description: "Frequently asked questions about SkinCare products, orders, shipping and more.",
};

const categories = [
  {
    id: "orders",
    label: "Orders",
    emoji: "📦",
    items: [
      {
        q: "How do I place an order?",
        a: "Browse our products, add items to your cart, and proceed to checkout. You can check out as a guest or create an account for a faster experience and order history.",
      },
      {
        q: "Can I modify or cancel my order after placing it?",
        a: "Orders can be modified or cancelled within 1 hour of placement. After that, they enter processing and cannot be changed. Please contact us immediately at support@skincare.com.",
      },
      {
        q: "How will I know my order was confirmed?",
        a: "You'll receive a confirmation email with your order details and tracking information as soon as your order is placed and processed.",
      },
      {
        q: "Can I order without creating an account?",
        a: "Yes! Guest checkout is available. However, creating an account lets you track orders, save your address, and earn loyalty points.",
      },
    ],
  },
  {
    id: "shipping",
    label: "Shipping",
    emoji: "🚚",
    items: [
      {
        q: "Where do you ship?",
        a: "We ship to 30+ countries across Europe and beyond. Shipping availability and rates are shown at checkout based on your delivery address.",
      },
      {
        q: "How long does delivery take?",
        a: "Standard delivery takes 3–5 business days within Kosovo and 5–10 business days for international orders. Express options are available at checkout.",
      },
      {
        q: "Is there free shipping?",
        a: "Yes! We offer free standard shipping on all orders over €50 within Kosovo and over €80 for international orders.",
      },
      {
        q: "How do I track my order?",
        a: "Once your order ships, you'll receive a tracking number via email. You can also track your order from the Orders page in your account.",
      },
    ],
  },
  {
    id: "products",
    label: "Products",
    emoji: "✨",
    items: [
      {
        q: "Are your products suitable for sensitive skin?",
        a: "Yes! All SkinCare products are formulated with sensitive skin in mind. They are dermatologist-tested, hypoallergenic, and free from harsh sulfates, parabens, and artificial fragrances.",
      },
      {
        q: "Are your products cruelty-free and vegan?",
        a: "All of our products are 100% cruelty-free — we never test on animals. Most of our range is fully vegan; any product containing beeswax or honey is clearly labelled.",
      },
      {
        q: "How do I know which products are right for me?",
        a: "Each product page includes detailed information about skin type compatibility, key ingredients, and usage instructions. If you're unsure, reach out via our Contact page for a personalised recommendation.",
      },
      {
        q: "Do you use natural ingredients?",
        a: "Yes. We prioritise plant-based, sustainably sourced botanicals. Every ingredient is listed on the product page and packaging with full transparency.",
      },
      {
        q: "What is the shelf life of your products?",
        a: "Our products typically have a 12–24 month shelf life from production date. Once opened, we recommend using within 6–12 months for best results. Check the PAO (period-after-opening) symbol on packaging.",
      },
    ],
  },
  {
    id: "returns",
    label: "Returns",
    emoji: "↩️",
    items: [
      {
        q: "What is your return policy?",
        a: "We accept returns within 30 days of delivery for unopened, unused products in original packaging. Opened products can be returned if you have an adverse reaction — your skin health comes first.",
      },
      {
        q: "How do I initiate a return?",
        a: "Email us at support@skincare.com with your order number and reason for return. We'll send you a prepaid return label within 1–2 business days.",
      },
      {
        q: "When will I receive my refund?",
        a: "Refunds are processed within 3–5 business days of us receiving the returned item. The amount will be credited back to your original payment method.",
      },
      {
        q: "What if my order arrived damaged or incorrect?",
        a: "We're sorry about that! Please contact us within 48 hours with a photo of the issue and we'll send a replacement or full refund immediately — no need to return the item.",
      },
    ],
  },
  {
    id: "account",
    label: "Account",
    emoji: "👤",
    items: [
      {
        q: "How do I create an account?",
        a: "Click the user icon in the top navigation and select 'Register'. Fill in your name, email, and a secure password. You'll be up and running in under a minute.",
      },
      {
        q: "I forgot my password. What should I do?",
        a: "Click 'Forgot Password' on the login page and enter your email. We'll send you a secure reset link valid for 1 hour.",
      },
      {
        q: "How do I update my personal information?",
        a: "Log in and click your user icon, then select 'My Account'. From there you can update your name, email, and saved addresses.",
      },
      {
        q: "How do I delete my account?",
        a: "We're sorry to see you go! To delete your account and all associated data, please email us at support@skincare.com with the subject 'Account Deletion Request'.",
      },
    ],
  },
];

export default function FaqPage() {
  return (
    <div className="min-h-screen bg-[#faf9f7]">
      {/* HERO */}
      <section className="bg-gradient-to-br from-[#f5f2ed] via-[#faf9f7] to-[#f0dfe4]/30 px-6 py-16 text-center md:px-20 md:py-20">
        <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#e5e2dc] bg-white/80 px-4 py-1.5 text-sm text-[#8B7355]">
          <HelpCircle size={14} />
          FAQ
        </span>
        <h1 className="mt-4 font-[family-name:var(--font-luxury-serif)] text-5xl font-medium italic leading-tight text-[#6b5346] md:text-6xl">
          Frequently Asked
          <br />
          Questions
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-stone-500">
          Find quick answers to the most common questions about our products,
          orders, shipping, and more.
        </p>
      </section>

      <div className="mx-auto max-w-4xl px-6 py-14 md:px-20">
        {/* CATEGORY TABS */}
        <div className="mb-10 flex flex-wrap justify-center gap-2">
          {categories.map((cat) => (
            <a
              key={cat.id}
              href={`#${cat.id}`}
              className="rounded-full border border-[#e5e2dc] bg-white px-4 py-1.5 text-sm font-medium text-stone-600 transition hover:border-[#c9a8ad] hover:text-[#8f5f6a]"
            >
              {cat.emoji} {cat.label}
            </a>
          ))}
        </div>

        {/* ACCORDION SECTIONS */}
        <div className="space-y-12">
          {categories.map((cat) => (
            <section key={cat.id} id={cat.id} className="scroll-mt-20">
              <h2 className="mb-5 flex items-center gap-2 text-lg font-semibold text-gray-800">
                <span>{cat.emoji}</span>
                {cat.label}
              </h2>
              <FaqAccordion items={cat.items} />
            </section>
          ))}
        </div>

        {/* STILL HAVE QUESTIONS */}
        <div className="mt-16 rounded-3xl border border-[#e5e2dc] bg-white p-8 text-center shadow-sm">
          <HelpCircle className="mx-auto mb-4 h-10 w-10 text-[#c9a8ad]" />
          <h3 className="text-xl font-semibold text-gray-800">Still have questions?</h3>
          <p className="mx-auto mt-2 max-w-md text-sm text-stone-500">
            Can&apos;t find what you&apos;re looking for? Our support team is happy to help.
          </p>
          <a
            href="/contact"
            className="mt-6 inline-block rounded-xl bg-[#6b5346] px-7 py-3 text-sm font-medium text-white transition hover:bg-[#5c4a45]"
          >
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
}
