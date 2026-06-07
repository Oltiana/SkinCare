import mongoose, { Schema, model, models } from "mongoose";

const StatSchema = new Schema(
  {
    value: { type: String, required: true, trim: true },
    label: { type: String, required: true, trim: true },
  },
  { _id: false },
);

const ValueSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    icon: { type: String, default: "Leaf" },
    color: { type: String, default: "text-green-600" },
    bg: { type: String, default: "bg-green-50" },
  },
  { _id: false },
);

const TeamMemberSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true },
    bio: { type: String, required: true, trim: true },
    initials: { type: String, required: true, trim: true },
    color: { type: String, default: "bg-[#f0dfe4]" },
  },
  { _id: false },
);

const AboutPageSchema = new Schema(
  {
    slug: { type: String, unique: true, default: "about" },
    heroTitle: { type: String, default: "Beauty Rooted in Nature, Perfected by Science" },
    heroSubtitle: {
      type: String,
      default:
        "Since 2018, SkinCare has been on a mission to create premium skincare products that celebrate natural beauty — without compromising on effectiveness, ethics, or the environment.",
    },
    storyTitle: { type: String, default: "How It All Began" },
    storyParagraph1: {
      type: String,
      default:
        "It started with a simple frustration: our founder couldn’t find skincare products that were both truly natural and genuinely effective.",
    },
    storyParagraph2: {
      type: String,
      default:
        "Armed with a background in dermatology and a deep love for botanical science, she partnered with biochemist Driton to build formulas from scratch.",
    },
    storyParagraph3: {
      type: String,
      default:
        "Today, SkinCare is trusted by over 50,000 customers across 30+ countries — and we’re just getting started.",
    },
    missionTitle: { type: String, default: "Our Mission" },
    missionText: {
      type: String,
      default:
        "To make premium, clean skincare accessible to everyone — creating products that honour your skin's natural biology while delivering results you can see and feel.",
    },
    visionTitle: { type: String, default: "Our Vision" },
    visionText: {
      type: String,
      default:
        "A world where beauty routines are a celebration of self — where every product is transparent, effective, sustainable, and crafted with genuine care for people and planet.",
    },
    stats: { type: [StatSchema], default: [] },
    values: { type: [ValueSchema], default: [] },
    teamMembers: { type: [TeamMemberSchema], default: [] },
  },
  { timestamps: true },
);

export const AboutPageContent =
  models.AboutPageContent ?? model("AboutPageContent", AboutPageSchema);
