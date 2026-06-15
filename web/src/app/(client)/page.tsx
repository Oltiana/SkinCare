import Link from "next/link";
import BestSellers from "@/components/client/BestSellers";
import BestSellersSlider from "@/components/client/BestSellersSlider";
import { Leaf, ShieldCheck, Sparkles, Truck } from "lucide-react";
import { connectDb } from "@/lib/server/db";
import { HomePageContent } from "@/lib/server/models/HomePage";
import {
  defaultHomeContent,
  defaultHomeFeatures,
  defaultTestimonials,
  defaultWhyChooseUs,
  type HomeFeature,
  type HomeTestimonial,
} from "@/lib/server/content/home-defaults";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";

type HomeProps = {
  searchParams: Promise<{ forbidden?: string }>;
};

const iconMap = {
  Leaf,
  ShieldCheck,
  Sparkles,
  Truck,
};

function getIcon(name?: string) {
  return (iconMap as Record<string, typeof Leaf>)[name ?? "Leaf"] ?? Leaf;
}

async function getBestSellerProducts() {
  try {
    await connectDB();
    const products = await Product.find({}).sort({ createdAt: -1 }).limit(6).lean();
    return JSON.parse(JSON.stringify(products));
  } catch (error) {
    console.error("Home page products load failed:", error);
    return [];
  }
}

