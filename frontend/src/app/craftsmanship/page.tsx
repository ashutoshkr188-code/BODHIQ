import { Metadata } from "next";
import PageHeader from "@/components/ui/PageHeader";
import AnimatedSection from "@/components/ui/AnimatedSection";
import SectionDivider from "@/components/ui/SectionDivider";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Craftsmanship — The Art Behind Every Timepiece",
  description:
    "Discover the meticulous craft behind every BODHIQ timepiece. From design philosophy to final assembly — a journey of precision, patience, and purpose.",
  keywords: [
    "BODHIQ craftsmanship",
    "watchmaking",
    "luxury watch craft",
    "handmade watches",
    "horology",
  ],
  openGraph: {
    title: "Craftsmanship — BODHIQ",
    description:
      "Discover the meticulous craft behind every BODHIQ timepiece.",
    images: ["/watches/watch-detail.jpg"],
  },
};

const craftSteps = [
  {
    number: "01",
    title: "Design",
    subtitle: "Where Vision Takes Shape",
    description:
      "Every timepiece begins as a thought — a meditation on form, function, and philosophy. Our designers spend months perfecting each detail, ensuring every line, curve, and proportion serves both beauty and purpose.",
  },
  {
    number: "02",
    title: "Material",
    subtitle: "Chosen With Intention",
    description:
      "We source only the finest materials: 316L surgical-grade stainless steel, sapphire crystal glass, and genuine leather from responsible artisans. Each material is selected not just for durability, but for the story it tells.",
  },
  {
    number: "03",
    title: "Assembly",
    subtitle: "Precision Beyond Measure",
    description:
      "Each component is assembled with tolerances measured in hundredths of a millimeter. Our master craftsmen bring together over 100 individual parts, ensuring every gear meshes, every hand aligns, every beat is true.",
  },
  {
    number: "04",
    title: "Finishing",
    subtitle: "The Final Meditation",
    description:
      "The final stage is a ritual of patience. Each surface is polished, inspected, and refined. The dial is set. The hands find their home. What emerges is not merely a watch — it is an instrument of presence.",
  },
];

