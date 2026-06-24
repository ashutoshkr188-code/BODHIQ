import { Metadata } from "next";
import PageHeader from "@/components/ui/PageHeader";
import AnimatedSection from "@/components/ui/AnimatedSection";

export const metadata: Metadata = {
  title: "Our Values",
  description:
    "The core values that guide BODHIQ — craftsmanship, authenticity, sustainability, and the pursuit of timeless elegance.",
  keywords: [
    "BODHIQ values",
    "luxury watch philosophy",
    "sustainable luxury",
    "craftsmanship values",
  ],
  openGraph: {
    title: "Our Values — BODHIQ",
    description:
      "The core values that guide BODHIQ — craftsmanship, authenticity, sustainability, and the pursuit of timeless elegance.",
  },
};

const values = [
  {
    number: "01",
    title: "Uncompromising Craftsmanship",
    description:
      "Every timepiece is a testament to hundreds of hours of meticulous work. We refuse to cut corners because we believe luxury should be felt, not just seen.",
  },
  {
    number: "02",
    title: "Authenticity Above All",
    description:
      "In a world of mass production, we stand for originality. Each BODHIQ piece carries a unique identity — no two journeys through time are the same.",
  },
  {
    number: "03",
    title: "Conscious Creation",
    description:
      "We believe that true luxury leaves the world better than it found it. Our materials are responsibly sourced, our processes are mindful, and our impact is intentional.",
  },
  {
    number: "04",
    title: "Timeless Over Trendy",
    description:
      "Trends fade. Style endures. We design timepieces that transcend seasons and generations, becoming more meaningful with each passing year.",
  },
  {
    number: "05",
    title: "Heritage & Innovation",
    description:
      "We honor the legacy of traditional watchmaking while embracing modern engineering. This duality is at the heart of every BODHIQ creation.",
  },
  {
    number: "06",
    title: "Presence & Mindfulness",
    description:
      "Time is our most precious resource. Our watches serve as a gentle reminder to be present, to savor each moment, and to live with intention.",
  },
];

export default function ValuesPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <PageHeader
        eyebrow="Our Philosophy"
        title="Values That Stand the Test of Time"
        subtitle="These principles are not just words on a page — they are the foundation upon which every BODHIQ timepiece is built."
      />

      <section className="px-6 pb-24">
        <div className="max-w-5xl mx-auto space-y-0">
          {values.map((value, i) => (
            <AnimatedSection key={value.number} delay={i * 0.06}>
              <div className="group flex items-start gap-8 py-10 border-b border-white/5 hover:border-[#d4a853]/20 transition-colors duration-500">
                <span className="text-[#d4a853] text-xs tracking-[0.3em] font-medium pt-2 shrink-0">
                  {value.number}
                </span>
                <div>
                  <h2 className="text-2xl md:text-3xl font-serif mb-3 group-hover:text-[#d4a853] transition-colors duration-500">
                    {value.title}
                  </h2>
                  <p className="text-gray-400 leading-8 max-w-2xl">
                    {value.description}
                  </p>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </section>
    </main>
  );
}
