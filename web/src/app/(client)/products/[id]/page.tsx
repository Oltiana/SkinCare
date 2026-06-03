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

async function getProduct(id: string) {
  const res = await fetch(
    `http://localhost:3000/api/products/${id}`,
    {
      cache: "no-store",
    }
  );

  return res.json();
}

async function getReviews(id: string) {
  const res = await fetch(
    `http://localhost:3000/api/reviews?productId=${id}`,
    {
      cache: "no-store",
    }
  );

  return res.json();
}

export default async function ProductDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const product = await getProduct(id);
  const reviews = await getReviews(id);

  if (!product || product.error) {
    return (
      <p className="p-10 text-red-500">
        Produkti nuk u gjet
      </p>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F9F9]">
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