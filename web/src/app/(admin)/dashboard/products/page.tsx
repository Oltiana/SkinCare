import ProductsClient from "./ProductsClient";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";

async function getProducts() {
  try {
    await connectDB();

    const products = await Product.find({})
      .sort({ createdAt: -1 })
      .lean();

    return JSON.parse(JSON.stringify(products));
  } catch (error) {
    console.error("Failed to load products for admin dashboard:", error);
    return [];
  }
}

export default async function ProductsPage() {
  const products = await getProducts();

  return <ProductsClient initialProducts={products} />;
}