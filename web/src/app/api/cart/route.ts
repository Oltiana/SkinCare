import { connectDB } from "@/lib/db";
import Cart from "@/models/Cart";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function GET() {
  await connectDB();
  const session = await auth();
  const userId = session?.user?.id ?? "guest";

  let cart = await Cart.findOne({ userId });

  // ✅ Nëse u bë login, transfero cart-in e guest-it
  if (session?.user?.id) {
    const guestCart = await Cart.findOne({ userId: "guest" });
    if (guestCart && guestCart.items.length > 0) {
      if (!cart) {
        cart = await Cart.create({ userId, items: [] });
      }
      // Bashko items e guest me ato të userit
      for (const guestItem of guestCart.items) {
        const exist = cart.items.find(
          (i: any) => i.productId === guestItem.productId,
        );
        if (exist) {
          exist.quantity += guestItem.quantity;
        } else {
          cart.items.push(guestItem);
        }
      }
      await cart.save();
      // Pastro cart-in e guest-it
      guestCart.items = [];
      await guestCart.save();
    }
  }

  if (!cart) {
    cart = await Cart.create({ userId, items: [] });
  }

  return NextResponse.json(cart);
}

export async function POST(req: Request) {
  await connectDB();
  const session = await auth();
  const userId = session?.user?.id ?? "guest";

  const body = await req.json();

  let cart = await Cart.findOne({ userId });
  if (!cart) {
    cart = await Cart.create({ userId, items: [] });
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

export async function DELETE(req: Request) {
  await connectDB();
  const session = await auth();
  const userId = session?.user?.id ?? "guest";

  const { productId } = await req.json();

  let cart = await Cart.findOne({ userId });
  if (!cart) return NextResponse.json({ items: [] });

  cart.items = cart.items.filter((item: any) => item.productId !== productId);
  await cart.save();

  return NextResponse.json(cart);
}
