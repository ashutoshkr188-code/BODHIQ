/**
 * POST /api/address
 *
 * Creates a new shipping address for the authenticated user.
 * Forwards to FastAPI POST /api/v1/addresses with the Clerk JWT.
 */

import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { routeFetch } from "@/lib/apiClient";
import type { Address, CreateAddressPayload } from "@/types/api";

export async function POST(req: Request) {
  try {
    const { userId, getToken } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const {
      fullName,
      phone,
      street,
      city,
      state,
      postalCode,
      country,
      isDefault,
    } = body;

    if (!fullName || !phone || !street || !city || !state || !postalCode || !country) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 }
      );
    }

    const token = await getToken();
    if (!token) {
      return NextResponse.json({ error: "Could not obtain auth token" }, { status: 401 });
    }

    // Map camelCase frontend → snake_case FastAPI schema
    const payload: CreateAddressPayload = {
      full_name: fullName,
      phone,
      street,
      city,
      state,
      postal_code: postalCode,
      country,
      is_default: !!isDefault,
    };

    const created = await routeFetch<Address>("/addresses", token, {
      method: "POST",
      body: JSON.stringify(payload),
    });

    return NextResponse.json({ success: true, address: created });
  } catch (error) {
    console.error("Address save error:", error);
    return NextResponse.json(
      { error: "Failed to save address." },
      { status: 500 }
    );
  }
}


/**
 * GET /api/address
 *
 * Lists all addresses for the authenticated user.
 */
export async function GET() {
  try {
    const { userId, getToken } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = await getToken();
    if (!token) {
      return NextResponse.json({ error: "Could not obtain auth token" }, { status: 401 });
    }

    const addresses = await routeFetch<Address[]>("/addresses", token);

    return NextResponse.json(addresses);
  } catch (error) {
    console.error("Address fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch addresses." },
      { status: 500 }
    );
  }
}