"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { Save, RefreshCw } from "lucide-react";
import { VisibilityField } from "@/features/dashboard/components/VisibilityField";
import { ToastFromHook, useToast } from "@/features/dashboard/components/DashboardToast";
import { getContentFeaturedCollection, updateContentFeaturedCollection } from "@/features/dashboard/api";

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="space-y-1.5">
    <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider">{label}</label>
    {children}
  </div>
);
const Input = (p: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input {...p} className="w-full bg-[#111] border border-white/8 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-[#d4a853]/40 transition placeholder:text-gray-700" />
);
const Textarea = (p: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <textarea {...p} rows={3} className="w-full bg-[#111] border border-white/8 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-[#d4a853]/40 transition placeholder:text-gray-700 resize-y" />
);
const Toggle = ({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) => (
  <label className="flex items-center gap-3 cursor-pointer">
    <div onClick={() => onChange(!checked)} className={`relative w-10 h-5 rounded-full transition-colors ${checked ? "bg-[#d4a853]" : "bg-white/10"}`}>
      <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${checked ? "translate-x-5.5" : "translate-x-0.5"}`} />
    </div>
    <span className="text-sm text-gray-300">{label}</span>
  </label>
);

export default function FeaturedCollectionDashboard() {
  const { getToken } = useAuth();
  const { toast, show: showToast, hide: hideToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<any>({ section_enabled: true, eyebrow: "", title: "", description: "", cta_text: "", cta_link: "" , visibility: {}});

  useEffect(() => {
    (async () => {
      const token = await getToken();
      if (!token) return;
      const data = await getContentFeaturedCollection(token).catch(() => null);
      if (data) setForm({ ...form, ...data });
      setLoading(false);
    })();
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      const token = await getToken();
      if (!token) throw new Error("No token");
      await updateContentFeaturedCollection(token, form);
      showToast("Featured Collection section saved.", "success");
    } catch (e: any) {
      showToast(e.message, "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="animate-pulse h-48 bg-white/5 rounded-2xl" />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-serif text-white">Featured Collection</h1>
        <p className="text-sm text-gray-500 mt-1">Edit section labels. Products are managed in the Products section.</p>
      </div>

      <div className="bg-[#0d0d0d] border border-white/5 rounded-2xl p-6 space-y-5">
        <Toggle checked={form.section_enabled} onChange={(v) => setForm({ ...form, section_enabled: v })} label="Section Enabled" />
        <VisibilityField
  label="Eyebrow Label"
  visible={form.visibility?.eyebrow ?? true}
  onToggle={(v) => setForm({ ...form, visibility: { ...form.visibility, eyebrow: v } })}
>
<Input value={form.eyebrow ?? ""} onChange={(e) => setForm({ ...form, eyebrow: e.target.value })} placeholder="The Collection" /></VisibilityField>
        <VisibilityField
  label="Section Title"
  visible={form.visibility?.title ?? true}
  onToggle={(v) => setForm({ ...form, visibility: { ...form.visibility, title: v } })}
>
<Input value={form.title ?? ""} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Timeless Presence" /></VisibilityField>
        <VisibilityField
  label="Description"
  visible={form.visibility?.description ?? true}
  onToggle={(v) => setForm({ ...form, visibility: { ...form.visibility, description: v } })}
>
<Textarea value={form.description ?? ""} onChange={(e) => setForm({ ...form, description: e.target.value })} /></VisibilityField>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <VisibilityField
  label="CTA Text"
  visible={form.visibility?.cta_text ?? true}
  onToggle={(v) => setForm({ ...form, visibility: { ...form.visibility, cta_text: v } })}
>
<Input value={form.cta_text ?? ""} onChange={(e) => setForm({ ...form, cta_text: e.target.value })} placeholder="View All" /></VisibilityField>
          <VisibilityField
  label="CTA Link"
  visible={form.visibility?.cta_link ?? true}
  onToggle={(v) => setForm({ ...form, visibility: { ...form.visibility, cta_link: v } })}
>
<Input value={form.cta_link ?? ""} onChange={(e) => setForm({ ...form, cta_link: e.target.value })} placeholder="/collection" /></VisibilityField>
        </div>
      </div>

      <div className="flex justify-end">
        <button onClick={save} disabled={saving} className="flex items-center gap-2 px-5 py-2 bg-[#d4a853] hover:bg-[#e8c97a] text-black text-xs uppercase tracking-widest font-semibold rounded-xl transition disabled:opacity-50">
          {saving ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />}
          {saving ? "Saving…" : "Save Changes"}
        </button>
      </div>
      <ToastFromHook toast={toast} onClose={hideToast} />
    </div>
  );
}

