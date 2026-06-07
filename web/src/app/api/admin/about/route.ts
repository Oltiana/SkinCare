import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectDb } from "@/lib/server/db";
import { AboutPageContent } from "@/lib/server/models/AboutPage";

export async function GET() {
  try {
    await connectDb();
    const content = await AboutPageContent.findOne({ slug: "about" }).lean();

    return NextResponse.json({ ok: true, data: content ?? null });
  } catch (error) {
    console.error("GET /api/admin/about failed", error);
    return NextResponse.json(
      { ok: false, message: "Unable to load about page content." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 403 });
    }

    const body = await request.json();
    await connectDb();

    const payload = {
      slug: "about",
      ...body,
    };

    const content = await AboutPageContent.findOneAndUpdate(
      { slug: "about" },
      { $set: payload },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );

    return NextResponse.json({ ok: true, data: content });
  } catch (error) {
    console.error("POST /api/admin/about failed", error);
    return NextResponse.json(
      { ok: false, message: "Unable to save about page content." },
      { status: 500 },
    );
  }
}
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectDb } from "@/lib/server/db";
import { AboutPageContent } from "@/lib/server/models/AboutPage";

export async function GET() {
  try {
    await connectDb();
    const content = await AboutPageContent.findOne({ slug: "about" }).lean();

    return NextResponse.json({ ok: true, content });
  } catch (error) {
    console.error("About content fetch failed:", error);
    return NextResponse.json(
      { ok: false, message: "Unable to load content" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 403 });
    }

    const payload = await request.json();
    await connectDb();

    const data = {
      slug: "about",
      ...payload,
    };

    const content = await AboutPageContent.findOneAndUpdate(
      { slug: "about" },
      { $set: data },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );

    return NextResponse.json({ ok: true, content });
  } catch (error) {
    console.error("About content save failed:", error);
    return NextResponse.json(
      { ok: false, message: "Unable to save content" },
      { status: 500 },
    );
  }
}
