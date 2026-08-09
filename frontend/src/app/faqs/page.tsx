import { Metadata } from "next";
import { serverFetch } from "@/lib/apiClient";
import PageHeader from "@/components/ui/PageHeader";
import FAQAccordion from "@/components/FAQAccordion";

interface FAQItem {
  id: number;
  question: string;
  answer: string;
  order: number;
  enabled: boolean;
  visibility?: Record<string, boolean>;
}

export const metadata: Metadata = {
  title: "FAQs",
  description: "Frequently asked questions about BODHIQ.",
};

export const dynamic = "force-dynamic";

export default async function FAQsPage() {
  const items = await serverFetch<FAQItem[]>("/content/faqs", { cache: "no-store" }).catch(() => null);

  const enabledItems = (items ?? [])
    .filter((i) => i.enabled !== false)
    .map((i) => {
      const v = i.visibility ?? {};
      return {
        ...i,
        question: v.question !== false ? i.question : null,
        answer: v.answer !== false ? i.answer : null,
      };
    })
    .filter((i) => i.question || i.answer); // Hide if both are disabled via visibility

  return (
    <main className="min-h-screen bg-black text-white">
      <PageHeader
        eyebrow="Support"
        title="Frequently Asked Questions"
        subtitle="Everything you need to know about BODHIQ."
      />

      <section className="px-6 pb-24">
        {enabledItems.length > 0 ? (
          <FAQAccordion items={enabledItems.map((i) => ({ question: i.question as string, answer: i.answer as string }))} />
        ) : (
          <div className="max-w-3xl mx-auto text-center text-gray-600 text-sm py-12">
            No FAQs available yet.
          </div>
        )}
      </section>
    </main>
  );
}
