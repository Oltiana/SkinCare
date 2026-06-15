import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectDb } from "@/lib/server/db";
import { FaqPageContent } from "@/lib/server/models/FaqPage";

export async function GET() {
  try {
    await connectDb();
    const content = await FaqPageContent.findOne({ slug: "faq" }).lean();

    return NextResponse.json({ ok: true, data: content ?? null });
  } catch (error) {
    console.error("GET /api/admin/faq failed", error);
    return NextResponse.json(
      { ok: false, message: "Unable to load FAQ page content." },
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
      slug: "faq",
      ...body,
    };

    const content = await FaqPageContent.findOneAndUpdate(
      { slug: "faq" },
      { $set: payload },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );

    return NextResponse.json({ ok: true, data: content });
  } catch (error) {
    console.error("POST /api/admin/faq failed", error);
    return NextResponse.json(
      { ok: false, message: "Unable to save FAQ page content." },
      { status: 500 },
    );
  }
}
