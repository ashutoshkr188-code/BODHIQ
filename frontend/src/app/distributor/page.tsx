import { Metadata } from "next";
import PageHeader from "@/components/ui/PageHeader";
import AnimatedSection from "@/components/ui/AnimatedSection";

export const metadata: Metadata = {
  title: "Distributor Queries",
  description:
    "Become a BODHIQ authorized distributor — Partner with India's premier luxury timepiece brand for exclusive distribution opportunities.",
  keywords: [
    "BODHIQ distributor",
    "luxury watch distribution",
    "authorized dealer",
    "wholesale inquiry",
  ],
  openGraph: {
    title: "Distributor Queries — BODHIQ",
    description:
      "Partner with BODHIQ for exclusive distribution opportunities of our luxury timepieces.",
  },
};

const benefits = [
  {
    title: "Exclusive Territory",
    desc: "Protected geographical territories ensuring your market remains exclusive.",
  },
  {
    title: "Marketing Support",
    desc: "Access to premium marketing materials, brand assets, and co-branded campaign support.",
  },
  {
    title: "Training & Education",
    desc: "Comprehensive product knowledge and sales training for your team.",
  },
  {
    title: "Premium Margins",
    desc: "Competitive pricing structure with attractive margins befitting a luxury partnership.",
  },
];

export default function DistributorPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <PageHeader
        eyebrow="Partnership"
        title="Distributor Queries"
        subtitle="We are selectively expanding our authorized distribution network. If you share our commitment to excellence, we'd love to hear from you."
      />

      <section className="px-6 pb-24">
        <div className="max-w-5xl mx-auto">
          {/* Benefits */}
          <AnimatedSection className="mb-16">
            <p className="text-xs uppercase tracking-[0.35em] text-[#d4a853] mb-4 text-center">
              Why Partner With Us
            </p>
            <h2 className="text-3xl md:text-4xl font-serif text-center mb-12">
              Partnership Benefits
            </h2>

            <div className="grid sm:grid-cols-2 gap-6">
              {benefits.map((benefit, i) => (
                <AnimatedSection key={benefit.title} delay={i * 0.1}>
                  <div className="glass-card rounded-2xl p-6 h-full hover:border-[#d4a853]/30 transition-colors duration-500">
                    <span className="text-[#d4a853] text-xs tracking-[0.3em]">
                      0{i + 1}
                    </span>
                    <h3 className="text-lg font-serif mt-2 mb-3">
                      {benefit.title}
                    </h3>
                    <p className="text-gray-400 text-sm leading-7">
                      {benefit.desc}
                    </p>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </AnimatedSection>

          {/* Contact CTA */}
          <AnimatedSection>
            <div className="glass-card rounded-2xl p-8 md:p-12 text-center">
              <h3 className="text-2xl md:text-3xl font-serif mb-4">
                Start the Conversation
              </h3>
              <p className="text-gray-400 text-sm leading-7 max-w-lg mx-auto mb-8">
                Please send your company profile, area of operation, and
                distribution experience to begin the evaluation process.
              </p>
              <a
                href="mailto:bodhiq.official@gmail.com?subject=Distributor Inquiry"
                className="inline-block px-8 py-3 border border-[#d4a853] text-[#d4a853] rounded-full text-xs uppercase tracking-widest hover:bg-[#d4a853] hover:text-black transition duration-300"
              >
                Submit Inquiry →
              </a>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </main>
  );
}
