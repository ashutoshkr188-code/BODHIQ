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
  visibility?: Record<string, boolean>;
}


export default function PhilosophySection({ data }: { data?: PhilosophyData }) {
  // If section disabled or all key content is blank, hide completely
  if (!data || data.sectionEnabled === false) return null;
  const hasContent =
    data.title || data.subtitle || data.description1 || data.description2 || data.description3;
  if (!hasContent) return null;

  // Visibility Checks
  const v = data.visibility ?? {};
  const eyebrowLabel = v.eyebrow_label !== false ? data.eyebrowLabel : null;
  const title = v.title !== false ? data.title : null;
  const description1 = v.description !== false ? data.description1 : null;
  const description2 = v.description2 !== false ? data.description2 : null;
  const description3 = v.description3 !== false ? data.description3 : null;
  const signatureTitle = v.signature_title !== false ? data.signatureTitle : null;
  const signatureSubtitle = v.signature_subtitle !== false ? data.signatureSubtitle : null;
  const imageUrl = v.image_url !== false ? data.imageUrl : null;
  
  const resolvedImageUrl = resolveMediaUrl(imageUrl ?? null);


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
          {eyebrowLabel && (
            <p className="text-xs uppercase tracking-[0.35em] text-[#d4a853] mb-4">
              {eyebrowLabel}
            </p>
          )}

          {title && (
            <h2 className="text-3xl md:text-5xl font-serif leading-tight">
              <span className="block text-white">{title}</span>
            </h2>
          )}


          {description1 && (
            <p className="text-gray-400 mt-6 leading-relaxed text-sm md:text-base whitespace-pre-line">
              {description1}
            </p>
          )}

          {description2 && (
            <p className="text-gray-500 mt-4 text-sm md:text-base whitespace-pre-line">
              {description2}
            </p>
          )}

          {description3 && (
            <p className="text-gray-500 mt-4 italic text-sm whitespace-pre-line">
              {description3}
            </p>
          )}

          {(signatureTitle || signatureSubtitle) && (
            <div className="mt-10 pt-8 border-t border-white/5">
              {signatureTitle && (
                <p className="text-[10px] uppercase tracking-[0.4em] text-gray-600 mb-2">
                  {signatureTitle}
                </p>
              )}
              {signatureSubtitle && (
                <p className="text-sm text-[#d4a853]/80 font-serif italic">
                  {signatureSubtitle}
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
              alt={signatureTitle || "BODHIQ luxury watch"}

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
