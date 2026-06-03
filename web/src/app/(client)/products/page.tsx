import ProductsClient from "./ProductsClient";

async function getProducts() {
  const res = await fetch("http://localhost:3000/api/products", {
    cache: "no-store",
  });

  if (!res.ok) {
    return [];
  }

  const data = await res.json();

  return data.map((p: any) => ({
    ...p,
    _id: p._id?.$oid || p._id,
  }));
}

export default async function ProductsPage() {
  const products = await getProducts();

  return <ProductsClient initialProducts={products} />;
}