import type { Metadata } from "next";
import CMSStaticPage from "@/components/CMSStaticPage";
import { serverFetch } from "@/lib/apiClient";
export async function generateMetadata(): Promise<Metadata> {
  const d = await serverFetch<any>("/content/page/payment-policy", { cache: "no-store" }).catch(() => null);
  return { title: d?.meta_title || "Payment Policy", description: d?.meta_description || "BODHIQ payment terms." };
}
export const dynamic = "force-dynamic";
export default function PaymentPolicyPage() {
  return <CMSStaticPage slug="payment-policy" eyebrow="Policies" fallbackTitle="Payment Policy" />;
}
