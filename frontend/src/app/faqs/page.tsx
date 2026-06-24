"use client";

import PageHeader from "@/components/ui/PageHeader";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
  {
    category: "Orders & Shipping",
    questions: [
      {
        q: "How long does delivery take?",
        a: "Standard delivery takes 5–7 business days within India. Express shipping options are available at checkout for faster delivery within 2–3 business days.",
      },
      {
        q: "Do you ship internationally?",
        a: "Currently, we ship within India only. International shipping will be available soon. Subscribe to our newsletter to be notified when we expand our shipping coverage.",
      },
      {
        q: "How can I track my order?",
        a: "Once your order is shipped, you'll receive a tracking link via email. You can also track your order from the 'My Orders' section in your account.",
      },
      {
        q: "Can I change or cancel my order after placing it?",
        a: "Orders can be modified or cancelled within 2 hours of placement. After that, the order enters processing and cannot be changed. Please contact us immediately if you need assistance.",
      },
    ],
  },
  {
    category: "Products & Quality",
    questions: [
      {
        q: "Are BODHIQ watches genuine?",
        a: "Absolutely. Every BODHIQ timepiece is designed and manufactured under our strict quality standards. Each watch comes with a certificate of authenticity and a unique serial number.",
      },
      {
        q: "What warranty do you offer?",
        a: "All BODHIQ watches come with a 1-year manufacturer warranty covering manufacturing defects. This does not cover damage from misuse, water damage beyond rated resistance, or normal wear and tear.",
      },
      {
        q: "What materials are used in your watches?",
        a: "We use premium materials including 316L stainless steel cases, sapphire crystal glass, genuine leather straps, and high-grade mechanical or quartz movements depending on the collection.",
      },
    ],
  },
  {
    category: "Returns & Refunds",
    questions: [
      {
        q: "What is your return policy?",
        a: "We accept returns within 7 days of delivery. The product must be in original condition with all packaging and tags intact. Custom or engraved pieces are non-returnable.",
      },
      {
        q: "How do refunds work?",
        a: "Once we receive and inspect your returned item, refunds are processed within 7–10 business days to your original payment method.",
      },
      {
        q: "What if I receive a damaged product?",
        a: "In the rare event of receiving a damaged product, please contact us within 48 hours with photographs. We'll arrange an immediate replacement or full refund at no additional cost.",
      },
    ],
  },
  {
    category: "Payments",
    questions: [
      {
        q: "What payment methods do you accept?",
        a: "We accept all major credit/debit cards, UPI, net banking, and popular wallets through our secure payment partner Razorpay.",
      },
      {
        q: "Is my payment information secure?",
        a: "Yes. All payments are processed through Razorpay, which is PCI-DSS Level 1 compliant. We never store your complete payment details on our servers.",
      },
    ],
  },
];

export default function FAQsPage() {
  const [openIndex, setOpenIndex] = useState<string | null>(null);

  const toggleFAQ = (id: string) => {
    setOpenIndex(openIndex === id ? null : id);
  };

  return (
    <main className="min-h-screen bg-black text-white">
      <PageHeader
        eyebrow="Help Center"
        title="Frequently Asked Questions"
        subtitle="Find answers to the most common questions about BODHIQ timepieces, orders, shipping, and more."
      />

      <section className="px-6 pb-24">
        <div className="max-w-4xl mx-auto">
          {faqs.map((category, catIdx) => (
            <AnimatedSection key={category.category} delay={catIdx * 0.08}>
              <div className="mb-12">
                <h2 className="text-xs uppercase tracking-[0.35em] text-[#d4a853] mb-6">
                  {category.category}
                </h2>

                <div className="space-y-0">
                  {category.questions.map((faq, qIdx) => {
                    const id = `${catIdx}-${qIdx}`;
                    const isOpen = openIndex === id;

                    return (
                      <div
                        key={id}
                        className="border-b border-white/5 last:border-0"
                      >
                        <button
                          onClick={() => toggleFAQ(id)}
                          className="w-full flex items-center justify-between py-5 text-left group"
                          aria-expanded={isOpen}
                        >
                          <span className="text-sm md:text-base text-white group-hover:text-[#d4a853] transition-colors duration-300 pr-4">
                            {faq.q}
                          </span>
                          <span className="text-[#d4a853] text-xl shrink-0 transition-transform duration-300"
                            style={{ transform: isOpen ? "rotate(45deg)" : "rotate(0deg)" }}>
                            +
                          </span>
                        </button>

                        <AnimatePresence>
                          {isOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3 }}
                              className="overflow-hidden"
                            >
                              <p className="text-gray-400 text-sm leading-7 pb-5">
                                {faq.a}
                              </p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </div>
            </AnimatedSection>
          ))}

          {/* Still have questions? */}
          <AnimatedSection>
            <div className="glass-card rounded-2xl p-8 text-center mt-8">
              <h3 className="text-xl font-serif mb-3">
                Still have questions?
              </h3>
              <p className="text-gray-400 text-sm mb-6">
                Our team is here to help.
              </p>
              <a
                href="mailto:bodhiq.official@gmail.com"
                className="inline-block px-6 py-3 border border-[#d4a853] text-[#d4a853] rounded-full text-xs uppercase tracking-widest hover:bg-[#d4a853] hover:text-black transition duration-300"
              >
                Contact Support →
              </a>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </main>
  );
}
