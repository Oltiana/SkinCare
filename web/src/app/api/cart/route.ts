import { connectDB } from "@/lib/db";
import Cart from "@/models/Cart";
import { NextResponse } from "next/server";

// GET CART
export async function GET() {
  await connectDB();

  let cart = await Cart.findOne({ userId: "1" });

  if (!cart) {
    cart = await Cart.create({
      userId: "1",
      items: [],
    });
  }

  return NextResponse.json(cart);
}

// ADD / UPDATE CART
export async function POST(req: Request) {
  await connectDB();

  const body = await req.json();

  let cart = await Cart.findOne({ userId: "1" });

  if (!cart) {
    cart = await Cart.create({
      userId: "1",
      items: [],
    });
  }

  const exist = cart.items.find(
    (item: any) => item.productId === body.productId,
  );

  if (exist) {
    exist.quantity += 1;
  } else {
    cart.items.push({
      productId: body.productId,
      name: body.name,
      price: body.price,
      quantity: 1,
    });
  }

  await cart.save();

  return NextResponse.json(cart);
}

// DELETE ITEM
export async function DELETE(req: Request) {
  await connectDB();

  const { productId } = await req.json();

  let cart = await Cart.findOne({ userId: "1" });

  if (!cart) {
    return NextResponse.json({ items: [] });
  }

  cart.items = cart.items.filter((item: any) => item.productId !== productId);

  await cart.save();

  return NextResponse.json(cart);
}
