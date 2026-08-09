export async function createRazorpayOrder(amount: number) {
  const res = await fetch("/api/razorpay/order", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ amount }),
  });
  return res.json();
}

export async function verifyRazorpayOrder(payload: Record<string, unknown>) {
  const res = await fetch("/api/razorpay/verify", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  return res.json();
}
