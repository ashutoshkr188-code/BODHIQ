import type { Metadata } from "next";
import CMSStaticPage from "@/components/CMSStaticPage";
import { serverFetch } from "@/lib/apiClient";
export async function generateMetadata(): Promise<Metadata> {
  const d = await serverFetch<any>("/content/page/knowledge", { cache: "no-store" }).catch(() => null);
  return { title: d?.meta_title || "Knowledge", description: d?.meta_description || "The BODHIQ knowledge base." };
}
export const dynamic = "force-dynamic";
export default function KnowledgePage() {
  return <CMSStaticPage slug="knowledge" eyebrow="Learn" fallbackTitle="Knowledge" />;
}
