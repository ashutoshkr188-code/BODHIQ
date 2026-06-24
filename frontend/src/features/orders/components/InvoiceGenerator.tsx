"use client";

import dynamic from "next/dynamic";
import type { InvoiceOrder } from "@/types/api";

type InvoiceProps = {
  order: InvoiceOrder;
  buttonText?: string;
  variant?: "primary" | "secondary" | "outline";
};

const InvoiceGeneratorImpl = dynamic<InvoiceProps>(
  () => import("./InvoiceGeneratorImpl"),
  { ssr: false }
);

export default function InvoiceGenerator({
  order,
  buttonText = "Download Invoice",
  variant = "primary",
}: {
  order: InvoiceOrder;
  buttonText?: string;
  variant?: "primary" | "secondary" | "outline";
}) {
  return (
    <InvoiceGeneratorImpl
      order={order}
      buttonText={buttonText}
      variant={variant}
    />
  );
}
