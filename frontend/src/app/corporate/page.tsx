import { Metadata } from "next";
import PageHeader from "@/components/ui/PageHeader";
import AnimatedSection from "@/components/ui/AnimatedSection";
import SectionDivider from "@/components/ui/SectionDivider";

export const metadata: Metadata = {
  title: "Corporate Information",
  description:
    "BODHIQ corporate details — registered office, leadership, and organizational information for our luxury timepiece brand.",
  keywords: [
    "BODHIQ corporate",
    "company information",
    "registered office",
    "BODHIQ leadership",
  ],
  openGraph: {
    title: "Corporate Information — BODHIQ",
    description:
      "Learn about BODHIQ's corporate structure, leadership, and organizational details.",
  },
};

export default function CorporatePage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <PageHeader
        eyebrow="Corporate"
        title="Corporate Information"
        subtitle="Transparency and integrity are at the core of our operations. Here you'll find our official corporate details."
      />

      <section className="px-6 pb-24">
        <div className="max-w-4xl mx-auto">
          {/* Company Details */}
          <AnimatedSection>
            <div className="glass-card rounded-2xl p-8 md:p-10 mb-10">
              <h2 className="text-2xl font-serif mb-6 text-white">
                Company Details
              </h2>
              <div className="space-y-4">
                {[
                  { label: "Registered Name", value: "BODHIQ Private Limited" },
                  { label: "Type", value: "Private Limited Company" },
                  { label: "Industry", value: "Luxury Timepieces & Accessories" },
                  { label: "Founded", value: "2024" },
                  {
                    label: "Email",
                    value: "bodhiq.official@gmail.com",
                    isLink: true,
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex flex-col sm:flex-row sm:items-center justify-between py-3 border-b border-white/5 last:border-0"
                  >
                    <span className="text-gray-500 text-sm">{item.label}</span>
                    {item.isLink ? (
                      <a
                        href={`mailto:${item.value}`}
                        className="text-[#d4a853] text-sm hover:underline underline-offset-4"
                      >
                        {item.value}
                      </a>
                    ) : (
                      <span className="text-white text-sm">{item.value}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>

          <SectionDivider />

          {/* Mission & Vision */}
          <div className="grid md:grid-cols-2 gap-8">
            <AnimatedSection direction="left">
              <div className="glass-card rounded-2xl p-8 h-full">
                <span className="text-[#d4a853] text-xs uppercase tracking-[0.35em]">
                  Mission
                </span>
                <h3 className="text-xl font-serif mt-3 mb-4">
                  Crafting Meaning Through Time
                </h3>
                <p className="text-gray-400 leading-7 text-sm">
                  To create luxury timepieces that serve as instruments of
                  mindfulness — bridging ancient wisdom with precision
                  engineering, reminding each wearer that every moment is
                  precious.
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection direction="right">
              <div className="glass-card rounded-2xl p-8 h-full">
                <span className="text-[#d4a853] text-xs uppercase tracking-[0.35em]">
                  Vision
                </span>
                <h3 className="text-xl font-serif mt-3 mb-4">
                  India&apos;s Premier Luxury House
                </h3>
                <p className="text-gray-400 leading-7 text-sm">
                  To establish BODHIQ as India&apos;s most revered luxury brand —
                  synonymous with craftsmanship, philosophy, and timeless
                  elegance on the global stage.
                </p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </main>
  );
}
