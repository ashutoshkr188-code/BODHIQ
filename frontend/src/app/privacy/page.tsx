import { Metadata } from "next";
import PageHeader from "@/components/ui/PageHeader";
import AnimatedSection from "@/components/ui/AnimatedSection";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "BODHIQ Privacy Policy — Learn how we collect, use, and protect your personal information when you interact with our luxury timepiece brand.",
  keywords: ["BODHIQ privacy policy", "data protection", "privacy notice"],
  openGraph: {
    title: "Privacy Policy — BODHIQ",
    description:
      "Learn how BODHIQ collects, uses, and protects your personal information.",
  },
};

const sections = [
  {
    title: "Information We Collect",
    content: [
      "Personal information you provide directly, such as name, email address, phone number, and shipping address when making a purchase or creating an account.",
      "Payment information processed securely through our trusted payment partner Razorpay. We do not store your complete payment details on our servers.",
      "Usage data including pages visited, time spent, and browsing patterns to improve your experience on our platform.",
      "Device information such as browser type, operating system, and IP address for security and optimization purposes.",
    ],
  },
  {
    title: "How We Use Your Information",
    content: [
      "To process and fulfill your orders, including shipping and delivery of BODHIQ timepieces.",
      "To communicate with you about your purchases, account updates, and customer service inquiries.",
      "To send you updates about new collections, exclusive releases, and special offers — only with your explicit consent.",
      "To improve our website, products, and services based on aggregated usage patterns.",
      "To comply with legal obligations and protect against fraudulent activity.",
    ],
  },
  {
    title: "Data Protection & Security",
    content: [
      "We employ industry-standard encryption (SSL/TLS) to protect your data during transmission.",
      "Access to personal information is restricted to authorized personnel who require it for business operations.",
      "We conduct regular security audits and assessments to ensure the integrity of our systems.",
      "Your payment information is processed by Razorpay under PCI-DSS compliance standards.",
    ],
  },
  {
    title: "Your Rights",
    content: [
      "You have the right to access, correct, or delete your personal information at any time.",
      "You may opt out of marketing communications while retaining your account.",
      "You can request a copy of all data we hold about you by contacting our support team.",
      "You have the right to withdraw consent for data processing where applicable.",
    ],
  },
  {
    title: "Cookies & Tracking",
    content: [
      "We use essential cookies to maintain your session and shopping cart.",
      "Analytics cookies help us understand how visitors interact with our website.",
      "You can manage cookie preferences through your browser settings at any time.",
    ],
  },
  {
    title: "Third-Party Services",
    content: [
      "Clerk (authentication) and Razorpay (payments) are used as trusted third-party services.",
      "Each service operates under its own privacy policy and data protection standards.",
      "We do not sell your personal information to third parties under any circumstances.",
    ],
  },
  {
    title: "Contact Us",
    content: [
      "For any privacy-related questions or requests, please email us at bodhiq.official@gmail.com.",
      "We aim to respond to all privacy inquiries within 48 hours.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <PageHeader
        eyebrow="Legal"
        title="Privacy Policy"
        subtitle="Your privacy is as precious to us as the craftsmanship in our timepieces. This policy explains how we handle your information with care and respect."
      />

      <section className="px-6 pb-24">
        <div className="max-w-4xl mx-auto">
          <AnimatedSection>
            <p className="text-gray-500 text-sm mb-12">
              Last updated: March 2026
            </p>
          </AnimatedSection>

          {sections.map((section, i) => (
            <AnimatedSection key={section.title} delay={i * 0.05}>
              <div className="mb-12">
                <h2 className="text-xl md:text-2xl font-serif mb-5 text-white">
                  {section.title}
                </h2>
                <ul className="space-y-3">
                  {section.content.map((item, j) => (
                    <li
                      key={j}
                      className="flex items-start gap-3 text-gray-400 leading-7 text-sm"
                    >
                      <span className="text-[#d4a853]/50 mt-2 shrink-0">
                        •
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </section>
    </main>
  );
}
