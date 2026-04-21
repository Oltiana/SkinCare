"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import AddToCartButton from "@/components/client/AddToCartButton";
import AddReview from "@/components/client/AddReview";
import ReviewList from "@/components/client/ReviewList";

type Product = {
  _id: string;
  name: string;
  price: number;
  description: string;
  image: string;
};

export default function ProductDetail() {
  const params = useParams();
  const id = params?.id ? String(params.id) : "";

  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<any[]>([]);

  useEffect(() => {
    if (!id) return;

    fetch(`/api/products/${id}`)
      .then((res) => res.json())
      .then(setProduct);

    fetch(`/api/reviews?productId=${id}`)
      .then((res) => res.json())
      .then(setReviews);
  }, [id]);

  if (!id) return <p className="p-10">Loading...</p>;
  if (product === null) return <p className="p-10">Loading...</p>;
  if (!product || (product as any).error)
    return <p className="p-10 text-red-500">Produkti nuk u gjet</p>;

  return (
    <div className="min-h-screen bg-[#F9F9F9]">
      
      {/* CONTAINER */}
      <div className="max-w-6xl mx-auto flex items-start gap-32 p-10">

        {/* LEFT SIDE - BIG IMAGE */}
        <div className="bg-white rounded-2xl shadow-md p-6 w-[350px] h-[450px] flex items-center justify-center flex-shrink-0 overflow-hidden">
          <img
            src={
              product.image?.startsWith("http")
                ? product.image
                : `/${product.image}`
            }
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* RIGHT SIDE */}
        <div className="w-full max-w-xl">
          <h1 className="text-3xl font-semibold text-[#6b5346] mb-4">
            {product.name}
          </h1>

          <p className="text-gray-600 mb-6">
            {product.description}
          </p>

          <p className="text-2xl font-bold mb-6">
            €{product.price}
          </p>

          <div className="mb-8">
            <AddToCartButton product={product} />
          </div>

          {/* REVIEWS */}
          <div className="border-t pt-6">
            <h2 className="font-semibold text-lg mb-4">
              Reviews
            </h2>

            <AddReview productId={id} />
            <ReviewList reviews={reviews} />
          </div>
        </div>

      </div>
    </div>
  );
}