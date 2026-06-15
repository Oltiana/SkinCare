import { Schema, model, models } from "mongoose";

const FeatureSchema = new Schema(
  {
    icon: { type: String, default: "Leaf" },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    color: { type: String, default: "text-green-600" },
  },
  { _id: false },
);

const WhyChooseUsSchema = new Schema(
  {
    icon: { type: String, default: "Leaf" },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    color: { type: String, default: "text-green-600" },
  },
  { _id: false },
);

const TestimonialSchema = new Schema(
  {
    quote: { type: String, required: true, trim: true },
    author: { type: String, required: true, trim: true },
    badge: { type: String, default: "Verified Buyer", trim: true },
  },
  { _id: false },
);

const HomePageSchema = new Schema(
  {
    slug: { type: String, unique: true, default: "home" },
    heroBadge: { type: String, default: "Premium Skincare Collection" },
    heroTitle: { type: String, default: "Glow Naturally with Premium Skincare" },
    heroSubtitle: {
      type: String,
      default:
        "Discover high-quality skincare products designed to nourish and protect your skin every day.",
    },
    heroCtaText: { type: String, default: "Explore Products" },
    heroCtaHref: { type: String, default: "/products" },
    heroImageUrl: {
      type: String,
      default: "https://www.shutterstock.com/shutterstock/videos/3694129327/thumb/1.jpg?ip=x480",
    },
    heroImageBadge: { type: String, default: "✨ Glow formula" },
    features: { type: [FeatureSchema], default: [] },
    bestSellersTitle: { type: String, default: "Best Sellers" },
    bestSellersSubtitle: { type: String, default: "Our most loved skincare products" },
    whyChooseUsTitle: { type: String, default: "Why Choose Us" },
    whyChooseUs: { type: [WhyChooseUsSchema], default: [] },
    testimonialsTitle: { type: String, default: "What Our Customers Say" },
    testimonialsSubtitle: { type: String, default: "Real feedback from verified customers" },
    testimonials: { type: [TestimonialSchema], default: [] },
    aboutTeaserTitle: { type: String, default: "About Us" },
    aboutTeaserText: {
      type: String,
      default:
        "We create premium skincare products with natural ingredients and science-backed formulas for all skin types.",
    },
    aboutTeaserCtaText: { type: String, default: "Learn More" },
    aboutTeaserCtaHref: { type: String, default: "/about" },
  },
  { timestamps: true },
);

export const HomePageContent =
  models.HomePageContent ?? model("HomePageContent", HomePageSchema);
