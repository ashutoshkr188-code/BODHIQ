"use client";

import { useEffect, useState } from "react";
import { motion, Variants, AnimatePresence } from "framer-motion";
import Link from "next/link";
import type { BackgroundMediaItem } from "@/types/api";
import { resolveMediaUrl } from "@/lib/apiClient";

const localVideos = ["/videos/clip-1.mp4", "/videos/clip-2.mp4"];

const container: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.25,
      delayChildren: 0.5,
    },
  },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 1,
      ease: "easeOut",
    },
  },
};

export interface HeaderData {
  title?: string;
  tagline?: string;
  description?: string;
  ctaText?: string;
  ctaLink?: string;
  backgroundMedia?: BackgroundMediaItem[];
}

export default function Header({ data }: { data?: HeaderData }) {
  const title = data?.title ?? "BODHIQ";
  const tagline = data?.tagline ?? "Imperfect. Almost.";
  const description =
    data?.description ??
    "A minimalist luxury timepiece where ancient craft meets modern precision.\nHand-finished dial. Kintsugi-inspired detailing. Made for those who find beauty in the imperfect.";
  const ctaText = data?.ctaText ?? "Explore";
  const ctaLink = data?.ctaLink ?? "/collection";

  // Use CMS background media if available, fallback to local videos
  const mediaList = data?.backgroundMedia?.length
    ? [...data.backgroundMedia].sort((a, b) => a.order - b.order)
    : localVideos.map((url, i) => ({ type: "video" as const, url, order: i }));

  const [currentIndex, setCurrentIndex] = useState(0);
  const activeMedia = mediaList[currentIndex];

  useEffect(() => {
    if (!activeMedia) return;

    // For images, auto-advance after 6 seconds
    if (activeMedia.type === "image") {
      const timer = setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % mediaList.length);
      }, 6000);
      return () => clearTimeout(timer);
    }
    // Videos handle their own advancement via onEnded
  }, [currentIndex, activeMedia, mediaList.length]);

  const handleVideoEnded = () => {
    setCurrentIndex((prev) => (prev + 1) % mediaList.length);
  };

  return (
    <section className="relative h-screen w-full flex items-center justify-center bg-[#0a0a0a] text-white overflow-hidden">
      {/* Media Loop Engine */}
      <AnimatePresence mode="sync">
        {activeMedia && (
          <motion.div
            key={activeMedia.url + currentIndex}
            initial={{ opacity: 0, scale: 1.0 }}
            animate={{ opacity: 1, scale: 1.05 }}
            exit={{ opacity: 0 }}
            transition={{
              opacity: { duration: 1.5, ease: "easeInOut" },
              scale: { duration: 10, ease: "linear" },
            }}
            className="absolute inset-0"
          >
            {activeMedia.type === "image" ? (
              <img
                src={resolveMediaUrl(activeMedia.url)}
                alt={title}
                className="w-full h-full object-cover"
              />
            ) : (
              <video
                src={resolveMediaUrl(activeMedia.url)}
                autoPlay
                muted
                playsInline
                preload="auto"
                onEnded={handleVideoEnded}
                aria-label={`${title} cinematic reveal`}
                className="w-full h-full object-cover"
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20 z-0 pointer-events-none" />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 text-center px-6 max-w-4xl pointer-events-auto"
      >
        <motion.div variants={fadeUp} className="mb-8">
          <span className="inline-block px-5 py-1.5 rounded-full border border-[#d4a853]/30 bg-[#d4a853]/10 text-[10px] uppercase tracking-[0.3em] text-[#d4a853] backdrop-blur-sm">
            Launch Edition — Limited First Drop
          </span>
        </motion.div>

        <motion.h1
          variants={fadeUp}
          className="text-5xl md:text-8xl font-serif leading-[1.05] tracking-tight"
        >
          <span className="block text-white">{title}</span>
        </motion.h1>

        <motion.p
          variants={fadeUp}
          className="text-xl md:text-3xl font-serif text-[#d4a853]/90 mt-4 italic"
        >
          {tagline}
        </motion.p>

        <motion.p
          variants={fadeUp}
          className="text-gray-300 mt-6 text-sm md:text-base max-w-xl mx-auto leading-relaxed whitespace-pre-line drop-shadow-md"
        >
          {description}
        </motion.p>

        <motion.div
          variants={fadeUp}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          {ctaText && ctaText.trim() !== "" && (
            <Link href={ctaLink}>
              <button className="px-10 py-3.5 bg-[#d4a853] text-black uppercase tracking-widest text-xs font-medium hover:bg-[#e8c97a] hover:scale-105 transition-all duration-300 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4a853]">
                {ctaText}
              </button>
            </Link>
          )}
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 pointer-events-none"
      >
        <div className="w-[1px] h-12 bg-gradient-to-b from-transparent via-[#d4a853]/60 to-transparent mx-auto" />
        <p className="text-[9px] uppercase tracking-[0.35em] text-gray-400 mt-3">
          Scroll
        </p>
      </motion.div>
    </section>
  );
}
