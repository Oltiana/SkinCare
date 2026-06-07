import Link from "next/link";
import { Leaf, ShieldCheck, Sparkles, Heart, Award, Users } from "lucide-react";
import { connectDb } from "@/lib/server/db";
import { AboutPageContent } from "@/lib/server/models/AboutPage";

const defaultStats = [
  { value: "2018", label: "Founded" },
  { value: "120+", label: "Products" },
  { value: "50k+", label: "Happy Customers" },
  { value: "30+", label: "Countries" },
];

const defaultValues = [
  {
    icon: Leaf,
    title: "Natural First",
    description:
      "Every formula starts with plant-based, sustainably sourced ingredients — no shortcuts, no fillers.",
    color: "text-green-600",
    bg: "bg-green-50",
  },
  {
    icon: ShieldCheck,
    title: "Science-Backed",
    description:
      "All products are dermatologist-tested and clinically validated for real, visible results.",
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    icon: Heart,
    title: "Cruelty-Free",
    description:
      "We never test on animals. Period. Beauty should never come at the cost of compassion.",
    color: "text-rose-500",
    bg: "bg-rose-50",
  },
  {
    icon: Sparkles,
    title: "Radiant Results",
    description:
      "We promise visible improvement within weeks — because you deserve skincare that works.",
    color: "text-purple-600",
    bg: "bg-purple-50",
  },
];

const defaultTeamMembers = [
  {
    name: "Alina Krasniqi",
    role: "Founder & CEO",
    bio: "Dermatologist with 15+ years of experience crafting clean beauty formulas.",
    initials: "AK",
    color: "bg-[#f0dfe4]",
  },
  {
    name: "Driton Berisha",
    role: "Head of R&D",
    bio: "Biochemist passionate about marrying science with nature for effective skincare.",
    initials: "DB",
    color: "bg-[#e8f0e8]",
  },
  {
    name: "Lira Musliu",
    role: "Creative Director",
    bio: "Brand visionary dedicated to sustainable packaging and clean aesthetics.",
    initials: "LM",
    color: "bg-[#e8eaf5]",
  },
  {
    name: "Erjon Hoxha",
    role: "Customer Experience Lead",
    bio: "Ensures every customer feels seen, heard, and glowing after every order.",
    initials: "EH",
    color: "bg-[#fdf3e7]",
  },
];

const iconMap = {
  Leaf,
  ShieldCheck,
  Sparkles,
  Heart,
};

function getIcon(name?: string) {
  return (iconMap as Record<string, typeof Leaf>)[name ?? "Leaf"] ?? Leaf;
}

