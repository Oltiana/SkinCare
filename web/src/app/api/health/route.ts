import { NextResponse } from "next/server";

/** Backend inside Next.js — CRUD, auth, etc. */
export async function GET() {
  return NextResponse.json({
    ok: true,
    service: "skincare-api",
    time: new Date().toISOString(),
  });
}
