export type HomeFeature = {
  icon: string;
  title: string;
  description: string;
  color: string;
};

export type HomeTestimonial = {
  quote: string;
  author: string;
  badge: string;
};

export const defaultHomeFeatures: HomeFeature[] = [
  { icon: "Leaf", title: "Natural", description: "Clean ingredients", color: "text-green-600" },
  { icon: "ShieldCheck", title: "Safe", description: "Dermatologist tested", color: "text-blue-600" },
  { icon: "Sparkles", title: "Glow", description: "Visible results", color: "text-purple-600" },
  { icon: "Truck", title: "Fast delivery", description: "Across Europe", color: "text-orange-500" },
];

export const defaultWhyChooseUs: HomeFeature[] = [
  {
    icon: "Leaf",
    title: "Natural Ingredients",
    description: "Safe formulas made with nature in mind.",
    color: "text-green-600",
  },
  {
    icon: "ShieldCheck",
    title: "Dermatologist Approved",
    description: "Tested and trusted by skincare experts.",
    color: "text-blue-600",
  },
  {
    icon: "Sparkles",
    title: "Visible Results",
    description: "See improvement in just a few weeks.",
    color: "text-purple-600",
  },
];

export const defaultTestimonials: HomeTestimonial[] = [
  {
    quote: "After 2 weeks my skin is much smoother and hydrated.",
    author: "Elira M.",
    badge: "Verified Buyer",
  },
  {
    quote: "Great quality and fast delivery. Very gentle on skin.",
    author: "Arta K.",
    badge: "Verified Buyer",
  },
  {
    quote: "No irritation at all. Finally found the right product.",
    author: "Dren B.",
    badge: "Verified Buyer",
  },
];

export const defaultHomeContent = {
  slug: "home",
  heroBadge: "Premium Skincare Collection",
  heroTitle: "Glow Naturally with Premium Skincare",
  heroSubtitle:
    "Discover high-quality skincare products designed to nourish and protect your skin every day.",
  heroCtaText: "Explore Products",
  heroCtaHref: "/products",
  heroImageUrl: "https://www.shutterstock.com/shutterstock/videos/3694129327/thumb/1.jpg?ip=x480",
  heroImageBadge: "✨ Glow formula",
  features: defaultHomeFeatures,
  bestSellersTitle: "Best Sellers",
  bestSellersSubtitle: "Our most loved skincare products",
  whyChooseUsTitle: "Why Choose Us",
  whyChooseUs: defaultWhyChooseUs,
  testimonialsTitle: "What Our Customers Say",
  testimonialsSubtitle: "Real feedback from verified customers",
  testimonials: defaultTestimonials,
  aboutTeaserTitle: "About Us",
  aboutTeaserText:
    "We create premium skincare products with natural ingredients and science-backed formulas for all skin types.",
  aboutTeaserCtaText: "Learn More",
  aboutTeaserCtaHref: "/about",
};
