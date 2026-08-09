import type { Metadata } from "next";
import CMSStaticPage from "@/components/CMSStaticPage";
import { serverFetch } from "@/lib/apiClient";
export async function generateMetadata(): Promise<Metadata> {
  const d = await serverFetch<any>("/content/page/return-policy", { cache: "no-store" }).catch(() => null);
  return { title: d?.meta_title || "Return Policy", description: d?.meta_description || "Learn about BODHIQ returns." };
}
export const dynamic = "force-dynamic";
export default function ReturnPolicyPage() {
  return <CMSStaticPage slug="return-policy" eyebrow="Policies" fallbackTitle="Return Policy" />;
}
