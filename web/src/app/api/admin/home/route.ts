import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectDb } from "@/lib/server/db";
import { HomePageContent } from "@/lib/server/models/HomePage";

export async function GET() {
  try {
    await connectDb();
    const content = await HomePageContent.findOne({ slug: "home" }).lean();

    return NextResponse.json({ ok: true, data: content ?? null });
  } catch (error) {
    console.error("GET /api/admin/home failed", error);
    return NextResponse.json(
      { ok: false, message: "Unable to load home page content." },
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
      slug: "home",
      ...body,
    };

    const content = await HomePageContent.findOneAndUpdate(
      { slug: "home" },
      { $set: payload },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );

    return NextResponse.json({ ok: true, data: content });
  } catch (error) {
    console.error("POST /api/admin/home failed", error);
    return NextResponse.json(
      { ok: false, message: "Unable to save home page content." },
      { status: 500 },
    );
  }
}
