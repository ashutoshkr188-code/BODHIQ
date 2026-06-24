"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { resolveMediaUrl } from "@/lib/apiClient";

export interface PhilosophyData {
  title?: string;
  subtitle?: string;
  description1?: string;
  description2?: string;
  description3?: string;
  signatureTitle?: string;
  signatureSubtitle?: string;
  imageUrl?: string;
  image?: string;
}

export default function PhilosophySection({ data }: { data?: PhilosophyData }) {
  // If the admin cleared the philosophy (both subtitle and description are empty/null/blank), hide the section completely
  const isCleared = data && (
    (!data.subtitle || data.subtitle.trim() === "") &&
    (!data.description1 || data.description1.trim() === "")
  );
  if (isCleared) {
    return null;
  }

  const title = data?.title;
  const subtitle = data?.subtitle;
  const description1 = data?.description1;
  const description2 = data?.description2;
  const description3 = data?.description3;
  const signatureTitle = data?.signatureTitle;
  const signatureSubtitle = data?.signatureSubtitle;
  const imageUrl = resolveMediaUrl(data?.imageUrl || data?.image || "/watches/shunya-1/hero.jpg");

  return (
    <section className="bg-black text-white px-6 py-28">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">

        {/* LEFT TEXT — SHUNYA I Story */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <p className="text-xs uppercase tracking-[0.35em] text-[#d4a853] mb-4">
            The Philosophy
          </p>

          <h2 className="text-3xl md:text-5xl font-serif leading-tight">
            <span className="text-white">{title}</span>
            <br />
            <span className="text-gray-400">
              {subtitle}
            </span>
          </h2>

          <p className="text-gray-400 mt-6 leading-relaxed text-sm md:text-base whitespace-pre-line">
            {description1}
          </p>

          <p className="text-gray-500 mt-4 text-sm md:text-base whitespace-pre-line">
            {description2}
          </p>

          <p className="text-gray-500 mt-4 italic text-sm whitespace-pre-line">
            {description3}
          </p>

          {/* Brand Signature */}
          <div className="mt-10 pt-8 border-t border-white/5">
            <p className="text-[10px] uppercase tracking-[0.4em] text-gray-600 mb-2">
              {signatureTitle}
            </p>
            <p className="text-sm text-[#d4a853]/80 font-serif italic">
              {signatureSubtitle}
            </p>
          </div>
        </motion.div>

        {/* RIGHT IMAGE — SHUNYA I Product Shot */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="relative h-100 md:h-137.5 overflow-hidden rounded-xl"
        >
          <Image
            src={imageUrl}
            alt={signatureTitle || "BODHIQ luxury watch"}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
            priority
          />

          {/* overlay for luxury effect */}
          <div className="absolute inset-0 bg-linear-to-l from-black/70 via-black/30 to-transparent"></div>
        </motion.div>

      </div>
    </section>
  );
}
