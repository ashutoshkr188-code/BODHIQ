import { Metadata } from "next";
import Header from "@/components/Header";
import type { HeaderData } from "@/components/Header";
import PhilosophySection from "@/components/PhilosophySection";
import type { PhilosophyData } from "@/components/PhilosophySection";
import PromoSection from "@/components/PromoSection";
import type { PromoData } from "@/components/PromoSection";
import FeaturedCollection from "@/features/products/components/FeaturedCollection";
import { serverFetch } from "@/lib/apiClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "BODHIQ — Luxury Timepieces",
  description: "Discover BODHIQ luxury timepieces.",
  alternates: { canonical: "/" },
};

export default async function Home() {
  // Fetch all CMS content in parallel
  const [homepageRes, philosophyRes, promoRes] = await Promise.allSettled([
    serverFetch<any>("/content/homepage", { cache: "no-store" }),
    serverFetch<any>("/content/philosophy", { cache: "no-store" }),
    serverFetch<any>("/content/promo", { cache: "no-store" }),
  ]);

  const hp = homepageRes.status === "fulfilled" ? homepageRes.value : null;
  const phil = philosophyRes.status === "fulfilled" ? philosophyRes.value : null;
  const promo = promoRes.status === "fulfilled" ? promoRes.value : null;

  // Map CMS → Header props. No hardcoded editorial fallbacks.
  const headerData: HeaderData = {
    badgeText: hp?.badge_text ?? null,
    badgeVisible: hp?.badge_visible ?? true,
    title: hp?.hero_title ?? null,
    tagline: hp?.hero_subtitle ?? null,
    description: hp?.hero_description ?? null,
    ctaText: hp?.hero_cta ?? null,
    ctaLink: hp?.hero_cta_link ?? "/collection",
    backgroundMedia: hp?.background_media ?? [],
    visibility: hp?.visibility ?? {},
  };


  // Map CMS → Philosophy props
  const philosophyData: PhilosophyData = {
    sectionEnabled: phil?.section_enabled ?? true,
    eyebrowLabel: phil?.eyebrow_label ?? null,
    title: phil?.title ?? null,
    subtitle: null, // philosophy has one title field; subtitle comes from DB title
    description1: phil?.description ?? null,
    description2: phil?.description2 ?? null,
    description3: phil?.description3 ?? null,
    signatureTitle: phil?.signature_title ?? null,
    signatureSubtitle: phil?.signature_subtitle ?? null,
    imageUrl: phil?.image_url ?? null,
    visibility: phil?.visibility ?? {},
  };


  // Map CMS → Promo props
  const promoData: PromoData = {
    sectionEnabled: promo?.section_enabled ?? true,
    eyebrowLabel: promo?.eyebrow_label ?? null,
    title: promo?.title ?? null,
    description: promo?.description ?? null,
    bgType: promo?.bg_type ?? "image",
    bgUrl: promo?.bg_url ?? null,
    buttonText: promo?.button_text ?? null,
    buttonLink: promo?.button_link ?? "/collection",
    visibility: promo?.visibility ?? {},
  };


  return (
    <main>
      <Header data={headerData} />
      <PhilosophySection data={philosophyData} />
      <PromoSection data={promoData} />
      <FeaturedCollection />
    </main>
  );
}
