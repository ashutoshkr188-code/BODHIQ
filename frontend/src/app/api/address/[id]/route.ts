/**
 * DELETE /api/address/[id]
 * PUT    /api/address/[id]
 *
 * Delete or update a specific shipping address.
 * Forwards to FastAPI DELETE/PUT /api/v1/addresses/{id} with Clerk JWT.
 * Ownership is enforced on the FastAPI side (users can only touch their own addresses).
 */

import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { routeFetch } from "@/lib/apiClient";
import type { Address } from "@/types/api";

export async function DELETE(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { userId, getToken } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: addressId } = await context.params;

    if (!addressId) {
      return NextResponse.json(
        { error: "Address ID required" },
        { status: 400 }
      );
    }

    const token = await getToken();
    if (!token) {
      return NextResponse.json({ error: "Could not obtain auth token" }, { status: 401 });
    }

    // FastAPI returns 204 No Content on success; routeFetch handles non-ok as error
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"}/api/v1/addresses/${addressId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (res.status === 404) {
      return NextResponse.json({ error: "Address not found" }, { status: 404 });
    }
    if (res.status === 403) {
      return NextResponse.json({ error: "Not allowed" }, { status: 403 });
    }
    if (!res.ok) {
      throw new Error(`FastAPI ${res.status}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete address error:", error);
    return NextResponse.json(
      { error: "Failed to delete address." },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { userId, getToken } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: addressId } = await context.params;
    const body = await req.json();

    const token = await getToken();
    if (!token) {
      return NextResponse.json({ error: "Could not obtain auth token" }, { status: 401 });
    }

    // Map camelCase → snake_case for FastAPI
    const payload: Partial<{
      full_name: string;
      phone: string;
      street: string;
      city: string;
      state: string;
      postal_code: string;
      country: string;
      is_default: boolean;
    }> = {};

    if (body.fullName !== undefined) payload.full_name = body.fullName;
    if (body.phone !== undefined) payload.phone = body.phone;
    if (body.street !== undefined) payload.street = body.street;
    if (body.city !== undefined) payload.city = body.city;
    if (body.state !== undefined) payload.state = body.state;
    if (body.postalCode !== undefined) payload.postal_code = body.postalCode;
    if (body.country !== undefined) payload.country = body.country;
    if (body.isDefault !== undefined) payload.is_default = body.isDefault;

    const updated = await routeFetch<Address>(
      `/addresses/${addressId}`,
      token,
      {
        method: "PUT",
        body: JSON.stringify(payload),
      }
    );

    return NextResponse.json({ success: true, address: updated });
  } catch (error) {
    console.error("Update address error:", error);
    return NextResponse.json(
      { error: "Failed to update address." },
      { status: 500 }
    );
  }
}