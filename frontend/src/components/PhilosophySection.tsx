"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { resolveMediaUrl } from "@/lib/apiClient";

export interface PhilosophyData {
  sectionEnabled?: boolean;
  eyebrowLabel?: string | null;
  title?: string | null;
  subtitle?: string | null;
  description1?: string | null;
  description2?: string | null;
  description3?: string | null;
  signatureTitle?: string | null;
  signatureSubtitle?: string | null;
  imageUrl?: string | null;
}

export default function PhilosophySection({ data }: { data?: PhilosophyData }) {
  // If section disabled or all key content is blank, hide completely
  if (!data || data.sectionEnabled === false) return null;
  const hasContent =
    data.title || data.subtitle || data.description1 || data.description2 || data.description3;
  if (!hasContent) return null;

  const resolvedImageUrl = resolveMediaUrl(data.imageUrl ?? null);

  return (
    <section className="bg-black text-white px-6 py-28">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">

        {/* LEFT TEXT */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {data.eyebrowLabel && (
            <p className="text-xs uppercase tracking-[0.35em] text-[#d4a853] mb-4">
              {data.eyebrowLabel}
            </p>
          )}

          {(data.title || data.subtitle) && (
            <h2 className="text-3xl md:text-5xl font-serif leading-tight">
              {data.title && <span className="block text-white">{data.title}</span>}
              {data.subtitle && (
                <span className="block text-gray-400">{data.subtitle}</span>
              )}
            </h2>
          )}

          {data.description1 && (
            <p className="text-gray-400 mt-6 leading-relaxed text-sm md:text-base whitespace-pre-line">
              {data.description1}
            </p>
          )}

          {data.description2 && (
            <p className="text-gray-500 mt-4 text-sm md:text-base whitespace-pre-line">
              {data.description2}
            </p>
          )}

          {data.description3 && (
            <p className="text-gray-500 mt-4 italic text-sm whitespace-pre-line">
              {data.description3}
            </p>
          )}

          {(data.signatureTitle || data.signatureSubtitle) && (
            <div className="mt-10 pt-8 border-t border-white/5">
              {data.signatureTitle && (
                <p className="text-[10px] uppercase tracking-[0.4em] text-gray-600 mb-2">
                  {data.signatureTitle}
                </p>
              )}
              {data.signatureSubtitle && (
                <p className="text-sm text-[#d4a853]/80 font-serif italic">
                  {data.signatureSubtitle}
                </p>
              )}
            </div>
          )}
        </motion.div>

        {/* RIGHT IMAGE */}
        {resolvedImageUrl && (
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="relative h-100 md:h-137.5 overflow-hidden rounded-xl"
          >
            <Image
              src={resolvedImageUrl}
              alt={data.signatureTitle || "BODHIQ luxury watch"}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-linear-to-l from-black/70 via-black/30 to-transparent" />
          </motion.div>
        )}
      </div>
    </section>
  );
}
