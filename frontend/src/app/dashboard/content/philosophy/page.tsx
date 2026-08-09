"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { Save, RefreshCw, Upload } from "lucide-react";
import { VisibilityField } from "@/features/dashboard/components/VisibilityField";
import { ToastFromHook, useToast } from "@/features/dashboard/components/DashboardToast";
import { getContentPhilosophy, updateContentPhilosophy, uploadMultipleFiles } from "@/features/dashboard/api";

const Field = ({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) => (
  <div className="space-y-1.5">
    <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider">{label}</label>
    {children}
    {hint && <p className="text-[11px] text-gray-600">{hint}</p>}
  </div>
);
const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input {...props} className="w-full bg-[#111] border border-white/8 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-[#d4a853]/40 transition placeholder:text-gray-700" />
);
const Textarea = (props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <textarea {...props} rows={4} className="w-full bg-[#111] border border-white/8 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-[#d4a853]/40 transition placeholder:text-gray-700 resize-y" />
);
const Toggle = ({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) => (
  <label className="flex items-center gap-3 cursor-pointer">
    <div onClick={() => onChange(!checked)} className={`relative w-10 h-5 rounded-full transition-colors ${checked ? "bg-[#d4a853]" : "bg-white/10"}`}>
      <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${checked ? "translate-x-5.5" : "translate-x-0.5"}`} />
    </div>
    <span className="text-sm text-gray-300">{label}</span>
  </label>
);

export default function PhilosophyPage() {
  const { getToken } = useAuth();
  const { toast, show: showToast, hide: hideToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<any>({
    section_enabled: true, eyebrow_label: "", title: "", description: "",
    description2: "", description3: "", image_url: "",
    signature_title: "", signature_subtitle: "",
  });

  useEffect(() => {
    (async () => {
      const token = await getToken();
      if (!token) return;
      const data = await getContentPhilosophy(token).catch(() => null);
      if (data) setForm({ ...form, ...data });
      setLoading(false);
    })();
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      const token = await getToken();
      if (!token) throw new Error("No token");
      await updateContentPhilosophy(token, form);
      showToast("Philosophy section saved.", "success");
    } catch (e: any) {
      showToast(e.message, "error");
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (files: FileList | null) => {
    if (!files?.[0]) return;
    try {
      const token = await getToken();
      if (!token) return;
      const result = await uploadMultipleFiles(token, [files[0]]);
      if (result.files[0]) setForm((f: any) => ({ ...f, image_url: result.files[0].url }));
      showToast("Image uploaded.", "success");
    } catch (e: any) {
      showToast("Upload failed: " + e.message, "error");
    }
  };

  if (loading) return <div className="animate-pulse h-64 bg-white/5 rounded-2xl" />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-serif text-white">Philosophy Section</h1>
        <p className="text-sm text-gray-500 mt-1">Edit the homepage philosophy section content.</p>
      </div>

      <div className="bg-[#0d0d0d] border border-white/5 rounded-2xl p-6 space-y-5">
        <Toggle checked={form.section_enabled} onChange={(v) => setForm({ ...form, section_enabled: v })} label="Section Enabled" />
        <VisibilityField
  label="Eyebrow Label"
  visible={form.visibility?.eyebrow_label ?? true}
  onToggle={(v) => setForm({ ...form, visibility: { ...form.visibility, eyebrow_label: v } })}
>
<Input value={form.eyebrow_label ?? ""} onChange={(e) => setForm({ ...form, eyebrow_label: e.target.value })} placeholder="The Philosophy" /></VisibilityField>
        <VisibilityField
  label="Title"
  visible={form.visibility?.title ?? true}
  onToggle={(v) => setForm({ ...form, visibility: { ...form.visibility, title: v } })}
>
<Input value={form.title ?? ""} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="In a world obsessed with perfection…" /></VisibilityField>
        <VisibilityField
  label="Description (Paragraph 1)"
  hint="Supports line breaks"
  visible={form.visibility?.description ?? true}
  onToggle={(v) => setForm({ ...form, visibility: { ...form.visibility, description: v } })}
>
<Textarea value={form.description ?? ""} onChange={(e) => setForm({ ...form, description: e.target.value })} /></VisibilityField>
        <VisibilityField
  label="Description (Paragraph 2)"
  visible={form.visibility?.description2 ?? true}
  onToggle={(v) => setForm({ ...form, visibility: { ...form.visibility, description2: v } })}
>
<Textarea value={form.description2 ?? ""} onChange={(e) => setForm({ ...form, description2: e.target.value })} /></VisibilityField>
        <VisibilityField
  label="Description (Paragraph 3)"
  hint="Optional italic paragraph"
  visible={form.visibility?.description3 ?? true}
  onToggle={(v) => setForm({ ...form, visibility: { ...form.visibility, description3: v } })}
>
<Textarea value={form.description3 ?? ""} onChange={(e) => setForm({ ...form, description3: e.target.value })} rows={3} /></VisibilityField>

        <div className="h-px bg-white/5" />
        <p className="text-xs uppercase tracking-wider text-gray-600">Signature Block</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <VisibilityField
  label="Signature Title"
  visible={form.visibility?.signature_title ?? true}
  onToggle={(v) => setForm({ ...form, visibility: { ...form.visibility, signature_title: v } })}
>
<Input value={form.signature_title ?? ""} onChange={(e) => setForm({ ...form, signature_title: e.target.value })} placeholder="BODHIQ" /></VisibilityField>
          <VisibilityField
  label="Signature Subtitle"
  visible={form.visibility?.signature_subtitle ?? true}
  onToggle={(v) => setForm({ ...form, visibility: { ...form.visibility, signature_subtitle: v } })}
>
<Input value={form.signature_subtitle ?? ""} onChange={(e) => setForm({ ...form, signature_subtitle: e.target.value })} placeholder="Imperfect. Almost." /></VisibilityField>
        </div>

        <div className="h-px bg-white/5" />
        <p className="text-xs uppercase tracking-wider text-gray-600">Section Image</p>
        {form.image_url && (
          <div className="flex items-center gap-3 bg-white/3 rounded-xl px-4 py-3">
            <img src={form.image_url.startsWith("/uploads") ? `${process.env.NEXT_PUBLIC_API_URL}${form.image_url}` : form.image_url} alt="" className="w-16 h-12 object-cover rounded-lg" />
            <span className="text-xs text-gray-400 flex-1 truncate">{form.image_url}</span>
            <button onClick={() => setForm({ ...form, image_url: null })} className="text-red-400/60 hover:text-red-400 text-xs">Remove</button>
          </div>
        )}
        <label className="block cursor-pointer">
          <div className="border-2 border-dashed border-white/10 rounded-xl p-4 text-center hover:border-[#d4a853]/30 transition">
            <Upload size={16} className="mx-auto mb-2 text-gray-600" />
            <p className="text-xs text-gray-500">Upload new image</p>
          </div>
          <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e.target.files)} />
        </label>
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

