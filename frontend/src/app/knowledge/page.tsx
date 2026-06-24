import { Metadata } from "next";
import PageHeader from "@/components/ui/PageHeader";
import AnimatedSection from "@/components/ui/AnimatedSection";
import SectionDivider from "@/components/ui/SectionDivider";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Knowledge — The Art of Horology",
  description:
    "Explore the world of watchmaking with BODHIQ — Learn about movements, materials, craftsmanship, and the philosophy behind luxury timepieces.",
  keywords: [
    "watch knowledge",
    "horology",
    "watchmaking",
    "mechanical movements",
    "luxury watch education",
  ],
  openGraph: {
    title: "Knowledge — The Art of Horology | BODHIQ",
    description:
      "Explore the world of watchmaking with BODHIQ — Learn about movements, materials, and craftsmanship.",
    images: ["/watches/watch-detail.jpg"],
  },
};

const topics = [
  {
    title: "Mechanical Movements",
    description:
      "The heart of every BODHIQ timepiece. A mechanical movement is a marvel of micro-engineering — hundreds of tiny components working in perfect harmony, powered not by batteries, but by the energy of your own motion.",
    details: [
      "Automatic (self-winding) mechanisms that convert wrist movement into energy",
      "Hand-wound movements for purists who appreciate the ritual of winding",
      "Over 100 individual parts machined to tolerances of 1/100th of a millimeter",
    ],
  },
  {
    title: "Premium Materials",
    description:
      "The choice of materials defines the character of a timepiece. At BODHIQ, we select each material not just for its beauty, but for its story and endurance.",
    details: [
      "316L surgical-grade stainless steel for durability and hypoallergenic comfort",
      "Sapphire crystal glass — second only to diamond in hardness",
      "Genuine leather straps sourced from responsible tanneries",
      "Premium ceramic bezels resistant to scratches and fading",
    ],
  },
  {
    title: "Water Resistance",
    description:
      "Understanding water resistance ratings helps you choose the right timepiece for your lifestyle. Water resistance is tested under controlled laboratory conditions.",
    details: [
      "3 ATM (30m) — Splash-proof, suitable for everyday wear",
      "5 ATM (50m) — Safe for swimming in shallow water",
      "10 ATM (100m) — Suitable for recreational swimming and snorkeling",
      "Always rinse with fresh water after saltwater exposure",
    ],
  },
  {
    title: "Watch Care & Maintenance",
    description:
      "A well-maintained timepiece can last generations. Here's how to ensure your BODHIQ watch stands the test of time.",
    details: [
      "Service your mechanical watch every 3–5 years",
      "Avoid extreme temperature changes that can affect accuracy",
      "Store in a cool, dry place away from magnetic fields",
      "Clean with a soft, lint-free cloth to maintain its luster",
      "Wind manual watches at the same time each day for consistent accuracy",
    ],
  },
];

export default function KnowledgePage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <PageHeader
        eyebrow="Education"
        title="The Art of Horology"
        subtitle="Understanding the craft behind your timepiece deepens your connection to it. Explore the world of watchmaking with BODHIQ."
      />

      {/* Hero Image */}
      <section className="px-6 pb-16">
        <div className="max-w-5xl mx-auto">
          <AnimatedSection>
            <div className="relative h-[300px] md:h-[400px] rounded-2xl overflow-hidden border border-[#d4a853]/10">
              <Image
                src="/watches/watch-detail.jpg"
                alt="BODHIQ watch craftsmanship — detailed view of watchmaking artistry"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 p-8">
                <p className="text-xs uppercase tracking-[0.35em] text-[#d4a853] mb-2">
                  Craftsmanship
                </p>
                <p className="text-2xl font-serif">
                  Where Art Meets Engineering
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <SectionDivider />

      {/* Knowledge Topics */}
      <section className="px-6 pb-24">
        <div className="max-w-4xl mx-auto">
          {topics.map((topic, i) => (
            <AnimatedSection key={topic.title} delay={i * 0.05}>
              <div className="mb-16 last:mb-0">
                <span className="text-[#d4a853] text-xs tracking-[0.3em]">
                  0{i + 1}
                </span>
                <h2 className="text-2xl md:text-3xl font-serif mt-2 mb-4">
                  {topic.title}
                </h2>
                <p className="text-gray-400 leading-8 text-sm mb-6">
                  {topic.description}
                </p>
                <ul className="space-y-3">
                  {topic.details.map((detail, j) => (
                    <li
                      key={j}
                      className="flex items-start gap-3 text-gray-500 text-sm leading-7"
                    >
                      <span className="text-[#d4a853]/50 mt-1 shrink-0">
                        ◆
                      </span>
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 pb-24">
        <div className="max-w-4xl mx-auto text-center">
          <AnimatedSection>
            <p className="text-gray-500 text-sm mb-6">
              Ready to experience the craft for yourself?
            </p>
            <Link
              href="/collection"
              className="inline-block px-8 py-3 border border-[#d4a853] text-[#d4a853] rounded-full text-xs uppercase tracking-widest hover:bg-[#d4a853] hover:text-black transition duration-300"
            >
              Explore Collection →
            </Link>
          </AnimatedSection>
        </div>
      </section>
    </main>
  );
}
