export async function getProducts(search = "", category = "") {
  const res = await fetch(
    `/api/products?search=${search}&category=${category}`
  );
  return res.json();
}

export async function getProductById(id: string) {
  const res = await fetch(`/api/products/${id}`);
  return res.json();
}