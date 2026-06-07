import { ContactForm } from "@/components/client/contact-form";

const infoCards = [
  { title: "Visit us", text: "Rr. 28 Nëntori, Prishtina, Kosovo", accent: "Store" },
  { title: "Call us", text: "+383 44 000 000", accent: "Support" },
  { title: "Email us", text: "support@skincare.com", accent: "Response" },
];

export default function ContactPage() {
  return (
    <section className="min-h-[calc(100svh-3.5rem)] bg-[linear-gradient(180deg,#fffaf7_0%,#faf9f7_45%,#f5f1eb_100%)] px-4 py-12 text-stone-800 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-7 rounded-[32px] border border-[#efe6dc] bg-white/90 p-8 shadow-[0_18px_60px_rgba(111,84,68,0.10)] backdrop-blur md:p-10">
          <div className="space-y-4">
            <p className="text-sm uppercase tracking-[0.32em] text-[#8f5f6a]">Contact</p>
            <h1 className="max-w-xl text-4xl font-semibold tracking-tight text-stone-900 sm:text-5xl lg:text-[3rem]">
              Let&apos;s help you find the right ritual for your skin.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-stone-600">
              Need advice, a product recommendation, or help with an order? Send us a message and we’ll reply with a friendly, expert response.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
            {infoCards.map((card) => (
              <article key={card.title} className="rounded-[24px] border border-[#efe6dc] bg-[linear-gradient(180deg,#fffaf7_0%,#ffffff_100%)] p-5 shadow-sm">
                <p className="text-[11px] uppercase tracking-[0.28em] text-[#a07c74]">{card.accent}</p>
                <h2 className="mt-2 text-lg font-semibold text-stone-900">{card.title}</h2>
                <p className="mt-1 text-sm text-stone-600">{card.text}</p>
              </article>
            ))}
          </div>

          <div className="rounded-[24px] border border-[#efe6dc] bg-[#fffaf6] p-5 text-sm text-stone-600 shadow-sm">
            Typical reply time: within 24 hours during business days.
          </div>
        </div>

        <div className="rounded-[32px] border border-[#efe6dc] bg-white/90 p-4 shadow-[0_18px_60px_rgba(111,84,68,0.10)] backdrop-blur md:p-6">
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
