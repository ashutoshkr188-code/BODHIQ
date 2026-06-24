import { Metadata } from "next";
import PageHeader from "@/components/ui/PageHeader";
import AnimatedSection from "@/components/ui/AnimatedSection";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Media Outreach",
  description:
    "BODHIQ Media & Press — For press inquiries, collaborations, and brand partnerships with our luxury timepiece brand.",
  keywords: [
    "BODHIQ press",
    "media inquiries",
    "brand partnerships",
    "luxury watch press",
  ],
  openGraph: {
    title: "Media Outreach — BODHIQ",
    description:
      "For press inquiries, collaborations, and brand partnerships with BODHIQ.",
  },
};

export default function MediaPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <PageHeader
        eyebrow="Press & Media"
        title="Media Outreach"
        subtitle="For press inquiries, editorial features, and brand collaborations — we'd love to connect."
      />

      <section className="px-6 pb-24">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <AnimatedSection direction="left">
              <div className="glass-card rounded-2xl p-8 h-full">
                <span className="text-[#d4a853] text-xs uppercase tracking-[0.35em]">
                  Press Inquiries
                </span>
                <h3 className="text-xl font-serif mt-3 mb-4">
                  Editorial & Features
                </h3>
                <p className="text-gray-400 leading-7 text-sm mb-6">
                  For interviews, product features, editorial collaborations,
                  and press releases, please reach out to our communications
                  team.
                </p>
                <a
                  href="mailto:bodhiq.official@gmail.com"
                  className="text-sm text-[#d4a853] hover:underline underline-offset-4"
                >
                  bodhiq.official@gmail.com →
                </a>
              </div>
            </AnimatedSection>

            <AnimatedSection direction="right">
              <div className="glass-card rounded-2xl p-8 h-full">
                <span className="text-[#d4a853] text-xs uppercase tracking-[0.35em]">
                  Collaborations
                </span>
                <h3 className="text-xl font-serif mt-3 mb-4">
                  Brand Partnerships
                </h3>
                <p className="text-gray-400 leading-7 text-sm mb-6">
                  We selectively partner with brands and individuals who share
                  our values of craftsmanship, authenticity, and conscious
                  luxury.
                </p>
                <a
                  href="mailto:bodhiq.official@gmail.com"
                  className="text-sm text-[#d4a853] hover:underline underline-offset-4"
                >
                  bodhiq.official@gmail.com →
                </a>
              </div>
            </AnimatedSection>
          </div>

          <AnimatedSection>
            <div className="glass-card rounded-2xl p-8 md:p-10 text-center">
              <h3 className="text-2xl font-serif mb-4">Brand Assets</h3>
              <p className="text-gray-400 text-sm leading-7 max-w-lg mx-auto mb-6">
                Need our logo, brand guidelines, or high-resolution images for
                your publication? Request our official media kit.
              </p>
              <a
                href="mailto:bodhiq.official@gmail.com?subject=Media Kit Request"
                className="inline-block px-6 py-3 border border-[#d4a853] text-[#d4a853] rounded-full text-xs uppercase tracking-widest hover:bg-[#d4a853] hover:text-black transition duration-300"
              >
                Request Media Kit
              </a>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </main>
  );
}
