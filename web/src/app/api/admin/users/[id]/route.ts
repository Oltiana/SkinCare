import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectDb } from "@/lib/server/db";
import { User } from "@/lib/server/models/User";

type RouteContext = { params: Promise<{ id: string }> };

export async function DELETE(_req: Request, context: RouteContext) {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  const { id } = await context.params;
  if (!mongoose.isValidObjectId(id)) {
    return NextResponse.json({ error: "ID e pavlefshme." }, { status: 400 });
  }

  if (session.user.id === id) {
    return NextResponse.json({ error: "You cannot delete your own account." }, { status: 400 });
  }

  await connectDb();
  const deleted = await User.findByIdAndDelete(id);
  if (!deleted) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
