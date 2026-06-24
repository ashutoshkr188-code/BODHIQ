/**
 * POST /api/razorpay/verify
 *
 * 1. Verifies the Razorpay payment signature (stays in Next.js to keep secret safe)
 * 2. On valid signature → forwards order data to FastAPI POST /api/v1/orders
 *
 * The Clerk JWT is obtained server-side so FastAPI can authenticate the request
 * and link the order to the correct user in its database.
 */

import { NextResponse } from "next/server";
import crypto from "crypto";
import { auth } from "@clerk/nextjs/server";
import { routeFetch } from "@/lib/apiClient";
import type { Order, CreateOrderPayload } from "@/types/api";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      amount,
      currency,
      customerName,
      customerEmail,
      cartItems,
      shippingAddress,
    } = body;

    // ── 1. Verify Razorpay signature ──────────────────────────────────────────
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return NextResponse.json(
        { success: false, message: "Invalid payment signature" },
        { status: 400 }
      );
    }

    // ── 2. Get Clerk JWT so FastAPI can auth + create order under the right user ──
    const { getToken } = await auth();
    const token = await getToken();

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized — please sign in" },
        { status: 401 }
      );
    }

    // ── 3. Forward order creation to FastAPI ──────────────────────────────────
    const orderPayload: CreateOrderPayload = {
      razorpay_order_id,
      razorpay_payment_id,
      customer_name: customerName,
      customer_email: customerEmail,
      amount,
      currency: currency ?? "INR",
      cart_items: (cartItems ?? []).map(
        (item: { name: string; quantity: number; price: number }) => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        })
      ),
      shipping_address: shippingAddress
        ? {
            fullName: shippingAddress.fullName,
            street: shippingAddress.street,
            city: shippingAddress.city,
            state: shippingAddress.state,
            postalCode: shippingAddress.postalCode,
            country: shippingAddress.country,
            phone: shippingAddress.phone,
          }
        : {
            fullName: customerName,
            street: "",
            city: "",
            state: "",
            postalCode: "",
            country: "IN",
            phone: "",
          },
    };

    const createdOrder = await routeFetch<Order>("/orders", token, {
      method: "POST",
      body: JSON.stringify(orderPayload),
    });

    return NextResponse.json({
      success: true,
      message: "Payment verified & order saved",
      orderId: createdOrder.id,
      orderNumber: createdOrder.order_number,
    });
  } catch (error) {
    console.error("Verify route error:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Server error",
      },
      { status: 500 }
    );
  }
}