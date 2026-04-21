import AddToCartButton from "./AddToCartButton";

export default function ProductCard({ product }: any) {
  return (
    <div style={{ border: "1px solid #ddd", padding: "10px" }}>
      <img src={product.image} width={120} />
      <h3>{product.name}</h3>
      <p>{product.price}€</p>

      <AddToCartButton product={product} />
    </div>
  );
}