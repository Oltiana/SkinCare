import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search");
    const category = searchParams.get("category");

    const query: Record<string, unknown> = {};

    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    if (category) {
      query.category = category;
    }

    const products = await Product.find(query);
    return NextResponse.json(products);
  } catch (error) {
    console.error("GET /api/products failed:", error);
    return NextResponse.json(
      { error: "Database is unavailable. Please try again later." },
      { status: 503 },
    );
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    const product = await Product.create(body);
    return NextResponse.json(product);
  } catch (error) {
    console.error("POST /api/products failed:", error);
    return NextResponse.json(
      { error: "Database is unavailable. Please try again later." },
      { status: 503 },
    );
  }
}