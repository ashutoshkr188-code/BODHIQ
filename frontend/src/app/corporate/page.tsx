import type { Metadata } from "next";
import CMSStaticPage from "@/components/CMSStaticPage";
import { serverFetch } from "@/lib/apiClient";
export async function generateMetadata(): Promise<Metadata> {
  const d = await serverFetch<any>("/content/page/corporate", { cache: "no-store" }).catch(() => null);
  return { title: d?.meta_title || "Corporate Gifting", description: d?.meta_description || "BODHIQ corporate gifting." };
}
export const dynamic = "force-dynamic";
export default function CorporatePage() {
  return <CMSStaticPage slug="corporate" eyebrow="Business" fallbackTitle="Corporate Gifting" />;
}
