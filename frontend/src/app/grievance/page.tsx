import type { Metadata } from "next";
import CMSStaticPage from "@/components/CMSStaticPage";
import { serverFetch } from "@/lib/apiClient";
export async function generateMetadata(): Promise<Metadata> {
  const d = await serverFetch<any>("/content/page/grievance", { cache: "no-store" }).catch(() => null);
  return { title: d?.meta_title || "Grievance Redressal", description: d?.meta_description || "BODHIQ grievance process." };
}
export const dynamic = "force-dynamic";
export default function GrievancePage() {
  return <CMSStaticPage slug="grievance" eyebrow="Support" fallbackTitle="Grievance Redressal" />;
}
