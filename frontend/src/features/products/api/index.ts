export async function notifyMe(email: string, productId: string) {
  const res = await fetch("/api/notify-me", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, productId }),
  });
  return res.json();
}
