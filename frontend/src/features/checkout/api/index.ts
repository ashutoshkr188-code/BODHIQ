interface CartItemForOrder {
  product_id: string;
  name: string;
  quantity: number;
  price: number;
}

export async function createRazorpayOrder(cartItems: CartItemForOrder[]) {
  const res = await fetch("/api/razorpay/order", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ cartItems }),
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
