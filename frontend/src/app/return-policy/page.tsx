import { Metadata } from "next";
import PageHeader from "@/components/ui/PageHeader";
import AnimatedSection from "@/components/ui/AnimatedSection";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Return & Refund Policy",
  description:
    "BODHIQ Return & Refund Policy — Understand our 7-day return window, refund process, and conditions for luxury timepiece returns.",
  keywords: [
    "BODHIQ returns",
    "refund policy",
    "watch return",
    "exchange policy",
  ],
  openGraph: {
    title: "Return & Refund Policy — BODHIQ",
    description:
      "Understand BODHIQ's return and refund process for luxury timepieces.",
  },
};

export default function ReturnPolicyPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <PageHeader
        eyebrow="Policies"
        title="Return & Refund Policy"
        subtitle="We want you to be completely satisfied with your BODHIQ purchase. If you're not, here's how we'll make it right."
      />

      <section className="px-6 pb-24">
        <div className="max-w-4xl mx-auto">
          {/* Return Window */}
          <AnimatedSection>
            <div className="glass-card rounded-2xl p-8 md:p-10 mb-12 text-center">
              <p className="text-[#d4a853] text-5xl md:text-6xl font-serif mb-2">7</p>
              <p className="text-lg font-serif mb-2">Day Return Window</p>
              <p className="text-gray-500 text-sm">
                From the date of delivery
              </p>
            </div>
          </AnimatedSection>

          {/* Conditions */}
          {[
            {
              title: "Return Eligibility",
              content: [
                "Product must be in its original, unworn condition",
                "All original packaging, tags, and accessories must be intact",
                "Return request must be initiated within 7 days of delivery",
                "Product must not show signs of wear, damage, or alteration",
                "Proof of purchase (order confirmation or invoice) is required",
              ],
            },
            {
              title: "Non-Returnable Items",
              content: [
                "Custom-engraved or personalized timepieces",
                "Products purchased during final sale or clearance events",
                "Items that have been resized, altered, or serviced externally",
                "Products damaged due to misuse, negligence, or accidents",
              ],
            },
            {
              title: "How to Initiate a Return",
              content: [
                "Email us at bodhiq.official@gmail.com with your order number and reason for return",
                "Our team will review and approve your request within 24 hours",
                "Once approved, you'll receive a prepaid return shipping label",
                "Pack the item securely in its original packaging",
                "Drop off the package at the nearest courier partner location",
              ],
            },
            {
              title: "Refund Process",
              content: [
                "Refunds are initiated after we receive and inspect the returned item",
                "Processing takes 7–10 business days from inspection approval",
                "Refund will be credited to the original payment method",
                "Shipping charges (if any) are non-refundable",
                "You'll receive email confirmation once the refund is processed",
              ],
            },
          ].map((section, i) => (
            <AnimatedSection key={section.title} delay={i * 0.05}>
              <div className="mb-10">
                <h2 className="text-xl md:text-2xl font-serif mb-5">
                  {section.title}
                </h2>
                <ul className="space-y-3">
                  {section.content.map((item, j) => (
                    <li
                      key={j}
                      className="flex items-start gap-3 text-gray-400 text-sm leading-7"
                    >
                      <span className="text-[#d4a853]/50 mt-2 shrink-0">
                        •
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </AnimatedSection>
          ))}

          {/* Related Links */}
          <AnimatedSection>
            <div className="flex flex-wrap gap-4 mt-8">
              <Link
                href="/shipping-policy"
                className="px-5 py-2.5 border border-white/10 rounded-full text-xs uppercase tracking-widest text-gray-400 hover:border-[#d4a853]/20 hover:text-[#d4a853] transition duration-300"
              >
                Shipping Policy
              </Link>
              <Link
                href="/payment-policy"
                className="px-5 py-2.5 border border-white/10 rounded-full text-xs uppercase tracking-widest text-gray-400 hover:border-[#d4a853]/20 hover:text-[#d4a853] transition duration-300"
              >
                Payment Policy
              </Link>
              <Link
                href="/grievance"
                className="px-5 py-2.5 border border-white/10 rounded-full text-xs uppercase tracking-widest text-gray-400 hover:border-[#d4a853]/20 hover:text-[#d4a853] transition duration-300"
              >
                Grievance Redressal
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </main>
  );
}
