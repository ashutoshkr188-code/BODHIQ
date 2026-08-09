import type { Metadata } from "next";
import CMSStaticPage from "@/components/CMSStaticPage";
import { serverFetch } from "@/lib/apiClient";
export async function generateMetadata(): Promise<Metadata> {
  const d = await serverFetch<any>("/content/page/disclaimer", { cache: "no-store" }).catch(() => null);
  return { title: d?.meta_title || "Disclaimer", description: d?.meta_description || "BODHIQ disclaimer." };
}
export const dynamic = "force-dynamic";
export default function DisclaimerPage() {
  return <CMSStaticPage slug="disclaimer" eyebrow="Legal" fallbackTitle="Disclaimer" />;
}
