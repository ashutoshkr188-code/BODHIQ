import type { Metadata } from "next";
import CMSStaticPage from "@/components/CMSStaticPage";
import { serverFetch } from "@/lib/apiClient";
export async function generateMetadata(): Promise<Metadata> {
  const d = await serverFetch<any>("/content/page/download-app", { cache: "no-store" }).catch(() => null);
  return { title: d?.meta_title || "Download the App", description: d?.meta_description || "Download the BODHIQ app." };
}
export const dynamic = "force-dynamic";
export default function DownloadAppPage() {
  return <CMSStaticPage slug="download-app" eyebrow="Mobile" fallbackTitle="Download the App" />;
}
