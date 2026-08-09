"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { Save, RefreshCw, ExternalLink } from "lucide-react";
import Link from "next/link";
import { ToastFromHook, useToast } from "@/features/dashboard/components/DashboardToast";
import { getCMSPage, updateCMSPage } from "@/features/dashboard/api";

const Input = (p: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input {...p} className="w-full bg-[#111] border border-white/8 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-[#d4a853]/40 transition placeholder:text-gray-700" />
);
const Textarea = (p: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <textarea {...p} className="w-full bg-[#111] border border-white/8 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-[#d4a853]/40 transition placeholder:text-gray-700 resize-y font-mono text-xs" />
);
const Toggle = ({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) => (
  <label className="flex items-center gap-3 cursor-pointer">
    <div onClick={() => onChange(!checked)} className={`relative w-10 h-5 rounded-full transition-colors ${checked ? "bg-[#d4a853]" : "bg-white/10"}`}>
      <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${checked ? "translate-x-5.5" : "translate-x-0.5"}`} />
    </div>
    <span className="text-sm text-gray-300">{label}</span>
  </label>
);

interface PageEditorProps { slug: string; label: string; }

function PageEditor({ slug, label }: PageEditorProps) {
  const { getToken } = useAuth();
  const { toast, show: showToast, hide: hideToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ title: "", content: "", meta_title: "", meta_description: "", section_enabled: true });

  useEffect(() => {
    setLoading(true);
    (async () => {
      const token = await getToken();
      if (!token) return;
      const data = await getCMSPage(token, slug).catch(() => null);
      if (data) setForm({ title: data.title || "", content: data.content || "", meta_title: data.meta_title || "", meta_description: data.meta_description || "", section_enabled: data.section_enabled ?? true });
      setLoading(false);
    })();
  }, [slug]);

  const save = async () => {
    setSaving(true);
    try {
      const token = await getToken();
      if (!token) throw new Error("No token");
      await updateCMSPage(token, slug, form);
      showToast(`${label} saved.`, "success");
    } catch (e: any) {
      showToast(e.message, "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="animate-pulse h-32 bg-white/5 rounded-2xl" />;

  return (
    <div className="bg-[#0d0d0d] border border-white/5 rounded-2xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-white">{label}</h3>
        <Link href={`/${slug}`} target="_blank" className="flex items-center gap-1 text-xs text-gray-600 hover:text-[#d4a853] transition">
          <ExternalLink size={12} /> Preview
        </Link>
      </div>
      <Toggle checked={form.section_enabled} onChange={(v) => setForm({ ...form, section_enabled: v })} label="Page enabled" />
      <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Page title (overrides default)" />
      <div className="space-y-1">
        <label className="text-xs text-gray-500 uppercase tracking-wider">Content (Markdown or HTML)</label>
        <Textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={12} placeholder={`# ${label}\n\nWrite your page content in Markdown here.\n\n## Section\n\nContent goes here...`} />
        <p className="text-[10px] text-gray-700">Markdown is converted and sanitized automatically. Supports headings, lists, bold, links.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Input value={form.meta_title} onChange={(e) => setForm({ ...form, meta_title: e.target.value })} placeholder="SEO title" />
        <Input value={form.meta_description} onChange={(e) => setForm({ ...form, meta_description: e.target.value })} placeholder="SEO description" />
      </div>
      <div className="flex justify-end">
        <button onClick={save} disabled={saving} className="flex items-center gap-2 px-4 py-2 bg-[#d4a853] hover:bg-[#e8c97a] text-black text-xs uppercase tracking-widest font-semibold rounded-xl transition disabled:opacity-50">
          {saving ? <RefreshCw size={13} className="animate-spin" /> : <Save size={13} />}
          {saving ? "Saving…" : "Save"}
        </button>
      </div>
      <ToastFromHook toast={toast} onClose={hideToast} />
    </div>
  );
}

const INFO_PAGES = [
  { slug: "values", label: "Our Values" },
  { slug: "knowledge", label: "Knowledge" },
  { slug: "corporate", label: "Corporate Gifting" },
  { slug: "media", label: "Media / Press" },
  { slug: "distributor", label: "Become a Distributor" },
  { slug: "grievance", label: "Grievance Redressal" },
  { slug: "download-app", label: "Download the App" },
];

export default function InfoPagesEditor() {
  const [selected, setSelected] = useState(INFO_PAGES[0].slug);
  const page = INFO_PAGES.find((p) => p.slug === selected)!;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-serif text-white">Info Pages</h1>
        <p className="text-sm text-gray-500 mt-1">Edit content for all informational pages. Write Markdown, it will be rendered as HTML.</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {INFO_PAGES.map((p) => (
          <button
            key={p.slug}
            onClick={() => setSelected(p.slug)}
            className={`px-3.5 py-1.5 rounded-xl text-xs transition font-medium ${selected === p.slug ? "bg-[#d4a853] text-black" : "border border-white/10 text-gray-500 hover:text-white hover:border-white/20"}`}
          >
            {p.label}
          </button>
        ))}
      </div>

      <PageEditor key={selected} slug={selected} label={page.label} />
    </div>
  );
}