export default async function AboutPage() {
  try {
    await connectDb();
  } catch (error) {
    console.error("About page DB load failed:", error);
  }

  const content = await AboutPageContent.findOne({ slug: "about" }).lean().catch(() => null);
  const stats = content?.stats?.length ? content.stats : defaultStats;
  const values = content?.values?.length ? content.values : defaultValues;
  const teamMembers = content?.teamMembers?.length ? content.teamMembers : defaultTeamMembers;
  const heroLines = (content?.heroTitle || "Beauty Rooted in Nature,\nPerfected by Science").split("\n");

  return (
    <div className="min-h-screen bg-[#faf9f7]">
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#f5f2ed] via-[#faf9f7] to-[#f0dfe4]/30 px-6 py-20 md:px-20 md:py-28">
        <div className="relative mx-auto max-w-4xl text-center">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#e5e2dc] bg-white/80 px-4 py-1.5 text-sm text-[#8B7355]">
            <Award size={14} />
            Our Story
          </span>
          <h1 className="mt-4 font-[family-name:var(--font-luxury-serif)] text-5xl font-medium italic leading-tight tracking-wide text-[#6b5346] md:text-6xl">
            {heroLines[0]}
            {heroLines[1] ? <><br />{heroLines[1]}</> : null}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-stone-500">
            {content?.heroSubtitle || "Since 2018, SkinCare has been on a mission to create premium skincare products that celebrate natural beauty — without compromising on effectiveness, ethics, or the environment."}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/products"
              className="rounded-xl bg-[#6b5346] px-7 py-3 text-sm font-medium text-white transition hover:bg-[#5c4a45]"
            >
              Explore Products
            </Link>
            <Link
              href="/contact"
              className="rounded-xl border border-[#e5e2dc] bg-white px-7 py-3 text-sm font-medium text-stone-700 transition hover:border-[#c9a8ad] hover:text-[#8f5f6a]"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="border-y border-[#e5e2dc] bg-white px-6 py-10 md:px-20">
        <div className="mx-auto grid max-w-4xl grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((s: any) => (
            <div key={s.label} className="text-center">
              <p className="font-[family-name:var(--font-luxury-serif)] text-4xl font-medium italic text-[#8B7355]">
                {s.value}
              </p>
              <p className="mt-1 text-sm text-stone-500">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="mx-auto max-w-6xl space-y-20 px-6 py-16 md:px-20">
        {/* OUR STORY */}
        <section className="grid items-center gap-12 md:grid-cols-2">
          <div className="space-y-5">
            <h2 className="font-[family-name:var(--font-luxury-serif)] text-4xl font-medium italic text-[#6b5346]">
              {content?.storyTitle || "How It All Began"}
            </h2>
            <p className="leading-relaxed text-stone-500">{content?.storyParagraph1 || "It started with a simple frustration: our founder couldn’t find skincare products that were both truly natural and genuinely effective."}</p>
            <p className="leading-relaxed text-stone-500">{content?.storyParagraph2 || "Armed with a background in dermatology and a deep love for botanical science, she partnered with biochemist Driton to build formulas from scratch."}</p>
            <p className="leading-relaxed text-stone-500">{content?.storyParagraph3 || "Today, SkinCare is trusted by over 50,000 customers across 30+ countries — and we’re just getting started."}</p>
          </div>
          <div className="relative">
            <div className="aspect-[4/3] overflow-hidden rounded-3xl bg-gradient-to-br from-[#f0dfe4] to-[#e8f0e8]">
              <div className="flex h-full items-center justify-center">
                <div className="space-y-3 text-center">
                  <Leaf className="mx-auto h-16 w-16 text-[#8B7355]/40" />
                  <p className="text-sm text-[#8B7355]/60">Est. 2018</p>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-4 -right-4 rounded-2xl border border-[#e5e2dc] bg-white px-5 py-4 shadow-md">
              <p className="text-2xl font-semibold text-[#8B7355]">50k+</p>
              <p className="text-xs text-stone-500">Glowing customers</p>
            </div>
          </div>
        </section>

        {/* MISSION & VISION */}
        <section className="grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-[#e5e2dc] bg-white p-8 shadow-sm">
            <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#f0dfe4]">
              <Heart className="h-5 w-5 text-[#8f5f6a]" />
            </div>
            <h3 className="mb-3 text-xl font-semibold text-gray-800">{content?.missionTitle || "Our Mission"}</h3>
            <p className="leading-relaxed text-stone-500">{content?.missionText || "To make premium, clean skincare accessible to everyone — creating products that honour your skin's natural biology while delivering results you can see and feel."}</p>
          </div>
          <div className="rounded-3xl border border-[#e5e2dc] bg-white p-8 shadow-sm">
            <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#e8f0e8]">
              <Sparkles className="h-5 w-5 text-green-600" />
            </div>
            <h3 className="mb-3 text-xl font-semibold text-gray-800">{content?.visionTitle || "Our Vision"}</h3>
            <p className="leading-relaxed text-stone-500">{content?.visionText || "A world where beauty routines are a celebration of self — where every product is transparent, effective, sustainable, and crafted with genuine care for people and planet."}</p>
          </div>
        </section>

        {/* VALUES */}
        <section className="space-y-8">
          <div className="text-center">
            <h2 className="font-[family-name:var(--font-luxury-serif)] text-4xl font-medium italic text-[#6b5346]">
              What We Stand For
            </h2>
            <p className="mt-3 text-stone-500">
              Our values aren&apos;t a marketing statement — they guide every decision we make.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v: any) => {
              const Icon = getIcon(v.icon);
              return (
                <div
                  key={v.title}
                  className="rounded-2xl border border-[#e5e2dc] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >
                  <div className={`mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl ${v.bg || "bg-green-50"}`}>
                    <Icon className={`h-5 w-5 ${v.color || "text-green-600"}`} />
                  </div>
                  <h3 className="mb-2 font-semibold text-gray-800">{v.title}</h3>
                  <p className="text-sm leading-relaxed text-stone-500">{v.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* TEAM */}
        <section className="space-y-8">
          <div className="text-center">
            <h2 className="font-[family-name:var(--font-luxury-serif)] text-4xl font-medium italic text-[#6b5346]">
              Meet the Team
            </h2>
            <p className="mt-3 text-stone-500">
              The passionate people behind every bottle, formula, and happy skin day.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {teamMembers.map((member: any) => (
              <div
                key={member.name}
                className="group rounded-2xl border border-[#e5e2dc] bg-white p-6 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div
                  className={`mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full ${member.color || "bg-[#f0dfe4]"} text-xl font-semibold text-stone-600`}
                >
                  {member.initials || member.name?.slice(0, 2).toUpperCase()}
                </div>
                <h3 className="font-semibold text-gray-800">{member.name}</h3>
                <p className="mt-1 text-sm font-medium text-[#8B7355]">{member.role}</p>
                <p className="mt-3 text-sm leading-relaxed text-stone-500">{member.bio}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="rounded-3xl bg-gradient-to-br from-[#6b5346] to-[#5c4a45] px-8 py-14 text-center text-white shadow-lg">
          <Users className="mx-auto mb-4 h-10 w-10 opacity-80" />
          <h2 className="font-[family-name:var(--font-luxury-serif)] text-4xl font-medium italic">
            Join Our Community
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-white/80">
            Thousands of people have already discovered the SkinCare difference.
            Your best skin is waiting.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/products"
              className="rounded-xl bg-white px-7 py-3 text-sm font-medium text-[#6b5346] transition hover:bg-[#f5f2ed]"
            >
              Shop Now
            </Link>
            <Link
              href="/contact"
              className="rounded-xl border border-white/30 px-7 py-3 text-sm font-medium text-white transition hover:border-white/60 hover:bg-white/10"
            >
              Contact Us
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}


