import { Metadata } from "next";
import PageHeader from "@/components/ui/PageHeader";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { Shield, CreditCard, Smartphone, Building2 } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Payment Policy",
  description:
    "BODHIQ Payment Policy — Accepted payment methods, security measures, and billing information for purchasing luxury timepieces.",
  keywords: [
    "BODHIQ payment",
    "payment methods",
    "secure checkout",
    "Razorpay",
    "online payment",
  ],
  openGraph: {
    title: "Payment Policy — BODHIQ",
    description:
      "Learn about BODHIQ's accepted payment methods and secure checkout process.",
  },
};

const methods = [
  {
    icon: CreditCard,
    title: "Credit & Debit Cards",
    desc: "All major cards including Visa, Mastercard, American Express, and RuPay.",
  },
  {
    icon: Smartphone,
    title: "UPI Payments",
    desc: "Google Pay, PhonePe, Paytm, and all UPI-enabled apps for instant payment.",
  },
  {
    icon: Building2,
    title: "Net Banking",
    desc: "Direct payment through all major Indian banks with secure authentication.",
  },
  {
    icon: Shield,
    title: "Wallets",
    desc: "Popular digital wallets including Paytm, Mobikwik, and Freecharge.",
  },
];

export default function PaymentPolicyPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <PageHeader
        eyebrow="Policies"
        title="Payment Policy"
        subtitle="Your security is our priority. All transactions are encrypted and processed through our trusted payment partner, Razorpay."
      />

      <section className="px-6 pb-24">
        <div className="max-w-4xl mx-auto">
          {/* Payment Methods */}
          <AnimatedSection className="mb-16">
            <p className="text-xs uppercase tracking-[0.35em] text-[#d4a853] mb-4 text-center">
              Accepted Methods
            </p>
            <h2 className="text-2xl md:text-3xl font-serif text-center mb-10">
              How You Can Pay
            </h2>

            <div className="grid sm:grid-cols-2 gap-6">
              {methods.map((method, i) => {
                const Icon = method.icon;
                return (
                  <AnimatedSection key={method.title} delay={i * 0.1}>
                    <div className="glass-card rounded-2xl p-6 h-full hover:border-[#d4a853]/30 transition-colors duration-500">
                      <div className="w-10 h-10 rounded-full border border-[#d4a853]/20 flex items-center justify-center text-[#d4a853] mb-4">
                        <Icon size={18} />
                      </div>
                      <h3 className="text-base font-medium mb-2">
                        {method.title}
                      </h3>
                      <p className="text-gray-400 text-sm leading-7">
                        {method.desc}
                      </p>
                    </div>
                  </AnimatedSection>
                );
              })}
            </div>
          </AnimatedSection>

          {/* Security & Details */}
          {[
            {
              title: "Payment Security",
              content:
                "All payments are processed through Razorpay, which is PCI-DSS Level 1 compliant — the highest level of payment security certification. Your card details are encrypted during transmission and never stored on our servers. Two-factor authentication (2FA) adds an additional layer of protection to every transaction.",
            },
            {
              title: "Currency & Pricing",
              content:
                "All prices on BODHIQ are listed in Indian Rupees (₹ INR). Prices include applicable GST unless stated otherwise. Final pricing including any applicable taxes and shipping charges will be displayed at checkout before payment.",
            },
            {
              title: "Payment Failures",
              content:
                "If your payment fails, no amount will be deducted. In rare cases where an amount is debited but the order is not confirmed, the payment will be automatically refunded within 5–7 business days. If you face persistent issues, please contact our support team.",
            },
            {
              title: "Invoicing",
              content:
                "A GST-compliant invoice will be generated for every order and sent to your registered email address. You can also download invoices from your order history in your BODHIQ account.",
            },
          ].map((item, i) => (
            <AnimatedSection key={item.title} delay={i * 0.05}>
              <div className="mb-10 pb-10 border-b border-white/5 last:border-0">
                <h2 className="text-xl font-serif mb-3">{item.title}</h2>
                <p className="text-gray-400 leading-8 text-sm">
                  {item.content}
                </p>
              </div>
            </AnimatedSection>
          ))}

          {/* Related Links */}
          <AnimatedSection>
            <div className="flex flex-wrap gap-4 mt-8">
              <Link
                href="/return-policy"
                className="px-5 py-2.5 border border-white/10 rounded-full text-xs uppercase tracking-widest text-gray-400 hover:border-[#d4a853]/20 hover:text-[#d4a853] transition duration-300"
              >
                Return Policy
              </Link>
              <Link
                href="/shipping-policy"
                className="px-5 py-2.5 border border-white/10 rounded-full text-xs uppercase tracking-widest text-gray-400 hover:border-[#d4a853]/20 hover:text-[#d4a853] transition duration-300"
              >
                Shipping Policy
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </main>
  );
}
