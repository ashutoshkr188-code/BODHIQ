import type { Metadata } from "next";
import CMSStaticPage from "@/components/CMSStaticPage";
import { serverFetch } from "@/lib/apiClient";
export async function generateMetadata(): Promise<Metadata> {
  const d = await serverFetch<any>("/content/page/privacy", { cache: "no-store" }).catch(() => null);
  return { title: d?.meta_title || "Privacy Policy", description: d?.meta_description || "BODHIQ privacy policy." };
}
export const dynamic = "force-dynamic";
export default function PrivacyPage() {
  return <CMSStaticPage slug="privacy" eyebrow="Legal" fallbackTitle="Privacy Policy" />;
}
