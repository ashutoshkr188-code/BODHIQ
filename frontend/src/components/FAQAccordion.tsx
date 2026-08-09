"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

interface FAQItemProps {
  question: string;
  answer: string;
}

export default function FAQAccordion({ items }: { items: FAQItemProps[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="max-w-3xl mx-auto space-y-3">
      {items.map((item, i) => (
        <div
          key={i}
          className="border border-white/8 rounded-xl overflow-hidden hover:border-white/15 transition-colors"
        >
          <button
            id={`faq-btn-${i}`}
            aria-expanded={openIndex === i}
            aria-controls={`faq-panel-${i}`}
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            className="w-full flex items-center justify-between px-6 py-5 text-left gap-4"
          >
            <span className="font-serif text-lg text-white/90">{item.question}</span>
            <span className="shrink-0 text-[#d4a853]">
              {openIndex === i ? <Minus size={16} /> : <Plus size={16} />}
            </span>
          </button>
          <AnimatePresence initial={false}>
            {openIndex === i && (
              <motion.div
                id={`faq-panel-${i}`}
                role="region"
                aria-labelledby={`faq-btn-${i}`}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <div className="px-6 pb-6 text-gray-400 leading-8 text-sm whitespace-pre-line">
                  {item.answer}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}
