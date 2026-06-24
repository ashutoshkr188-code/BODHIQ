import { Metadata } from "next";
import PageHeader from "@/components/ui/PageHeader";
import AnimatedSection from "@/components/ui/AnimatedSection";
import SectionDivider from "@/components/ui/SectionDivider";
import Image from "next/image";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Discover the story behind BODHIQ — luxury timepieces born from the intersection of ancient wisdom and modern precision engineering.",
  keywords: [
    "BODHIQ about",
    "luxury watch brand story",
    "Indian luxury watches",
    "BODHIQ history",
  ],
  openGraph: {
    title: "About BODHIQ — Our Story",
    description:
      "Discover the story behind BODHIQ — luxury timepieces born from the intersection of ancient wisdom and modern precision engineering.",
    images: ["/watches/watch-detail.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "About BODHIQ — Our Story",
    description:
      "Discover the story behind BODHIQ — luxury timepieces born from the intersection of ancient wisdom and modern precision engineering.",
  },
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <PageHeader
        eyebrow="Our Story"
        title="Where Wisdom Meets Precision"
        subtitle="BODHIQ is not just a brand — it is a philosophy etched in time. Every timepiece we craft carries the weight of centuries of wisdom and the precision of modern innovation."
      />

      {/* Origin Story */}
      <section className="px-6 pb-20">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <AnimatedSection direction="left">
            <p className="text-xs uppercase tracking-[0.35em] text-[#d4a853] mb-4">
              The Origin
            </p>
            <h2 className="text-3xl md:text-4xl font-serif leading-tight mb-6">
              Born from a Vision
            </h2>
            <p className="text-gray-400 leading-8 mb-4">
              <span className="italic text-white">Bodhi</span> — Sanskrit for
              enlightenment, the moment of profound understanding.{" "}
              <span className="italic text-white">IQ</span> — the measure of
              intellect and precision.
            </p>
            <p className="text-gray-500 leading-8 mb-4">
              BODHIQ was founded with a singular belief: that true luxury is not
              about excess, but about meaning. Each timepiece is designed to be
              more than an accessory — it is a companion in your journey through
              time.
            </p>
            <p className="text-gray-500 leading-8">
              We don&apos;t make watches to tell time. We craft instruments that
              make time worth telling.
            </p>
          </AnimatedSection>

          <AnimatedSection direction="right">
            <div className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden border border-[#d4a853]/10">
              <Image
                src="/watches/watch-detail.jpg"
                alt="BODHIQ luxury timepiece — precision craftsmanship detail"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-l from-black/60 via-black/20 to-transparent" />
            </div>
          </AnimatedSection>
        </div>
      </section>

      <SectionDivider />

      {/* Pillars */}
      <section className="px-6 pb-24">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection className="text-center mb-16">
            <p className="text-xs uppercase tracking-[0.35em] text-[#d4a853] mb-4">
              What Drives Us
            </p>
            <h2 className="text-3xl md:text-5xl font-serif">
              The Three Pillars of BODHIQ
            </h2>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Wisdom",
                desc: "Rooted in ancient philosophy, each design reflects centuries of knowledge about the nature of time and impermanence.",
              },
              {
                title: "Precision",
                desc: "Every component is engineered with meticulous attention to detail, where tolerances are measured in fractions of a second.",
              },
              {
                title: "Presence",
                desc: "Our timepieces are designed to anchor you to the present moment — a reminder that now is all we truly possess.",
              },
            ].map((pillar, i) => (
              <AnimatedSection key={pillar.title} delay={i * 0.12}>
                <div className="glass-card rounded-2xl p-8 h-full hover:border-[#d4a853]/30 transition-colors duration-500">
                  <span className="text-[#d4a853] text-xs uppercase tracking-[0.35em]">
                    0{i + 1}
                  </span>
                  <h3 className="text-2xl font-serif mt-3 mb-4">
                    {pillar.title}
                  </h3>
                  <p className="text-gray-400 leading-7 text-sm">
                    {pillar.desc}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
