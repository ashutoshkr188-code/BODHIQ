import type { Metadata } from "next";
import CMSStaticPage from "@/components/CMSStaticPage";
import { serverFetch } from "@/lib/apiClient";
export async function generateMetadata(): Promise<Metadata> {
  const d = await serverFetch<any>("/content/page/media", { cache: "no-store" }).catch(() => null);
  return { title: d?.meta_title || "Media", description: d?.meta_description || "BODHIQ in the media." };
}
export const dynamic = "force-dynamic";
export default function MediaPage() {
  return <CMSStaticPage slug="media" eyebrow="Press" fallbackTitle="Media" />;
}
