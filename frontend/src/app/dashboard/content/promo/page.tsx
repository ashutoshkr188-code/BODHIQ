"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { Save, RefreshCw, Upload } from "lucide-react";
import { ToastFromHook, useToast } from "@/features/dashboard/components/DashboardToast";
import { getContentPromo, updateContentPromo, uploadMultipleFiles } from "@/features/dashboard/api";

const Field = ({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) => (
  <div className="space-y-1.5">
    <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider">{label}</label>
    {children}
    {hint && <p className="text-[11px] text-gray-600">{hint}</p>}
  </div>
);
const Input = (p: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input {...p} className="w-full bg-[#111] border border-white/8 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-[#d4a853]/40 transition placeholder:text-gray-700" />
);
const Textarea = (p: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <textarea {...p} rows={4} className="w-full bg-[#111] border border-white/8 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-[#d4a853]/40 transition placeholder:text-gray-700 resize-y" />
);
const Toggle = ({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) => (
  <label className="flex items-center gap-3 cursor-pointer">
    <div onClick={() => onChange(!checked)} className={`relative w-10 h-5 rounded-full transition-colors ${checked ? "bg-[#d4a853]" : "bg-white/10"}`}>
      <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${checked ? "translate-x-5.5" : "translate-x-0.5"}`} />
    </div>
    <span className="text-sm text-gray-300">{label}</span>
  </label>
);

export default function PromoPage() {
  const { getToken } = useAuth();
  const { toast, show: showToast, hide: hideToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<any>({
    section_enabled: true, eyebrow_label: "", title: "", description: "",
    bg_type: "image", bg_url: "", button_text: "", button_link: "",
  });

  useEffect(() => {
    (async () => {
      const token = await getToken();
      if (!token) return;
      const data = await getContentPromo(token).catch(() => null);
      if (data) setForm({ ...form, ...data });
      setLoading(false);
    })();
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      const token = await getToken();
      if (!token) throw new Error("No token");
      await updateContentPromo(token, form);
      showToast("Promo banner saved.", "success");
    } catch (e: any) {
      showToast(e.message, "error");
    } finally {
      setSaving(false);
    }
  };

  const handleMediaUpload = async (files: FileList | null) => {
    if (!files?.[0]) return;
    try {
      const token = await getToken();
      if (!token) return;
      const result = await uploadMultipleFiles(token, [files[0]]);
      if (result.files[0]) {
        setForm((f: any) => ({ ...f, bg_url: result.files[0].url, bg_type: result.files[0].type }));
      }
      showToast("Media uploaded.", "success");
    } catch (e: any) {
      showToast("Upload failed: " + e.message, "error");
    }
  };

  if (loading) return <div className="animate-pulse h-64 bg-white/5 rounded-2xl" />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-serif text-white">Promo Banner</h1>
        <p className="text-sm text-gray-500 mt-1">Edit the homepage promotional banner section.</p>
      </div>

      <div className="bg-[#0d0d0d] border border-white/5 rounded-2xl p-6 space-y-5">
        <Toggle checked={form.section_enabled} onChange={(v) => setForm({ ...form, section_enabled: v })} label="Section Enabled" />
        <Field label="Eyebrow Label"><Input value={form.eyebrow_label ?? ""} onChange={(e) => setForm({ ...form, eyebrow_label: e.target.value })} placeholder="Featured Spotlight" /></Field>
        <Field label="Title"><Input value={form.title ?? ""} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="The Art of Kintsugi" /></Field>
        <Field label="Description"><Textarea value={form.description ?? ""} onChange={(e) => setForm({ ...form, description: e.target.value })} /></Field>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Button Text"><Input value={form.button_text ?? ""} onChange={(e) => setForm({ ...form, button_text: e.target.value })} placeholder="Explore Craftsmanship" /></Field>
          <Field label="Button Link"><Input value={form.button_link ?? ""} onChange={(e) => setForm({ ...form, button_link: e.target.value })} placeholder="/collection" /></Field>
        </div>

        <div className="h-px bg-white/5" />
        <p className="text-xs uppercase tracking-wider text-gray-600">Background Media</p>
        <div className="flex gap-3">
          {["image", "video"].map((t) => (
            <button key={t} onClick={() => setForm({ ...form, bg_type: t })} className={`px-4 py-1.5 rounded-full text-xs border transition ${form.bg_type === t ? "border-[#d4a853] text-[#d4a853]" : "border-white/10 text-gray-500 hover:border-white/20"}`}>{t}</button>
          ))}
        </div>
        {form.bg_url && (
          <div className="flex items-center gap-3 bg-white/3 rounded-xl px-4 py-3">
            <span className="text-xs text-gray-400 flex-1 truncate">{form.bg_url}</span>
            <button onClick={() => setForm({ ...form, bg_url: null })} className="text-red-400/60 hover:text-red-400 text-xs">Remove</button>
          </div>
        )}
        <label className="block cursor-pointer">
          <div className="border-2 border-dashed border-white/10 rounded-xl p-4 text-center hover:border-[#d4a853]/30 transition">
            <Upload size={16} className="mx-auto mb-2 text-gray-600" />
            <p className="text-xs text-gray-500">Upload background {form.bg_type}</p>
          </div>
          <input type="file" accept={form.bg_type === "video" ? "video/*" : "image/*"} className="hidden" onChange={(e) => handleMediaUpload(e.target.files)} />
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

