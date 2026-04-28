export default function BestSellers() {
  const products = [
    {
      id: 1,
      name: "e.l.f. Vitamin C Serum",
      price: "€15",
      image:
        "https://m.media-amazon.com/images/I/71hmtyADfoL._AC_UF1000,1000_QL80_.jpg",
    },
    {
      id: 2,
      name: "Cleansing Gel Torriden",
      price: "€28",
      image:
        "https://co.nice-cdn.com/upload/image/product/large/default/torriden-balanceful-cleansing-gel-200-ml-589384-en.jpg",
    },
    {
      id: 3,
      name: "Beauty of Joseon Relief Sun SPF50+",
      price: "€22",
      image:
        "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcRZ4xdK0-iI-301tbIgFBBfcdZ9HwU8yM8sgLnroohRYFCUMHAR",
    },
    {
      id: 4,
      name: "Glow Recipe Watermelon",
      price: "€36",
      image:
        "https://www.gosupps.com/media/catalog/product/cache/25/image/1500x/040ec09b1e35df139433887a97daa66f/7/1/71_5VttZxoL._SL1188_.jpg",
    },
    {
      id: 5,
      name: "Glow Toner",
      price: "€18",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRsM35tegmZ36FvX0oSc3dlJJVoyI9GZJL4Iw&s",
    },
    {
      id: 6,
      name: "Skin Repair Oil",
      price: "€22",
      image:
        "https://glowatelier.com/cdn/shop/products/911-O-glow-atelier-liquid-repair-oil-veil-facial-oil-for-acne-prone-dry-sensitive-damaged-skin-1_grande.jpg?v=1692214867",
    },
  ];

  return (
    <>
      {products.map((p) => (
        <div
          key={p.id}
          className="min-w-[320px] rounded-xl border border-white/10 bg-white shadow-sm overflow-hidden hover:shadow-md transition"
        >
          {/* IMAGE */}
          <div className="h-52 w-full overflow-hidden">
            <img
              src={p.image}
              alt={p.name}
              className="w-full h-full object-cover hover:scale-105 transition duration-300"
            />
          </div>

          {/* CONTENT */}
          <div className="p-5 space-y-1">
            <h3 className="font-semibold text-gray-800">{p.name}</h3>
            <p className="text-gray-500 text-sm">{p.price}</p>
          </div>
        </div>
      ))}
    </>
  );
}
