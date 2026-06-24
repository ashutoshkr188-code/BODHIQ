import { Metadata } from "next";
import PageHeader from "@/components/ui/PageHeader";
import AnimatedSection from "@/components/ui/AnimatedSection";

export const metadata: Metadata = {
  title: "Disclaimer",
  description:
    "BODHIQ Disclaimer — Important notices regarding the use of our website, product information and liability.",
  keywords: ["BODHIQ disclaimer", "legal disclaimer", "website disclaimer"],
  openGraph: {
    title: "Disclaimer — BODHIQ",
    description:
      "Important legal notices regarding the use of BODHIQ website and product information.",
  },
};

const disclaimers = [
  {
    title: "General Information",
    content:
      "The content provided on the BODHIQ website is for general informational purposes only. While we strive to ensure accuracy, we make no warranties or representations regarding the completeness, accuracy, reliability, or suitability of the information presented.",
  },
  {
    title: "Product Representations",
    content:
      "Product images, colors, and specifications shown on our website are intended to be as accurate as possible. However, due to the handcrafted nature of our timepieces and variations in screen displays, actual products may differ slightly from their online representation.",
  },
  {
    title: "Pricing & Availability",
    content:
      "All prices displayed on our website are subject to change without prior notice. Product availability is not guaranteed and may vary. BODHIQ reserves the right to discontinue any product at any time.",
  },
  {
    title: "External Links",
    content:
      "Our website may contain links to third-party websites. BODHIQ has no control over the content, privacy policies, or practices of these external sites and assumes no responsibility for them.",
  },
  {
    title: "Limitation of Liability",
    content:
      "In no event shall BODHIQ, its directors, employees, or partners be liable for any direct, indirect, incidental, special, or consequential damages resulting from the use or inability to use our website or products.",
  },
  {
    title: "Professional Advice",
    content:
      "Nothing on this website constitutes professional, financial, or legal advice. Users should seek appropriate professional guidance before making decisions based on information found on our platform.",
  },
];

export default function DisclaimerPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <PageHeader
        eyebrow="Legal"
        title="Disclaimer"
        subtitle="Please read the following notices carefully before using our website and services."
      />

      <section className="px-6 pb-24">
        <div className="max-w-4xl mx-auto">
          {disclaimers.map((item, i) => (
            <AnimatedSection key={item.title} delay={i * 0.05}>
              <div className="mb-10 pb-10 border-b border-white/5 last:border-0">
                <h2 className="text-xl md:text-2xl font-serif mb-4 text-white">
                  {item.title}
                </h2>
                <p className="text-gray-400 leading-8 text-sm">
                  {item.content}
                </p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </section>
    </main>
  );
}
