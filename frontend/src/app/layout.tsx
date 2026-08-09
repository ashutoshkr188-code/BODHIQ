import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { serverFetch } from "@/lib/apiClient";
import type { SiteSettings, FooterSettings } from "@/types/api";
import { cache } from "react";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const getCachedSettings = cache(async () => {
  return serverFetch<SiteSettings>("/settings", { cache: "no-store" });
});

export async function generateMetadata(): Promise<Metadata> {
  let settings;
  try {
    settings = await getCachedSettings();
  } catch (error) {
    console.error("Failed to fetch site settings metadata", error);
  }

  const baseTitle = settings?.seoTitle || "BODHIQ — Luxury Timepieces";
  const baseDescription = settings?.seoDescription || "Discover BODHIQ luxury timepieces.";
  const baseKeywords = settings?.seoKeywords || ["BODHIQ", "luxury watch"];

  return {
    metadataBase: new URL("https://www.bodhiqwatch.com"),
    alternates: { canonical: "/" },
    title: {
      default: baseTitle,
      template: "%s | BODHIQ",
    },
    description: baseDescription,
    keywords: baseKeywords,
    authors: [{ name: "BODHIQ" }],
    creator: "BODHIQ",
    publisher: "BODHIQ",
    openGraph: {
      type: "website",
      locale: "en_IN",
      url: "https://www.bodhiqwatch.com",
      siteName: "BODHIQ",
      title: baseTitle,
      description: baseDescription,
      images: [{ url: "/watches/shunya-1/hero.jpg", width: 1200, height: 630, alt: baseTitle }],
    },
    twitter: {
      card: "summary_large_image",
      title: baseTitle,
      description: baseDescription,
      images: ["/watches/shunya-1/hero.jpg"],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let settings = null;
  let footerData = null;
  let headerData = null;

  try {
    const [settingsRes, footerRes, headerRes] = await Promise.allSettled([
      getCachedSettings(),
      serverFetch<FooterSettings>("/footer", { cache: "no-store" }),
      serverFetch<any>("/content/header", { cache: "no-store" }),
    ]);
    if (settingsRes.status === "fulfilled") settings = settingsRes.value;
    if (footerRes.status === "fulfilled") footerData = footerRes.value;
    if (headerRes.status === "fulfilled") headerData = headerRes.value;
  } catch (error) {
    console.error("Failed to fetch layout data", error);
  }

  // Build nav settings from header CMS data
  const navSettings = {
    logoText: headerData?.logo_text || (settings as any)?.logoText || "BODHIQ",
    navLinks: headerData?.nav_links || null,
    mobileTagline: headerData?.mobile_tagline || null,
    visibility: headerData?.visibility ?? {},
  };


  return (
    <ClerkProvider>
      <html
        lang="en"
        className={`${cormorant.variable} ${inter.variable} h-full antialiased`}
      >
        <head>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Organization",
                name: "BODHIQ",
                url: "https://www.bodhiqwatch.com",
                logo: "https://www.bodhiqwatch.com/favicon.ico",
                description: "Luxury handcrafted timepieces.",
                contactPoint: {
                  "@type": "ContactPoint",
                  email: (settings as any)?.contactEmail || "hello@bodhiq.in",
                  contactType: "customer service",
                },
              }),
            }}
          />
        </head>
        <body className="min-h-full bg-black text-white font-sans">
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          <Navbar settings={navSettings as any} />
          {children}
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          <Footer data={footerData as any} settings={settings as any} />
        </body>
      </html>
    </ClerkProvider>
  );
}