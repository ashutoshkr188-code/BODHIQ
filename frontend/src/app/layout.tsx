import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { serverFetch } from "@/lib/apiClient";
import type { SiteSettings, FooterSettings } from "@/types/api";

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

export async function generateMetadata(): Promise<Metadata> {
  let settings;
  try {
    settings = await serverFetch<SiteSettings>("/settings", { cache: "no-store" });
  } catch (error) {
    console.error("Failed to fetch site settings metadata", error);
  }

  const baseTitle = settings?.seoTitle || "BODHIQ SHUNYA I — Imperfect. Almost. | Luxury Timepiece";
  const baseDescription = settings?.seoDescription || "Discover BODHIQ SHUNYA I — a minimalist luxury watch inspired by imperfection. Hand-finished dial, Kintsugi detailing, and Japanese movement. Limited first drop.";
  const baseKeywords = settings?.seoKeywords || [
    "BODHIQ",
    "SHUNYA I",
    "Imperfect Almost",
    "luxury watch",
    "minimalist watch",
    "Indian luxury brand",
    "Kintsugi watch",
    "premium timepiece",
    "limited edition watch",
    "handcrafted watch",
  ];

  return {
    metadataBase: new URL("https://bodhiq.in"),
    alternates: {
      canonical: "/",
    },
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
      url: "https://bodhiq.in",
      siteName: "BODHIQ",
      title: baseTitle,
      description: baseDescription,
      images: [
        {
          url: "/watches/shunya-1/hero.jpg",
          width: 1200,
          height: 630,
          alt: baseTitle,
        },
      ],
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

  try {
    const [settingsRes, footerRes] = await Promise.all([
      serverFetch<SiteSettings>("/settings", { cache: "no-store" }),
      serverFetch<FooterSettings>("/footer", { cache: "no-store" }),
    ]);
    settings = settingsRes;
    footerData = footerRes;
  } catch (error) {
    console.error("Failed to fetch layout data", error);
  }

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
                url: "https://bodhiq.in",
                logo: "https://bodhiq.in/favicon.ico",
                description:
                  "Luxury handcrafted timepieces that blend ancient wisdom with modern engineering.",
                sameAs: [
                  "https://instagram.com/bodhiq.in",
                ],
                contactPoint: {
                  "@type": "ContactPoint",
                  email: settings?.contactEmail || "bodhiq.official@gmail.com",
                  contactType: "customer service",
                },
              }),
            }}
          />
        </head>
        <body className="min-h-full bg-black text-white font-sans">
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          <Navbar settings={settings as any} />
          {children}
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          <Footer data={footerData as any} settings={settings as any} />
        </body>
      </html>
    </ClerkProvider>
  );
}