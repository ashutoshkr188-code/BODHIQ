import Link from "next/link";
import { FileText, BookOpen, Info, Shield, MessageSquare, Wrench } from "lucide-react";

const sections = [
  {
    icon: BookOpen,
    title: "About & Craftsmanship",
    desc: "Edit the About page sections and Craftsmanship steps.",
    links: [
      { href: "/dashboard/pages/about", label: "About Page" },
      { href: "/dashboard/pages/craftsmanship", label: "Craftsmanship Page" },
    ],
  },
  {
    icon: MessageSquare,
    title: "FAQs",
    desc: "Add, edit, reorder, and enable/disable FAQ items.",
    links: [{ href: "/dashboard/pages/faqs", label: "Manage FAQs" }],
  },
  {
    icon: Info,
    title: "Info Pages",
    desc: "Edit values, knowledge, media, corporate, and other informational pages.",
    links: [{ href: "/dashboard/pages/info", label: "Info Pages Editor" }],
  },
  {
    icon: Shield,
    title: "Policy Pages",
    desc: "Write or update shipping, returns, privacy, terms, and other legal pages.",
    links: [{ href: "/dashboard/pages/policies", label: "Policy Pages Editor" }],
  },
];

export default function PagesIndex() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-serif text-white">Pages</h1>
        <p className="text-sm text-gray-500 mt-1">Manage all static and editorial pages across the BODHIQ website.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sections.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.title} className="bg-[#0d0d0d] border border-white/5 rounded-2xl p-6 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#d4a853]/10 flex items-center justify-center">
                  <Icon size={16} className="text-[#d4a853]" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">{s.title}</h3>
                  <p className="text-xs text-gray-600">{s.desc}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {s.links.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    className="px-3.5 py-1.5 border border-[#d4a853]/20 text-[#d4a853] text-xs rounded-xl hover:bg-[#d4a853]/5 transition"
                  >
                    {l.label} →
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

