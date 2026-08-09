import { Metadata } from "next";
import Header from "@/components/Header";

export const dynamic = "force-dynamic";
import type { HeaderData } from "@/components/Header";
import PhilosophySection from "@/components/PhilosophySection";
import type { PhilosophyData } from "@/components/PhilosophySection";
import PromoSection from "@/components/PromoSection";
import type { PromoData } from "@/components/PromoSection";
import FeaturedCollection from "@/features/products/components/FeaturedCollection";
import { serverFetch } from "@/lib/apiClient";

export const metadata: Metadata = {
  title: "BODHIQ SHUNYA I — Imperfect. Almost. | Luxury Timepiece",
  description:
    "Discover BODHIQ SHUNYA I — a minimalist luxury watch inspired by imperfection. Hand-finished dial, Kintsugi detailing, limited first drop.",
  keywords: [
    "BODHIQ",
    "SHUNYA I",
    "luxury watch",
    "minimalist watch",
    "Kintsugi watch",
    "Indian luxury brand",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "BODHIQ SHUNYA I — Imperfect. Almost.",
    description:
      "A minimalist luxury watch inspired by imperfection. Limited first drop.",
    images: ["/watches/shunya-1/hero.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "BODHIQ SHUNYA I — Imperfect. Almost.",
    description:
      "A minimalist luxury watch inspired by imperfection. Limited first drop from BODHIQ.",
    images: ["/watches/shunya-1/hero.jpg"],
  },
};

export default async function Home() {
  // Fetch CMS content from FastAPI endpoints
  const [headerRes, homepageRes, philosophyRes, promoRes] = await Promise.allSettled([
    serverFetch<any>("/content/header", { cache: "no-store" }),
    serverFetch<any>("/content/homepage", { cache: "no-store" }),
    serverFetch<any>("/content/philosophy", { cache: "no-store" }),
    serverFetch<any>("/content/promo", { cache: "no-store" }),
  ]);

  const headerContent = headerRes.status === "fulfilled" ? headerRes.value : null;
  const homepageContent = homepageRes.status === "fulfilled" ? homepageRes.value : null;
  const philosophyContent = philosophyRes.status === "fulfilled" ? philosophyRes.value : null;
  const promoContent = promoRes.status === "fulfilled" ? promoRes.value : null;

  // Map backend CMS data to component props
  const mappedHeader: HeaderData = {
    title: homepageContent?.hero_title ?? undefined,
    tagline: homepageContent?.hero_subtitle ?? undefined,
    description: homepageContent?.hero_description ?? undefined,
    ctaText: homepageContent?.hero_cta ?? undefined,
    backgroundMedia: homepageContent?.background_media ?? undefined,
  };

  const mappedPhilosophy: PhilosophyData = {
    title: "The Philosophy",
    subtitle: philosophyContent?.title ?? undefined,
    description1: philosophyContent?.description ?? undefined,
    imageUrl: philosophyContent?.image_url ?? undefined,
    signatureTitle: "BODHIQ",
    signatureSubtitle: "Imperfect. Almost.",
  };

  const mappedPromo: PromoData = {
    title: promoContent?.title || undefined,
    description: promoContent?.description || undefined,
    bgType: promoContent?.bg_type || undefined,
    bgUrl: promoContent?.bg_url || undefined,
    buttonText: promoContent?.button_text || undefined,
    buttonLink: promoContent?.button_link || undefined,
  };

  return (
    <main>
      <Header data={mappedHeader} />
      <PhilosophySection data={mappedPhilosophy} />
      <PromoSection data={mappedPromo} />
      <FeaturedCollection />
    </main>
  );
}