export default async function Home({ searchParams }: HomeProps) {
  const sp = await searchParams;
  const forbidden = sp.forbidden === "1";

  try {
    await connectDb();
  } catch (error) {
    console.error("Home page DB load failed:", error);
  }

  const [content, products] = await Promise.all([
    HomePageContent.findOne({ slug: "home" }).lean().catch(() => null),
    getBestSellerProducts(),
  ]);

  const heroBadge = content?.heroBadge ?? defaultHomeContent.heroBadge;
  const heroTitle = content?.heroTitle ?? defaultHomeContent.heroTitle;
  const heroSubtitle = content?.heroSubtitle ?? defaultHomeContent.heroSubtitle;
  const heroCtaText = content?.heroCtaText ?? defaultHomeContent.heroCtaText;
  const heroCtaHref = content?.heroCtaHref ?? defaultHomeContent.heroCtaHref;
  const heroImageUrl = content?.heroImageUrl ?? defaultHomeContent.heroImageUrl;
  const heroImageBadge = content?.heroImageBadge ?? defaultHomeContent.heroImageBadge;
  const features: HomeFeature[] = content?.features?.length
    ? (content.features as HomeFeature[])
    : defaultHomeFeatures;
  const bestSellersTitle = content?.bestSellersTitle ?? defaultHomeContent.bestSellersTitle;
  const bestSellersSubtitle = content?.bestSellersSubtitle ?? defaultHomeContent.bestSellersSubtitle;
  const whyChooseUsTitle = content?.whyChooseUsTitle ?? defaultHomeContent.whyChooseUsTitle;
  const whyChooseUs: HomeFeature[] = content?.whyChooseUs?.length
    ? (content.whyChooseUs as HomeFeature[])
    : defaultWhyChooseUs;
  const testimonialsTitle = content?.testimonialsTitle ?? defaultHomeContent.testimonialsTitle;
  const testimonialsSubtitle = content?.testimonialsSubtitle ?? defaultHomeContent.testimonialsSubtitle;
  const testimonials: HomeTestimonial[] = content?.testimonials?.length
    ? (content.testimonials as HomeTestimonial[])
    : defaultTestimonials;
  const aboutTeaserTitle = content?.aboutTeaserTitle ?? defaultHomeContent.aboutTeaserTitle;
  const aboutTeaserText = content?.aboutTeaserText ?? defaultHomeContent.aboutTeaserText;
  const aboutTeaserCtaText = content?.aboutTeaserCtaText ?? defaultHomeContent.aboutTeaserCtaText;
  const aboutTeaserCtaHref = content?.aboutTeaserCtaHref ?? defaultHomeContent.aboutTeaserCtaHref;

  return (
    <div className="bg-[#faf9f7] min-h-screen px-6 md:px-20 py-12 space-y-16">
      {forbidden && (
        <div className="mx-auto max-w-md rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-center text-sm text-amber-900 shadow-sm">
          You don&apos;t have access to that page (admin role required).
        </div>
      )}

      <section className="animate-fade-in-up flex flex-col md:flex-row items-center gap-10 rounded-2xl border border-white/10 bg-white/70 shadow-sm p-10">
        <div className="max-w-xl space-y-5">
          <span className="inline-flex items-center gap-2 text-sm text-gray-500">
            <Sparkles size={16} /> {heroBadge}
          </span>

          <h1 className="text-5xl font-bold text-gray-800 leading-tight">{heroTitle}</h1>

          <p className="text-gray-500">{heroSubtitle}</p>

          <Link href={heroCtaHref}>
            <button className="mt-2 bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition">
              {heroCtaText}
            </button>
          </Link>
        </div>

        <div className="animate-gentle-float relative">
          <img
            src={heroImageUrl}
            alt="Skincare"
            className="w-[550px] rounded-2xl shadow-md"
          />

          <div className="absolute -bottom-4 -left-4 bg-white border border-white/10 shadow-sm px-4 py-2 rounded-xl text-sm text-gray-600">
            {heroImageBadge}
          </div>
        </div>
      </section>

      <section className="grid md:grid-cols-4 gap-6">
        {features.map((feature) => {
          const Icon = getIcon(feature.icon);
          return (
            <div
              key={feature.title}
              className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/70 p-5 shadow-sm"
            >
              <Icon className={feature.color || "text-green-600"} />
              <div>
                <h3 className="font-semibold">{feature.title}</h3>
                <p className="text-xs text-gray-500">{feature.description}</p>
              </div>
            </div>
          );
        })}
      </section>

      <section className="animate-fade-in-up rounded-2xl border border-white/10 bg-white/70 shadow-sm p-10 space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-semibold text-gray-800">{bestSellersTitle}</h2>
          <p className="text-gray-500">{bestSellersSubtitle}</p>
        </div>

        <BestSellersSlider>
          <BestSellers products={products} />
        </BestSellersSlider>
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/70 shadow-sm p-10 space-y-8">
        <h2 className="text-3xl font-semibold text-center text-gray-800">{whyChooseUsTitle}</h2>

        <div className="grid md:grid-cols-3 gap-8 text-center">
          {whyChooseUs.map((item) => {
            const Icon = getIcon(item.icon);
            return (
              <div
                key={item.title}
                className="p-6 rounded-xl border border-white/10 bg-white/60 shadow-sm"
              >
                <Icon className={`mx-auto mb-3 ${item.color || "text-green-600"}`} />
                <h3 className="font-semibold">{item.title}</h3>
                <p className="text-gray-500 mt-2 text-sm">{item.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/70 shadow-sm p-10 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-semibold text-gray-800">{testimonialsTitle}</h2>
          <p className="text-gray-500">{testimonialsSubtitle}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.author}
              className="p-6 rounded-xl border border-white/10 bg-white shadow-sm space-y-3"
            >
              <div className="text-yellow-500">★★★★★</div>
              <p className="text-gray-600 text-sm">&ldquo;{testimonial.quote}&rdquo;</p>
              <p className="font-semibold text-sm">{testimonial.author}</p>
              <p className="text-xs text-gray-400">{testimonial.badge}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="animate-fade-in-up rounded-2xl border border-white/10 bg-white/70 shadow-sm p-10 text-center space-y-5">
        <h2 className="text-3xl font-semibold text-gray-800">{aboutTeaserTitle}</h2>

        <p className="text-gray-500 max-w-2xl mx-auto">{aboutTeaserText}</p>

        <Link href={aboutTeaserCtaHref}>
          <button className="border border-gray-300 px-6 py-2 rounded-xl hover:bg-black hover:text-white transition">
            {aboutTeaserCtaText}
          </button>
        </Link>
      </section>
    </div>
  );
}
