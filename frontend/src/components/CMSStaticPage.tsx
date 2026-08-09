import { serverFetch } from "@/lib/apiClient";
import PageHeader from "@/components/ui/PageHeader";

interface CMSPageData {
  slug: string;
  title: string | null;
  content: string | null;
  meta_title: string | null;
  meta_description: string | null;
  section_enabled: boolean;
  visibility?: Record<string, boolean>;
}


interface CMSStaticPageProps {
  slug: string;
  fallbackTitle?: string;
  fallbackSubtitle?: string;
  eyebrow?: string;
  children?: React.ReactNode; // Optional extra content below CMS content
}

/**
 * Generic CMS page renderer for static editorial pages (policy, info, etc.)
 * Renders rich Markdown content stored in cms_page_content table.
 * Shows "Page unavailable" if section_enabled=false.
 * Shows graceful empty state if no content is set yet.
 */
export default async function CMSStaticPage({
  slug,
  fallbackTitle,
  fallbackSubtitle,
  eyebrow,
  children,
}: CMSStaticPageProps) {
  const data = await serverFetch<CMSPageData>(`/content/page/${slug}`, {
    cache: "no-store",
  }).catch(() => null);

  if (data && data.section_enabled === false) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-gray-500 text-sm tracking-widest uppercase">
          Page unavailable
        </p>
      </main>
    );
  }

  const v = data?.visibility ?? {};
  const title = v.title !== false ? (data?.title || fallbackTitle) : undefined;
  const subtitle = data?.section_enabled === true ? undefined : fallbackSubtitle;
  const content = v.content !== false ? (data?.content ?? null) : null;



  return (
    <main className="min-h-screen bg-black text-white">
      <PageHeader eyebrow={eyebrow} title={title ?? undefined} subtitle={subtitle ?? undefined} />


      <section className="px-6 pb-24">
        <div className="max-w-4xl mx-auto">
          {content ? (
            <div
              className="
                prose prose-invert prose-sm md:prose-base max-w-none
                prose-headings:font-serif prose-headings:text-white
                prose-p:text-gray-400 prose-p:leading-8
                prose-li:text-gray-400 prose-li:leading-7
                prose-a:text-[#d4a853] prose-a:no-underline hover:prose-a:underline
                prose-strong:text-white
                prose-hr:border-white/5
                prose-blockquote:border-l-[#d4a853] prose-blockquote:text-gray-400
              "
              dangerouslySetInnerHTML={{ __html: content }}
            />
          ) : (
            <p className="text-gray-600 text-sm text-center py-12">
              Content coming soon.
            </p>
          )}

          {children}
        </div>
      </section>
    </main>
  );
}
