import { HelpCircle } from "lucide-react";
import FaqAccordion from "./FaqAccordion";
import { connectDb } from "@/lib/server/db";
import { FaqPageContent } from "@/lib/server/models/FaqPage";
import {
  defaultFaqCategories,
  defaultFaqContent,
  type FaqCategory,
} from "@/lib/server/content/faq-defaults";

export const metadata = {
  title: "FAQ | SkinCare",
  description: "Frequently asked questions about SkinCare products, orders, shipping and more.",
};

export default async function FaqPage() {
  try {
    await connectDb();
  } catch (error) {
    console.error("FAQ page DB load failed:", error);
  }

  const content = await FaqPageContent.findOne({ slug: "faq" }).lean().catch(() => null);
  const heroTitle = content?.heroTitle ?? defaultFaqContent.heroTitle;
  const heroSubtitle = content?.heroSubtitle ?? defaultFaqContent.heroSubtitle;
  const categories: FaqCategory[] = content?.categories?.length
    ? (content.categories as FaqCategory[])
    : defaultFaqCategories;
  const ctaTitle = content?.ctaTitle ?? defaultFaqContent.ctaTitle;
  const ctaText = content?.ctaText ?? defaultFaqContent.ctaText;
  const ctaButtonText = content?.ctaButtonText ?? defaultFaqContent.ctaButtonText;
  const ctaButtonHref = content?.ctaButtonHref ?? defaultFaqContent.ctaButtonHref;
  const heroLines = heroTitle.split("\n");

  return (
    <div className="min-h-screen bg-[#faf9f7]">
      <section className="bg-gradient-to-br from-[#f5f2ed] via-[#faf9f7] to-[#f0dfe4]/30 px-6 py-16 text-center md:px-20 md:py-20">
        <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#e5e2dc] bg-white/80 px-4 py-1.5 text-sm text-[#8B7355]">
          <HelpCircle size={14} />
          FAQ
        </span>
        <h1 className="mt-4 font-[family-name:var(--font-luxury-serif)] text-5xl font-medium italic leading-tight text-[#6b5346] md:text-6xl">
          {heroLines[0]}
          {heroLines[1] ? (
            <>
              <br />
              {heroLines[1]}
            </>
          ) : null}
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-stone-500">{heroSubtitle}</p>
      </section>

      <div className="mx-auto max-w-4xl px-6 py-14 md:px-20">
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

        <div className="mt-16 rounded-3xl border border-[#e5e2dc] bg-white p-8 text-center shadow-sm">
          <HelpCircle className="mx-auto mb-4 h-10 w-10 text-[#c9a8ad]" />
          <h3 className="text-xl font-semibold text-gray-800">{ctaTitle}</h3>
          <p className="mx-auto mt-2 max-w-md text-sm text-stone-500">{ctaText}</p>
          <a
            href={ctaButtonHref}
            className="mt-6 inline-block rounded-xl bg-[#6b5346] px-7 py-3 text-sm font-medium text-white transition hover:bg-[#5c4a45]"
          >
            {ctaButtonText}
          </a>
        </div>
      </div>
    </div>
  );
}
