import type { Metadata } from "next";
import CMSStaticPage from "@/components/CMSStaticPage";
import { serverFetch } from "@/lib/apiClient";

export async function generateMetadata(): Promise<Metadata> {
  const d = await serverFetch<any>("/content/page/shipping-policy", { cache: "no-store" }).catch(() => null);
  return {
    title: d?.meta_title || "Shipping Policy",
    description: d?.meta_description || "Learn about BODHIQ shipping.",
  };
}
export const dynamic = "force-dynamic";
export default function ShippingPolicyPage() {
  return <CMSStaticPage slug="shipping-policy" eyebrow="Policies" fallbackTitle="Shipping Policy" />;
}
