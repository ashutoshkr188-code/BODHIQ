import type { Metadata } from "next";
import CMSStaticPage from "@/components/CMSStaticPage";
import { serverFetch } from "@/lib/apiClient";
export async function generateMetadata(): Promise<Metadata> {
  const d = await serverFetch<any>("/content/page/values", { cache: "no-store" }).catch(() => null);
  return { title: d?.meta_title || "Our Values", description: d?.meta_description || "The values that drive BODHIQ." };
}
export const dynamic = "force-dynamic";
export default function ValuesPage() {
  return <CMSStaticPage slug="values" eyebrow="Philosophy" fallbackTitle="Our Values" />;
}
