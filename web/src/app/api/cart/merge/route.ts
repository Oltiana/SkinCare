/* import { connectDB } from "@/lib/db";
import Cart from "@/models/Cart";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function POST(req: Request) {
  await connectDB();
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Not logged in" }, { status: 401 });
  }

  const { items } = await req.json();
  const userId = session.user.id;

  let cart = await Cart.findOne({ userId });
  if (!cart) {
    cart = await Cart.create({ userId, items: [] });
  }

  for (const guestItem of items) {
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
  return NextResponse.json(cart);
}
*/
