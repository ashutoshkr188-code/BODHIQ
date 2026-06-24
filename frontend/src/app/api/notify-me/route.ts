/**
 * POST /api/notify-me
 *
 * Saves a back-in-stock notification request.
 * Forwards to FastAPI POST /api/v1/notify — no auth required (email-based).
 */

import { NextResponse } from "next/server";
import { routeFetch } from "@/lib/apiClient";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { productId, productName, productSlug, email, clerkUserId } = body;

    if (!productId || !productName || !productSlug || !email) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    // Forward directly to FastAPI — no auth token needed for this endpoint
    const result = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"}/api/v1/notify`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_id: productId,
          product_name: productName,
          product_slug: productSlug,
          email,
          clerk_user_id: clerkUserId ?? null,
        }),
      }
    );

    if (!result.ok) {
      const text = await result.text().catch(() => "");
      throw new Error(`FastAPI ${result.status}: ${text}`);
    }

    const data = await result.json();

    return NextResponse.json({
      success: true,
      message: data.message ?? "Notification request saved.",
    });
  } catch (error) {
    console.error("Notify Me API Error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to save notification request.",
      },
      { status: 500 }
    );
  }
}