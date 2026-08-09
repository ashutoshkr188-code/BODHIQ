import { Metadata } from "next";
import { serverFetch } from "@/lib/apiClient";
import Image from "next/image";
import AnimatedSection from "@/components/ui/AnimatedSection";
import PageHeader from "@/components/ui/PageHeader";

interface CraftStep {
  number?: string | null;
  title: string;
  subtitle?: string | null;
  description?: string | null;
  image?: string | null;
  enabled: boolean;
  order: number;
}

interface CraftsmanshipCMS {
  section_enabled: boolean;
  page_eyebrow: string | null;
  page_title: string | null;
  page_subtitle: string | null;
  intro_eyebrow: string | null;
  intro_title: string | null;
  intro_body: string | null;
  intro_image: string | null;
  steps: CraftStep[];
  closing_quote: string | null;
  meta_title: string | null;
  meta_description: string | null;
}

export async function generateMetadata(): Promise<Metadata> {
  const cms = await serverFetch<CraftsmanshipCMS>("/content/craftsmanship", { cache: "no-store" }).catch(() => null);
  return {
    title: cms?.meta_title || "Craftsmanship",
    description: cms?.meta_description || "The meticulous craft behind every BODHIQ timepiece.",
    openGraph: {
      title: cms?.meta_title || "BODHIQ Craftsmanship",
      description: cms?.meta_description || "The meticulous craft behind every BODHIQ timepiece.",
    },
  };
}

export default async function CraftsmanshipPage() {
  const cms = await serverFetch<CraftsmanshipCMS>("/content/craftsmanship", { cache: "no-store" }).catch(() => null);

  if (cms && cms.section_enabled === false) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-gray-500 text-sm tracking-widest uppercase">Page unavailable</p>
      </main>
    );
  }

  const enabledSteps = (cms?.steps || [])
    .filter((s) => s.enabled !== false)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  const hasIntro = cms?.intro_title || cms?.intro_body;

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Page Header */}
      <PageHeader
        eyebrow={cms?.page_eyebrow ?? undefined}
        title={cms?.page_title ?? undefined}
        subtitle={cms?.page_subtitle ?? undefined}
      />

      {/* Intro Section */}
      {hasIntro && (
        <section className="px-6 pb-20">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
            <AnimatedSection direction="left">
              {cms?.intro_eyebrow && (
                <p className="text-xs uppercase tracking-[0.35em] text-[#d4a853] mb-4">
                  {cms.intro_eyebrow}
                </p>
              )}
              {cms?.intro_title && (
                <h2 className="text-3xl md:text-4xl font-serif leading-tight mb-6">
                  {cms.intro_title}
                </h2>
              )}
              {cms?.intro_body && (
                <div className="text-gray-400 leading-8 whitespace-pre-line">
                  {cms.intro_body}
                </div>
              )}
            </AnimatedSection>
            {cms?.intro_image && (
              <AnimatedSection direction="right">
                <div className="relative h-80 md:h-[500px] overflow-hidden rounded-xl">
                  <Image
                    src={cms.intro_image}
                    alt={cms.intro_title ?? "BODHIQ craftsmanship"}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>
              </AnimatedSection>
            )}
          </div>
        </section>
      )}

      {/* Craft Steps */}
      {enabledSteps.length > 0 && (
        <section className="px-6 py-20 bg-[#0a0a0a] border-y border-white/5">
          <div className="max-w-6xl mx-auto">
            <div className="grid gap-20">
              {enabledSteps.map((step, index) => (
                <AnimatedSection
                  key={`step-${step.number ?? index}`}
                  direction={index % 2 === 0 ? "left" : "right"}
                >
                  <div className={`grid md:grid-cols-2 gap-12 md:gap-16 items-center ${index % 2 === 1 ? "md:direction-rtl" : ""}`}>
                    {/* Text */}
                    <div className={index % 2 === 1 ? "md:order-2" : ""}>
                      {step.number && (
                        <span className="text-7xl md:text-8xl font-serif text-white/5 font-bold select-none leading-none">
                          {step.number}
                        </span>
                      )}
                      <div className="-mt-4">
                        <h3 className="text-2xl md:text-3xl font-serif">{step.title}</h3>
                        {step.subtitle && (
                          <p className="text-[#d4a853] text-sm mt-2 font-sans">{step.subtitle}</p>
                        )}
                        {step.description && (
                          <p className="text-gray-400 mt-4 leading-8 whitespace-pre-line">
                            {step.description}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Image */}
                    {step.image ? (
                      <div className={`relative h-72 md:h-96 overflow-hidden rounded-xl ${index % 2 === 1 ? "md:order-1" : ""}`}>
                        <Image
                          src={step.image}
                          alt={step.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 50vw"
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      </div>
                    ) : null}
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Closing Quote */}
      {cms?.closing_quote && (
        <section className="px-6 py-24 text-center">
          <div className="max-w-3xl mx-auto">
            <AnimatedSection direction="up">
              <div className="w-12 h-[1px] bg-[#d4a853]/40 mx-auto mb-8" />
              <p className="text-xl md:text-2xl font-serif text-white/80 italic leading-relaxed">
                &ldquo;{cms.closing_quote}&rdquo;
              </p>
              <div className="w-12 h-[1px] bg-[#d4a853]/40 mx-auto mt-8" />
            </AnimatedSection>
          </div>
        </section>
      )}
    </main>
  );
}