export default function CraftsmanshipPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      {/* Hero */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/watches/watch-detail.jpg"
            alt="BODHIQ craftsmanship — the art of watchmaking"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/70" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black" />
        </div>

        {/* Content */}
        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          <AnimatedSection>
            <p className="text-xs uppercase tracking-[0.5em] text-[#d4a853] mb-6">
              The Art of Time
            </p>
          </AnimatedSection>

          <AnimatedSection delay={0.15}>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif leading-[1.1]">
              <span className="block">Time, Crafted.</span>
              <span className="block text-gray-500 mt-2">Not Produced.</span>
            </h1>
          </AnimatedSection>

          <AnimatedSection delay={0.3}>
            <p className="text-gray-400 mt-8 text-base md:text-lg max-w-xl mx-auto leading-relaxed">
              Every BODHIQ timepiece is a meditation on impermanence — an
              instrument built to make each moment worthy of notice.
            </p>
          </AnimatedSection>
        </div>

        {/* Scroll indicator */}
        <AnimatedSection
          delay={0.6}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <div className="w-px h-16 bg-gradient-to-b from-[#d4a853]/40 to-transparent" />
        </AnimatedSection>
      </section>

      {/* Philosophy */}
      <section className="px-6 py-32">
        <div className="max-w-4xl mx-auto text-center">
          <AnimatedSection>
            <p className="text-xs uppercase tracking-[0.4em] text-[#d4a853] mb-6">
              Philosophy
            </p>
            <h2 className="text-3xl md:text-5xl font-serif leading-tight mb-8">
              We believe a watch should be more than an instrument.
              <br />
              <span className="text-gray-500">
                It should be a companion in your relationship with time.
              </span>
            </h2>
            <p className="text-gray-500 text-sm md:text-base leading-8 max-w-2xl mx-auto">
              In a world that rushes, BODHIQ asks you to pause. To feel the
              weight on your wrist. To notice the sweep of a second hand. To
              remember that this moment — right now — will never come again.
            </p>
          </AnimatedSection>
        </div>
      </section>

      <SectionDivider />

      {/* Craft Process */}
      <section className="px-6 py-20">
        <div className="max-w-5xl mx-auto">
          <AnimatedSection className="text-center mb-20">
            <p className="text-xs uppercase tracking-[0.4em] text-[#d4a853] mb-4">
              The Journey
            </p>
            <h2 className="text-3xl md:text-5xl font-serif">
              From Vision to Wrist
            </h2>
          </AnimatedSection>

          <div className="space-y-24">
            {craftSteps.map((step, i) => (
              <AnimatedSection
                key={step.number}
                direction={i % 2 === 0 ? "left" : "right"}
              >
                <div
                  className={`flex flex-col md:flex-row items-start gap-10 md:gap-16 ${
                    i % 2 !== 0 ? "md:flex-row-reverse" : ""
                  }`}
                >
                  {/* Number */}
                  <div className="shrink-0">
                    <span className="text-6xl md:text-8xl font-serif text-[#d4a853]/10">
                      {step.number}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <p className="text-xs uppercase tracking-[0.35em] text-[#d4a853] mb-3">
                      {step.subtitle}
                    </p>
                    <h3 className="text-3xl md:text-4xl font-serif mb-5">
                      {step.title}
                    </h3>
                    <p className="text-gray-400 leading-8 text-sm md:text-base max-w-lg">
                      {step.description}
                    </p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* Materials */}
      <section className="px-6 py-20">
        <div className="max-w-5xl mx-auto">
          <AnimatedSection className="text-center mb-16">
            <p className="text-xs uppercase tracking-[0.4em] text-[#d4a853] mb-4">
              Materials
            </p>
            <h2 className="text-3xl md:text-5xl font-serif">
              Texture. Metal. Dial.
            </h2>
            <p className="text-gray-500 mt-5 max-w-xl mx-auto text-sm leading-7">
              Each material is a character in the story your timepiece tells.
            </p>
          </AnimatedSection>

          <div className="grid sm:grid-cols-3 gap-6">
            {[
              {
                title: "316L Stainless Steel",
                desc: "Surgical-grade steel that resists corrosion, retains its luster, and sits comfortably against skin for decades.",
              },
              {
                title: "Sapphire Crystal",
                desc: "Second only to diamond in hardness. Virtually scratch-proof, crystal-clear, and engineered to last a lifetime.",
              },
              {
                title: "Genuine Leather",
                desc: "Ethically sourced, hand-stitched, and designed to develop a unique patina — becoming more beautiful with time.",
              },
            ].map((material, i) => (
              <AnimatedSection key={material.title} delay={i * 0.1}>
                <div className="glass-card rounded-2xl p-8 h-full hover:border-[#d4a853]/20 transition-colors duration-500">
                  <span className="text-[#d4a853] text-xs tracking-[0.3em]">
                    0{i + 1}
                  </span>
                  <h3 className="text-lg font-serif mt-3 mb-4">
                    {material.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-7">
                    {material.desc}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* Closing CTA */}
      <section className="px-6 py-32">
        <div className="max-w-3xl mx-auto text-center">
          <AnimatedSection>
            <p className="text-xs uppercase tracking-[0.4em] text-[#d4a853] mb-6">
              Experience It
            </p>
            <h2 className="text-4xl md:text-6xl font-serif leading-tight mb-6">
              Some things must be felt
              <br />
              <span className="text-gray-500">to be understood.</span>
            </h2>
            <p className="text-gray-500 text-sm leading-7 max-w-lg mx-auto mb-10">
              Words describe. Touch reveals. Discover what it means to wear a
              timepiece that was crafted — not manufactured.
            </p>

            <Link
              href="/collection"
              className="inline-block px-10 py-4 bg-[#d4a853] text-black rounded-full text-xs uppercase tracking-widest font-medium hover:bg-[#e8c97a] transition duration-300"
            >
              Discover the Collection
            </Link>
          </AnimatedSection>
        </div>
      </section>
    </main>
  );
}
