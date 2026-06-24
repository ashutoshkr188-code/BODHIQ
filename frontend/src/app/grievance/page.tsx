import { Metadata } from "next";
import PageHeader from "@/components/ui/PageHeader";
import AnimatedSection from "@/components/ui/AnimatedSection";

export const metadata: Metadata = {
  title: "Grievance Redressal",
  description:
    "BODHIQ Grievance Redressal — We take your concerns seriously. Learn how to file and resolve complaints through our structured process.",
  keywords: [
    "BODHIQ grievance",
    "complaint redressal",
    "customer support",
    "issue resolution",
  ],
  openGraph: {
    title: "Grievance Redressal — BODHIQ",
    description:
      "File and resolve complaints through BODHIQ's structured grievance redressal process.",
  },
};

const steps = [
  {
    step: "01",
    title: "Submit Your Concern",
    desc: "Email us at bodhiq.official@gmail.com with your order details and a clear description of your concern. Include your order number and any relevant photographs.",
  },
  {
    step: "02",
    title: "Acknowledgement",
    desc: "We will acknowledge your complaint within 24 hours with a unique reference number for tracking purposes.",
  },
  {
    step: "03",
    title: "Investigation",
    desc: "Our team will thoroughly investigate your concern and may reach out for additional information if needed. This typically takes 3–5 business days.",
  },
  {
    step: "04",
    title: "Resolution",
    desc: "We will provide a fair resolution — whether that's a replacement, repair, refund, or other appropriate remedy — within 7 business days of acknowledgement.",
  },
];

export default function GrievancePage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <PageHeader
        eyebrow="Support"
        title="Grievance Redressal"
        subtitle="Your satisfaction is paramount. We have a structured, transparent process in place to address every concern with the care it deserves."
      />

      <section className="px-6 pb-24">
        <div className="max-w-4xl mx-auto">
          {/* Process Steps */}
          <AnimatedSection className="mb-16">
            <p className="text-xs uppercase tracking-[0.35em] text-[#d4a853] mb-4 text-center">
              Our Process
            </p>
            <h2 className="text-3xl md:text-4xl font-serif text-center mb-12">
              How We Resolve Your Concerns
            </h2>
          </AnimatedSection>

          <div className="space-y-0">
            {steps.map((item, i) => (
              <AnimatedSection key={item.step} delay={i * 0.1}>
                <div className="flex items-start gap-6 md:gap-10 py-8 border-b border-white/5 last:border-0">
                  <span className="text-[#d4a853] text-2xl md:text-3xl font-serif shrink-0 w-12">
                    {item.step}
                  </span>
                  <div>
                    <h3 className="text-xl font-serif mb-3">{item.title}</h3>
                    <p className="text-gray-400 leading-7 text-sm">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>

          {/* Grievance Officer */}
          <AnimatedSection className="mt-16">
            <div className="glass-card rounded-2xl p-8 md:p-10">
              <h3 className="text-xl font-serif mb-6">Grievance Officer</h3>
              <div className="space-y-3 text-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 border-b border-white/5">
                  <span className="text-gray-500">Name</span>
                  <span className="text-white">BODHIQ Support Team</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 border-b border-white/5">
                  <span className="text-gray-500">Email</span>
                  <a
                    href="mailto:bodhiq.official@gmail.com"
                    className="text-[#d4a853] hover:underline underline-offset-4"
                  >
                    bodhiq.official@gmail.com
                  </a>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2">
                  <span className="text-gray-500">Response Time</span>
                  <span className="text-white">Within 24 hours</span>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </main>
  );
}
