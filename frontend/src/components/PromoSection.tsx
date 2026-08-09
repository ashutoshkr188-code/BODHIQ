"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { resolveMediaUrl } from "@/lib/apiClient";

export interface PromoData {
  sectionEnabled?: boolean;
  eyebrowLabel?: string | null;
  title?: string | null;
  description?: string | null;
  bgType?: string;
  bgUrl?: string | null;
  buttonText?: string | null;
  buttonLink?: string | null;
}

export default function PromoSection({ data }: { data?: PromoData }) {
  // Hide if disabled or no meaningful content
  if (!data || data.sectionEnabled === false) return null;
  if (!data.title && !data.bgUrl) return null;

  const eyebrowLabel = data.eyebrowLabel ?? null;
  const title = data.title ?? null;
  const description = data.description ?? null;
  const bgType = data.bgType || "image";
  const bgUrl = data.bgUrl ? resolveMediaUrl(data.bgUrl) : null;
  const buttonText = data.buttonText ?? null;
  const buttonLink = data.buttonLink || "/collection";

  return (
    <section className="relative h-[80vh] w-full flex items-center justify-center bg-black overflow-hidden border-y border-white/[0.03]">
      {/* Background Media */}
      <div className="absolute inset-0 z-0">
        {bgUrl && bgType === "video" ? (
          <video
            src={bgUrl}
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover opacity-60 scale-105"
          />
        ) : bgUrl ? (
          <img
            src={bgUrl}
            alt={title ?? ""}
            className="w-full h-full object-cover opacity-60 scale-105 transition-all duration-1000"
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/80 z-10" />
      </div>

      {/* Content */}
      <div className="relative z-20 max-w-4xl mx-auto text-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="space-y-6"
        >
          {eyebrowLabel && (
            <p className="text-[10px] uppercase tracking-[0.4em] text-[#d4a853] font-semibold">
              {eyebrowLabel}
            </p>
          )}

          {title && (
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-serif text-white leading-tight tracking-tight">
              {title}
            </h2>
          )}

          {description && description.trim() !== "" && (
            <>
              <div className="w-16 h-[1px] bg-[#d4a853]/40 mx-auto my-4" />
              <p className="text-gray-300 text-sm md:text-base max-w-2xl mx-auto leading-relaxed whitespace-pre-line drop-shadow-md font-sans">
                {description}
              </p>
            </>
          )}

          {buttonText && buttonText.trim() !== "" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="pt-6"
            >
              <Link href={buttonLink}>
                <button className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#d4a853] hover:bg-[#e8c97a] text-black text-xs uppercase tracking-widest font-semibold rounded-full hover:scale-105 transition-all duration-300 shadow-xl shadow-[#d4a853]/5">
                  {buttonText}
                </button>
              </Link>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
