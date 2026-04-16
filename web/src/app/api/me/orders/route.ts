import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectDb } from "@/lib/server/db";
import { Order } from "@/lib/server/models/Order";

type IncomingLine = {
  name?: unknown;
  quantity?: unknown;
  priceCents?: unknown;
};

function parseItems(raw: unknown): { name: string; quantity: number; priceCents?: number }[] | null {
  if (!Array.isArray(raw) || raw.length === 0) return null;
  const out: { name: string; quantity: number; priceCents?: number }[] = [];
  for (const row of raw) {
    const line = row as IncomingLine;
    const name = typeof line.name === "string" ? line.name.trim() : "";
    const q = typeof line.quantity === "number" ? line.quantity : Number(line.quantity);
    if (!name || !Number.isFinite(q) || q < 1 || !Number.isInteger(q)) return null;
    let priceCents: number | undefined;
    if (line.priceCents != null) {
      const p = typeof line.priceCents === "number" ? line.priceCents : Number(line.priceCents);
      if (!Number.isFinite(p) || p < 0) return null;
      priceCents = Math.round(p);
    }
    out.push({ name, quantity: q, priceCents });
  }
  return out;
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  await connectDb();
  const rows = await Order.find({ user: session.user.id }).sort({ createdAt: -1 }).lean();

  return NextResponse.json({
    orders: rows.map((o) => ({
      id: o._id.toString(),
      createdAt: (o.createdAt as Date).toISOString(),
      items: (o.items as { name: string; quantity: number; priceCents?: number }[]).map((it) => ({
        name: it.name,
        quantity: it.quantity,
        priceCents: it.priceCents,
      })),
      totalCents: o.totalCents ?? null,
    })),
  });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const items = parseItems((body as { items?: unknown })?.items);
  if (!items) {
    return NextResponse.json({ error: "Invalid items list." }, { status: 400 });
  }

  const allPriced = items.every((i) => i.priceCents != null);
  const totalCents = allPriced
    ? items.reduce((sum, i) => sum + i.quantity * (i.priceCents as number), 0)
    : undefined;

  await connectDb();
  const doc = await Order.create({
    user: session.user.id,
    items,
    totalCents,
  });

  return NextResponse.json({
    order: {
      id: doc._id.toString(),
      createdAt: doc.createdAt.toISOString(),
      items: doc.items,
      totalCents: doc.totalCents ?? null,
    },
  });
}
