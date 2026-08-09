import { Metadata } from "next";
import { serverFetch } from "@/lib/apiClient";
import Image from "next/image";
import Link from "next/link";
import AnimatedSection from "@/components/ui/AnimatedSection";
import SectionDivider from "@/components/ui/SectionDivider";
import PageHeader from "@/components/ui/PageHeader";

interface AboutCMS {
  section_enabled: boolean;
  page_eyebrow: string | null;
  page_title: string | null;
  page_subtitle: string | null;
  origin_eyebrow: string | null;
  origin_title: string | null;
  origin_body: string | null;
  origin_image: string | null;
  mission_eyebrow: string | null;
  mission_title: string | null;
  mission_body: string | null;
  quote_text: string | null;
  quote_attribution: string | null;
  team_eyebrow: string | null;
  team_title: string | null;
  team_body: string | null;
  team_image: string | null;
  cta_eyebrow: string | null;
  cta_title: string | null;
  cta_text: string | null;
  cta_link: string | null;
  meta_title: string | null;
  meta_description: string | null;
  visibility?: Record<string, boolean>;
}


export async function generateMetadata(): Promise<Metadata> {
  const cms = await serverFetch<AboutCMS>("/content/about", { cache: "no-store" }).catch(() => null);
  return {
    title: cms?.meta_title || "About Us",
    description: cms?.meta_description || "Discover the story behind BODHIQ.",
    openGraph: {
      title: cms?.meta_title || "About BODHIQ",
      description: cms?.meta_description || "Discover the story behind BODHIQ.",
      images: ["/watches/watch-detail.jpg"],
    },
  };
}

export default async function AboutPage() {
  const cms = await serverFetch<AboutCMS>("/content/about", { cache: "no-store" }).catch(() => null);

  if (cms && cms.section_enabled === false) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-gray-500 text-sm tracking-widest uppercase">Page unavailable</p>
      </main>
    );
  }

  if (cms) {
    const v = cms.visibility ?? {};
    const keys = Object.keys(cms) as (keyof AboutCMS)[];
    for (const key of keys) {
       if (key !== 'visibility' && key !== 'section_enabled' && v[key] === false) {
           (cms as any)[key] = null;
       }
    }
  }

  const hasOrigin = cms?.origin_title || cms?.origin_body;
  const hasMission = cms?.mission_title || cms?.mission_body;
  const hasQuote = cms?.quote_text;
  const hasTeam = cms?.team_title || cms?.team_body;
  const hasCta = cms?.cta_title || cms?.cta_text;


  return (
    <main className="min-h-screen bg-black text-white">
      {/* Page Header */}
      <PageHeader
      eyebrow={cms?.page_eyebrow ?? undefined}
        title={cms?.page_title ?? undefined}
        subtitle={cms?.page_subtitle ?? undefined}
      />

      {/* Origin Story */}
      {hasOrigin && (
        <section className="px-6 pb-20">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
            <AnimatedSection direction="left">
              {cms?.origin_eyebrow && (
                <p className="text-xs uppercase tracking-[0.35em] text-[#d4a853] mb-4">
                  {cms.origin_eyebrow}
                </p>
              )}
              {cms?.origin_title && (
                <h2 className="text-3xl md:text-4xl font-serif leading-tight mb-6">
                  {cms.origin_title}
                </h2>
              )}
              {cms?.origin_body && (
                <div className="text-gray-400 leading-8 whitespace-pre-line">
                  {cms.origin_body}
                </div>
              )}
            </AnimatedSection>

            {cms?.origin_image ? (
              <AnimatedSection direction="right">
                <div className="relative h-80 md:h-[500px] overflow-hidden rounded-xl">
                  <Image
                    src={cms.origin_image}
                    alt={cms.origin_title ?? "BODHIQ origin"}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>
              </AnimatedSection>
            ) : null}
          </div>
        </section>
      )}

      {hasOrigin && <SectionDivider />}

      {/* Mission */}
      {hasMission && (
        <section className="px-6 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <AnimatedSection direction="up">
              {cms?.mission_eyebrow && (
                <p className="text-xs uppercase tracking-[0.35em] text-[#d4a853] mb-4">
                  {cms.mission_eyebrow}
                </p>
              )}
              {cms?.mission_title && (
                <h2 className="text-3xl md:text-4xl font-serif leading-tight mb-6">
                  {cms.mission_title}
                </h2>
              )}
              {cms?.mission_body && (
                <p className="text-gray-400 leading-8 max-w-2xl mx-auto whitespace-pre-line">
                  {cms.mission_body}
                </p>
              )}
            </AnimatedSection>
          </div>
        </section>
      )}

      {/* Quote Banner */}
      {hasQuote && (
        <section className="relative px-6 py-24 bg-[#0a0a0a] border-y border-white/5">
          <div className="max-w-4xl mx-auto text-center">
            <AnimatedSection direction="up">
              <p className="text-2xl md:text-4xl font-serif text-white/80 italic leading-relaxed">
                &ldquo;{cms!.quote_text}&rdquo;
              </p>
              {cms?.quote_attribution && (
                <p className="mt-6 text-[10px] uppercase tracking-[0.4em] text-[#d4a853]">
                  {cms.quote_attribution}
                </p>
              )}
            </AnimatedSection>
          </div>
        </section>
      )}

      {/* Team */}
      {hasTeam && (
        <section className="px-6 py-20">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
            {cms?.team_image ? (
              <AnimatedSection direction="left">
                <div className="relative h-80 md:h-[500px] overflow-hidden rounded-xl">
                  <Image
                    src={cms.team_image}
                    alt={cms.team_title ?? "BODHIQ team"}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>
              </AnimatedSection>
            ) : null}

            <AnimatedSection direction="right">
              {cms?.team_eyebrow && (
                <p className="text-xs uppercase tracking-[0.35em] text-[#d4a853] mb-4">
                  {cms.team_eyebrow}
                </p>
              )}
              {cms?.team_title && (
                <h2 className="text-3xl md:text-4xl font-serif leading-tight mb-6">
                  {cms.team_title}
                </h2>
              )}
              {cms?.team_body && (
                <p className="text-gray-400 leading-8 whitespace-pre-line">
                  {cms.team_body}
                </p>
              )}
            </AnimatedSection>
          </div>
        </section>
      )}

      {/* CTA Strip */}
      {hasCta && (
        <section className="px-6 py-20 bg-[#0a0a0a] border-t border-white/5">
          <div className="max-w-2xl mx-auto text-center">
            <AnimatedSection direction="up">
              {cms?.cta_eyebrow && (
                <p className="text-xs uppercase tracking-[0.35em] text-[#d4a853] mb-4">
                  {cms.cta_eyebrow}
                </p>
              )}
              {cms?.cta_title && (
                <h2 className="text-2xl md:text-3xl font-serif mb-8">{cms.cta_title}</h2>
              )}
              {cms?.cta_text && (
                <Link href={cms.cta_link || "/collection"}>
                  <button className="px-10 py-3.5 bg-[#d4a853] text-black uppercase tracking-widest text-xs font-medium hover:bg-[#e8c97a] hover:scale-105 transition-all duration-300 rounded-full">
                    {cms.cta_text}
                  </button>
                </Link>
              )}
            </AnimatedSection>
          </div>
        </section>
      )}
    </main>
  );
}
