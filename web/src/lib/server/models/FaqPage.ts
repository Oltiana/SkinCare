import { Schema, model, models } from "mongoose";

const FaqItemSchema = new Schema(
  {
    q: { type: String, required: true, trim: true },
    a: { type: String, required: true, trim: true },
  },
  { _id: false },
);

const FaqCategorySchema = new Schema(
  {
    id: { type: String, required: true, trim: true },
    label: { type: String, required: true, trim: true },
    emoji: { type: String, default: "❓" },
    items: { type: [FaqItemSchema], default: [] },
  },
  { _id: false },
);

const FaqPageSchema = new Schema(
  {
    slug: { type: String, unique: true, default: "faq" },
    heroTitle: { type: String, default: "Frequently Asked\nQuestions" },
    heroSubtitle: {
      type: String,
      default:
        "Find quick answers to the most common questions about our products, orders, shipping, and more.",
    },
    categories: { type: [FaqCategorySchema], default: [] },
    ctaTitle: { type: String, default: "Still have questions?" },
    ctaText: {
      type: String,
      default: "Can't find what you're looking for? Our support team is happy to help.",
    },
    ctaButtonText: { type: String, default: "Contact Support" },
    ctaButtonHref: { type: String, default: "/contact" },
  },
  { timestamps: true },
);

export const FaqPageContent =
  models.FaqPageContent ?? model("FaqPageContent", FaqPageSchema);
