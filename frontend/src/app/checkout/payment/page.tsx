import RazorpayButton from "@/features/checkout/components/RazorpayButton";
import { Shield, Lock, CreditCard } from "lucide-react";

const steps = [
  { number: 1, label: "Address", active: false },
  { number: 2, label: "Payment", active: true },
  { number: 3, label: "Confirmation", active: false },
];

export default function PaymentPage() {
  return (
    <main className="min-h-screen bg-black text-white pt-32 px-6 pb-20">
      <div className="max-w-3xl mx-auto">
        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-0 mb-12">
          {steps.map((step, i) => (
            <div key={step.number} className="flex items-center">
              <div className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium border transition-all ${
                    step.active
                      ? "bg-[#d4a853] border-[#d4a853] text-black"
                      : i < steps.findIndex((s) => s.active)
                      ? "bg-[#d4a853]/10 border-[#d4a853]/30 text-[#d4a853]"
                      : "border-white/10 text-gray-600"
                  }`}
                >
                  {i < steps.findIndex((s) => s.active) ? "✓" : step.number}
                </div>
                <span
                  className={`text-xs uppercase tracking-[0.15em] ${
                    step.active
                      ? "text-[#d4a853]"
                      : i < steps.findIndex((s) => s.active)
                      ? "text-[#d4a853]/60"
                      : "text-gray-600"
                  }`}
                >
                  {step.label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div
                  className={`w-10 md:w-16 h-px mx-3 ${
                    i < steps.findIndex((s) => s.active)
                      ? "bg-[#d4a853]/30"
                      : "bg-white/5"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Header */}
        <div className="mb-10">
          <p className="text-xs uppercase tracking-[0.35em] text-[#d4a853] mb-3">
            Step 2 of 3
          </p>
          <h1 className="text-3xl md:text-4xl font-serif">
            Complete Your Purchase
          </h1>
          <p className="text-gray-500 text-sm mt-3">
            Your payment is processed securely through our trusted partner,
            Razorpay.
          </p>
        </div>

        {/* Payment Card */}
        <div className="glass-card rounded-3xl p-8 md:p-10 relative overflow-hidden mb-8">
          <div className="absolute inset-0 bg-gradient-to-br from-[#d4a853]/3 via-transparent to-transparent" />

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl border border-[#d4a853]/20 bg-[#d4a853]/5 flex items-center justify-center text-[#d4a853]">
                <Lock size={18} />
              </div>
              <div>
                <h2 className="text-lg font-serif">Secure Payment</h2>
                <p className="text-xs text-gray-500">
                  256-bit SSL encrypted transaction
                </p>
              </div>
            </div>

            <p className="text-gray-400 text-sm leading-7 mb-8 max-w-lg">
              Click below to open the Razorpay checkout. You can pay with credit
              card, debit card, UPI, net banking, or wallet.
            </p>

            <RazorpayButton />
          </div>
        </div>

        {/* Trust Badges */}
        <div className="grid sm:grid-cols-3 gap-3">
          {[
            {
              icon: Shield,
              title: "PCI-DSS Compliant",
              desc: "Industry-standard security",
            },
            {
              icon: CreditCard,
              title: "All Cards Accepted",
              desc: "Visa, Mastercard, RuPay & more",
            },
            {
              icon: Lock,
              title: "Data Encrypted",
              desc: "Your details are never stored",
            },
          ].map((badge, i) => {
            const Icon = badge.icon;
            return (
              <div
                key={i}
                className="flex items-start gap-3 p-4 rounded-xl border border-white/[0.03] bg-white/[0.01]"
              >
                <Icon
                  size={16}
                  className="text-[#d4a853]/40 shrink-0 mt-0.5"
                />
                <div>
                  <p className="text-xs text-gray-400 font-medium">
                    {badge.title}
                  </p>
                  <p className="text-[11px] text-gray-600 mt-0.5">
                    {badge.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
