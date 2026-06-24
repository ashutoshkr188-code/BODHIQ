import { Metadata } from "next";
import PageHeader from "@/components/ui/PageHeader";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { Smartphone, Bell, Shield, Zap } from "lucide-react";

export const metadata: Metadata = {
  title: "Download the BODHIQ App",
  description:
    "Coming soon — The BODHIQ mobile app. Get exclusive access to collections, real-time order tracking, and a premium shopping experience.",
  keywords: [
    "BODHIQ app",
    "download app",
    "luxury watch app",
    "mobile shopping",
  ],
  openGraph: {
    title: "Download the BODHIQ App",
    description:
      "Coming soon — Get exclusive access to collections and a premium mobile shopping experience.",
  },
};

const features = [
  {
    icon: Zap,
    title: "Exclusive Access",
    desc: "Be the first to discover new collections and limited editions before anyone else.",
  },
  {
    icon: Bell,
    title: "Real-time Notifications",
    desc: "Instant updates on order status, restocks, and personalized recommendations.",
  },
  {
    icon: Shield,
    title: "Secure & Seamless",
    desc: "Biometric authentication and one-tap checkout for a frictionless experience.",
  },
  {
    icon: Smartphone,
    title: "Premium Experience",
    desc: "A beautifully crafted interface designed to mirror the elegance of our timepieces.",
  },
];

export default function DownloadAppPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <PageHeader
        eyebrow="Mobile App"
        title="The BODHIQ Experience, In Your Pocket"
        subtitle="We're crafting a mobile experience as premium as our timepieces. Be the first to know when it launches."
      />

      <section className="px-6 pb-24">
        <div className="max-w-4xl mx-auto">
          {/* Coming Soon Banner */}
          <AnimatedSection className="mb-20">
            <div className="glass-card rounded-3xl p-10 md:p-16 text-center relative overflow-hidden">
              {/* Decorative glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#d4a853]/5 via-transparent to-[#d4a853]/5" />

              <div className="relative z-10">
                <div className="w-16 h-16 rounded-2xl border border-[#d4a853]/20 flex items-center justify-center text-[#d4a853] mx-auto mb-6">
                  <Smartphone size={28} />
                </div>

                <p className="text-xs uppercase tracking-[0.4em] text-[#d4a853] mb-4">
                  Coming Soon
                </p>

                <h2 className="text-3xl md:text-5xl font-serif mb-4">
                  Something Beautiful
                  <br />
                  <span className="text-gray-500">Is Being Crafted</span>
                </h2>

                <p className="text-gray-400 text-sm leading-7 max-w-md mx-auto mb-8">
                  Our team is meticulously designing the BODHIQ app — a digital
                  extension of our philosophy of precision and elegance.
                </p>

                <div className="inline-block px-8 py-3 border border-[#d4a853]/30 text-[#d4a853]/60 rounded-full text-xs uppercase tracking-widest cursor-default">
                  Launching 2026
                </div>
              </div>
            </div>
          </AnimatedSection>

          {/* App Features Preview */}
          <AnimatedSection className="mb-16">
            <p className="text-xs uppercase tracking-[0.35em] text-[#d4a853] mb-4 text-center">
              What to Expect
            </p>
            <h2 className="text-2xl md:text-3xl font-serif text-center mb-12">
              Designed for Distinction
            </h2>
          </AnimatedSection>

          <div className="grid sm:grid-cols-2 gap-6">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <AnimatedSection key={feature.title} delay={i * 0.1}>
                  <div className="glass-card rounded-2xl p-6 h-full hover:border-[#d4a853]/30 transition-colors duration-500">
                    <div className="w-10 h-10 rounded-full border border-[#d4a853]/20 flex items-center justify-center text-[#d4a853] mb-4">
                      <Icon size={18} />
                    </div>
                    <h3 className="text-base font-medium mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-400 text-sm leading-7">
                      {feature.desc}
                    </p>
                  </div>
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
