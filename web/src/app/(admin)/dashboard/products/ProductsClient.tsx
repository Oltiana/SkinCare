"use client";

import { useState } from "react";

type Product = {
  _id?: string;
  name: string;
  price: number | "";
  description: string;
  image: string;
};

export default function ProductsClient({
  initialProducts,
}: {
  initialProducts: Product[];
}) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState<Product>({
    name: "",
    price: "",
    description: "",
    image: "",
  });

  const [editingId, setEditingId] = useState<string | null>(null);

  // GET
  const fetchProducts = async () => {
    const res = await fetch("/api/products", { cache: "no-store" });

    if (!res.ok) {
      throw new Error("Unable to refresh products from the database.");
    }

    const data = await res.json();
    setProducts(data);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!form.name.trim() || !form.description.trim()) {
      setError("Please fill in the product name and description.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const payload = {
        ...form,
        price: Number(form.price),
      };

      const res = editingId
        ? await fetch(`/api/products/${editingId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          })
        : await fetch("/api/products", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Unable to save the product.");
      }

      setForm({
        name: "",
        price: "",
        description: "",
        image: "",
      });

      setEditingId(null);
      await fetchProducts();
    } catch (err: any) {
      setError(err.message || "Something went wrong while saving the product.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Unable to delete the product.");
      }

      await fetchProducts();
    } catch (err: any) {
      setError(err.message || "Something went wrong while deleting the product.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (p: Product) => {
    setEditingId(p._id || null);

    setForm({
      name: p.name,
      price: p.price,
      description: p.description,
      image: p.image,
    });
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">🛍️ Products Dashboard</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-2xl shadow-md space-y-4 max-w-xl"
      >
        {error ? (
          <p className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>
        ) : null}
        <input
          placeholder="Product name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full border p-3 rounded-lg"
        />

        <input
          type="number"
          placeholder="Price (€)"
          value={form.price}
          onChange={(e) =>
            setForm({
              ...form,
              price: e.target.value === "" ? "" : Number(e.target.value),
            })
          }
          className="w-full border p-3 rounded-lg"
        />

        <input
          placeholder="Image name (p.sh: hydrating-face-cream.jpg)"
          value={form.image}
          onChange={(e) => setForm({ ...form, image: e.target.value })}
          className="w-full border p-3 rounded-lg"
        />

        {form.image && (
          <img
            src={`/${form.image}`}
            className="h-32 rounded-lg object-cover border"
          />
        )}

        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
          className="w-full border p-3 rounded-lg"
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-green-500 text-white px-6 py-2 rounded-lg disabled:cursor-not-allowed disabled:bg-green-300"
        >
          {loading ? "Saving..." : editingId ? "Update Product" : "Add Product"}
        </button>
      </form>

      <div className="grid md:grid-cols-3 gap-6 mt-10">
        {products.map((p) => (
          <div
            key={p._id}
            className="bg-white rounded-2xl shadow-md overflow-hidden"
          >
            {p.image ? (
              <img
                src={`/${p.image}`}
                className="h-48 w-full object-cover"
              />
            ) : (
              <div className="h-48 bg-gray-200 flex items-center justify-center">
                No image
              </div>
            )}

            <div className="p-4">
              <h2 className="font-semibold">{p.name}</h2>
              <p className="text-sm text-gray-500">{p.description}</p>
              <p className="text-green-600 font-bold">€{p.price}</p>

              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => handleEdit(p)}
                  className="flex-1 bg-blue-500 text-white py-1 rounded"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(p._id)}
                  className="flex-1 bg-red-500 text-white py-1 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}