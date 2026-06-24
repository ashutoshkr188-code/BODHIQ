import { Metadata } from "next";
import PageHeader from "@/components/ui/PageHeader";
import AnimatedSection from "@/components/ui/AnimatedSection";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Shipping Policy",
  description:
    "BODHIQ Shipping Policy — Learn about our delivery timelines, shipping methods, charges, and packaging standards for luxury timepieces.",
  keywords: [
    "BODHIQ shipping",
    "delivery policy",
    "watch shipping India",
    "luxury shipping",
  ],
  openGraph: {
    title: "Shipping Policy — BODHIQ",
    description:
      "Learn about BODHIQ's delivery timelines, shipping methods, and premium packaging standards.",
  },
};

const shippingDetails = [
  {
    title: "Delivery Timelines",
    items: [
      { label: "Standard Shipping", value: "5–7 business days" },
      { label: "Express Shipping", value: "2–3 business days" },
      { label: "Order Processing", value: "1–2 business days" },
      { label: "Same-day Dispatch", value: "Orders before 12 PM IST" },
    ],
  },
  {
    title: "Shipping Charges",
    items: [
      { label: "Standard Shipping", value: "Free on all orders" },
      { label: "Express Shipping", value: "₹249" },
      { label: "Insurance", value: "Included on all shipments" },
    ],
  },
];

export default function ShippingPolicyPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <PageHeader
        eyebrow="Policies"
        title="Shipping Policy"
        subtitle="Every BODHIQ timepiece is shipped with the care and attention it deserves — because the journey to you is part of the experience."
      />

      <section className="px-6 pb-24">
        <div className="max-w-4xl mx-auto">
          {/* Shipping Details Tables */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {shippingDetails.map((section) => (
              <AnimatedSection key={section.title}>
                <div className="glass-card rounded-2xl p-6 h-full">
                  <h2 className="text-lg font-serif mb-5">{section.title}</h2>
                  <div className="space-y-0">
                    {section.items.map((item) => (
                      <div
                        key={item.label}
                        className="flex items-center justify-between py-3 border-b border-white/5 last:border-0"
                      >
                        <span className="text-gray-400 text-sm">
                          {item.label}
                        </span>
                        <span className="text-white text-sm font-medium">
                          {item.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>

          {/* Additional Info */}
          {[
            {
              title: "Premium Packaging",
              content:
                "Every timepiece is housed in a signature BODHIQ box, wrapped in protective materials to ensure it arrives in perfect condition. Our packaging is designed to be as luxurious as the product itself — because first impressions matter.",
            },
            {
              title: "Order Tracking",
              content:
                "Once your order is dispatched, you'll receive a confirmation email with tracking details. You can also track your order anytime through your BODHIQ account dashboard or our Track Order page.",
            },
            {
              title: "Delivery Areas",
              content:
                "We currently deliver across all major cities and towns in India. For remote or rural areas, delivery may take an additional 2–3 business days. International shipping will be announced soon.",
            },
            {
              title: "Delivery Issues",
              content:
                "If your package is delayed, damaged, or lost in transit, please contact us immediately at bodhiq.official@gmail.com. We will initiate an investigation and ensure a resolution within 48 hours.",
            },
          ].map((item, i) => (
            <AnimatedSection key={item.title} delay={i * 0.05}>
              <div className="mb-10 pb-10 border-b border-white/5 last:border-0">
                <h2 className="text-xl font-serif mb-3">{item.title}</h2>
                <p className="text-gray-400 leading-8 text-sm">
                  {item.content}
                </p>
              </div>
            </AnimatedSection>
          ))}

          {/* Related Links */}
          <AnimatedSection>
            <div className="flex flex-wrap gap-4 mt-8">
              <Link
                href="/track-order"
                className="px-5 py-2.5 border border-[#d4a853]/20 rounded-full text-xs uppercase tracking-widest text-[#d4a853] hover:bg-[#d4a853] hover:text-black transition duration-300"
              >
                Track Your Order
              </Link>
              <Link
                href="/return-policy"
                className="px-5 py-2.5 border border-white/10 rounded-full text-xs uppercase tracking-widest text-gray-400 hover:border-[#d4a853]/20 hover:text-[#d4a853] transition duration-300"
              >
                Return Policy
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </main>
  );
}
