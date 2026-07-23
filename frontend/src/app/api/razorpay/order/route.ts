import { razorpay } from "@/lib/razorpay";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { routeFetch } from "@/lib/apiClient";

interface CartItem {
  product_id: string;
  quantity: number;
}

interface VerifyTotalResponse {
  total: number;
  currency: string;
}

export async function POST(req: Request) {
  // ── 1. Require authentication (AUD-06) ──────────────────────────────────────
  const { userId, getToken } = await auth();
  if (!userId) {
    return NextResponse.json(
      { success: false, message: "Unauthorized — please sign in" },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();
    const { cartItems } = body as { cartItems: CartItem[] };

    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      return NextResponse.json(
        { success: false, message: "Cart is empty" },
        { status: 400 }
      );
    }

    // ── 2. Fetch authoritative total from backend (AUD-15) ───────────────────
    // Amount is computed from real DB prices — client cannot tamper with it.
    const token = await getToken();
    const verified = await routeFetch<VerifyTotalResponse>(
      "/cart/verify-total",
      token!,
      {
        method: "POST",
        body: JSON.stringify({
          items: cartItems.map((item) => ({
            product_id: item.product_id,
            quantity: item.quantity,
          })),
        }),
      }
    );

    const options = {
      amount: Math.round(verified.total * 100), // rupees → paise
      currency: verified.currency ?? "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Razorpay order error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create order" },
      { status: 500 }
    );
  }
}