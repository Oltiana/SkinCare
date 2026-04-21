export async function getReviews(productId: string) {
  const res = await fetch(`/api/reviews?productId=${productId}`);
  return res.json();
}

export async function addReview(data: any) {
  const res = await fetch("/api/reviews", {
    method: "POST",
    body: JSON.stringify(data),
  });

  return res.json();
}