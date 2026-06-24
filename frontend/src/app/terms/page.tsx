import { Metadata } from "next";
import PageHeader from "@/components/ui/PageHeader";
import AnimatedSection from "@/components/ui/AnimatedSection";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description:
    "BODHIQ Terms & Conditions — Please read these terms carefully before using our website or purchasing our luxury timepieces.",
  keywords: ["BODHIQ terms", "terms and conditions", "user agreement"],
  openGraph: {
    title: "Terms & Conditions — BODHIQ",
    description:
      "Read the terms and conditions governing the use of BODHIQ products and services.",
  },
};

const sections = [
  {
    title: "Acceptance of Terms",
    content:
      "By accessing, browsing, or purchasing from BODHIQ, you acknowledge that you have read, understood, and agree to be bound by these Terms & Conditions. If you do not agree, please refrain from using our services.",
  },
  {
    title: "Products & Pricing",
    content:
      "All product descriptions, images, and specifications on our website are as accurate as possible. However, slight variations in color, size, and appearance may occur due to the handcrafted nature of our timepieces. Prices are listed in Indian Rupees (INR) and are subject to change without prior notice. Any applicable taxes and shipping charges will be calculated at checkout.",
  },
  {
    title: "Orders & Payments",
    content:
      "By placing an order, you represent that you are legally capable of entering into a binding contract. All payments are processed securely through Razorpay. We reserve the right to cancel or refuse any order at our discretion, including but not limited to suspected fraudulent activity, pricing errors, or stock unavailability.",
  },
  {
    title: "Shipping & Delivery",
    content:
      "We aim to dispatch all orders within 3–5 business days. Delivery timelines depend on your location and the shipping method selected. BODHIQ is not responsible for delays caused by customs, weather, or carrier issues. For detailed shipping information, please refer to our Shipping Policy.",
  },
  {
    title: "Returns & Refunds",
    content:
      "We accept returns within 7 days of delivery, provided the product is in its original condition with all packaging and tags intact. Refunds will be processed within 7–10 business days after we receive the returned product. Custom or personalized items are non-refundable. For full details, please refer to our Return & Refund Policy.",
  },
  {
    title: "Intellectual Property",
    content:
      "All content on this website — including but not limited to text, graphics, logos, images, videos, and software — is the property of BODHIQ or its content suppliers and is protected by applicable intellectual property laws. Unauthorized use, reproduction, or distribution of any material is strictly prohibited.",
  },
  {
    title: "User Accounts",
    content:
      "You are responsible for maintaining the confidentiality of your account credentials. You agree to notify us immediately of any unauthorized access. BODHIQ is not liable for losses arising from unauthorized use of your account.",
  },
  {
    title: "Limitation of Liability",
    content:
      "BODHIQ shall not be liable for any indirect, incidental, special, or consequential damages arising from the use of our website or products. Our total liability for any claim shall not exceed the amount paid by you for the specific product or service in question.",
  },
  {
    title: "Governing Law",
    content:
      "These terms shall be governed by and construed in accordance with the laws of India. Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the courts in India.",
  },
  {
    title: "Changes to Terms",
    content:
      "BODHIQ reserves the right to modify these Terms & Conditions at any time. Changes will be effective immediately upon posting on this page. Your continued use of our website constitutes acceptance of the revised terms.",
  },
];

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <PageHeader
        eyebrow="Legal"
        title="Terms & Conditions"
        subtitle="Please review these terms carefully. They govern your use of our services and the purchase of BODHIQ timepieces."
      />

      <section className="px-6 pb-24">
        <div className="max-w-4xl mx-auto">
          <AnimatedSection>
            <p className="text-gray-500 text-sm mb-12">
              Last updated: March 2026
            </p>
          </AnimatedSection>

          {sections.map((section, i) => (
            <AnimatedSection key={section.title} delay={i * 0.04}>
              <div className="mb-10">
                <h2 className="text-xl md:text-2xl font-serif mb-4 text-white">
                  {i + 1}. {section.title}
                </h2>
                <p className="text-gray-400 leading-8 text-sm">
                  {section.content}
                </p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </section>
    </main>
  );
}
