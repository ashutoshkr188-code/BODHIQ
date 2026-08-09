import type { Metadata } from "next";
import CMSStaticPage from "@/components/CMSStaticPage";
import { serverFetch } from "@/lib/apiClient";
export async function generateMetadata(): Promise<Metadata> {
  const d = await serverFetch<any>("/content/page/terms", { cache: "no-store" }).catch(() => null);
  return { title: d?.meta_title || "Terms & Conditions", description: d?.meta_description || "BODHIQ terms of service." };
}
export const dynamic = "force-dynamic";
export default function TermsPage() {
  return <CMSStaticPage slug="terms" eyebrow="Legal" fallbackTitle="Terms & Conditions" />;
}
