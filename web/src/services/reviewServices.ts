export async function getReviews(productId: string) {
  const res = await fetch(`/api/reviews?productId=${productId}`);
  return res.json();
}

export async function addReview(data: any) {
  const res = await fetch("/api/reviews", {
    method: "POST",
    headers: {
      "Content-Type": "application/json", // 🔥 FIX
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("ADD REVIEW ERROR:", text);
    throw new Error("Failed to add review");
  }

  return res.json();
}