"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { Save, RefreshCw, Upload } from "lucide-react";
import { ToastFromHook, useToast } from "@/features/dashboard/components/DashboardToast";
import { getContentAbout, updateContentAbout, uploadMultipleFiles } from "@/features/dashboard/api";

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
const Divider = ({ label }: { label: string }) => (
  <div className="flex items-center gap-3 py-2">
    <div className="flex-1 h-px bg-white/5" />
    <span className="text-[10px] uppercase tracking-widest text-gray-600 font-medium">{label}</span>
    <div className="flex-1 h-px bg-white/5" />
  </div>
);

const FIELDS: { key: string; label: string; type: "input" | "textarea" | "image"; hint?: string }[] = [
  // Page header
  { key: "page_eyebrow", label: "Page Eyebrow", type: "input" },
  { key: "page_title", label: "Page Title", type: "input" },
  { key: "page_subtitle", label: "Page Subtitle", type: "textarea" },
  // Origin
  { key: "origin_eyebrow", label: "Origin Section — Eyebrow", type: "input" },
  { key: "origin_title", label: "Origin Title", type: "input" },
  { key: "origin_body", label: "Origin Body Text", type: "textarea" },
  { key: "origin_image", label: "Origin Image", type: "image" },
  // Mission
  { key: "mission_eyebrow", label: "Mission Section — Eyebrow", type: "input" },
  { key: "mission_title", label: "Mission Title", type: "input" },
  { key: "mission_body", label: "Mission Body Text", type: "textarea" },
  // Quote
  { key: "quote_text", label: "Quote Banner Text", type: "textarea" },
  { key: "quote_attribution", label: "Quote Attribution", type: "input" },
  // Team
  { key: "team_eyebrow", label: "Team Section — Eyebrow", type: "input" },
  { key: "team_title", label: "Team Title", type: "input" },
  { key: "team_body", label: "Team Body Text", type: "textarea" },
  { key: "team_image", label: "Team Image", type: "image" },
  // CTA
  { key: "cta_eyebrow", label: "CTA Strip — Eyebrow", type: "input" },
  { key: "cta_title", label: "CTA Title", type: "input" },
  { key: "cta_text", label: "CTA Button Text", type: "input" },
  { key: "cta_link", label: "CTA Link", type: "input" },
  // SEO
  { key: "meta_title", label: "SEO Title", type: "input" },
  { key: "meta_description", label: "SEO Description", type: "textarea" },
];

export default function AboutDashboard() {
  const { getToken } = useAuth();
  const { toast, show: showToast, hide: hideToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<Record<string, any>>({ section_enabled: true });

  useEffect(() => {
    (async () => {
      const token = await getToken();
      if (!token) return;
      const data = await getContentAbout(token).catch(() => null);
      if (data) setForm({ ...form, ...data });
      setLoading(false);
    })();
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      const token = await getToken();
      if (!token) throw new Error("No token");
      await updateContentAbout(token, form);
      showToast("About page saved.", "success");
    } catch (e: any) {
      showToast(e.message, "error");
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (fieldKey: string, files: FileList | null) => {
    if (!files?.[0]) return;
    try {
      const token = await getToken();
      if (!token) return;
      const result = await uploadMultipleFiles(token, [files[0]]);
      if (result.files[0]) setForm((f) => ({ ...f, [fieldKey]: result.files[0].url }));
      showToast("Image uploaded.", "success");
    } catch (e: any) {
      showToast("Upload failed: " + e.message, "error");
    }
  };

  if (loading) return <div className="animate-pulse h-96 bg-white/5 rounded-2xl" />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-serif text-white">About Page</h1>
        <p className="text-sm text-gray-500 mt-1">Edit all content sections of the About page.</p>
      </div>

      <div className="bg-[#0d0d0d] border border-white/5 rounded-2xl p-6 space-y-5">
        <Toggle checked={!!form.section_enabled} onChange={(v) => setForm({ ...form, section_enabled: v })} label="Page Enabled" />

        {FIELDS.map((f, idx) => {
          const isFirstOfGroup = idx === 0 || FIELDS[idx - 1].key.split("_")[0] !== f.key.split("_")[0];
          const groupName = f.key.split("_")[0];
          const groupLabels: Record<string, string> = {
            page: "Page Header", origin: "Origin Story", mission: "Mission",
            quote: "Quote Banner", team: "Team", cta: "Call to Action", meta: "SEO",
          };

          return (
            <div key={f.key}>
              {isFirstOfGroup && <Divider label={groupLabels[groupName] || groupName} />}
              <Field label={f.label} hint={f.type === "textarea" ? "Supports line breaks" : undefined}>
                {f.type === "image" ? (
                  <div className="space-y-2">
                    {form[f.key] && (
                      <div className="flex items-center gap-3 bg-white/3 rounded-xl px-4 py-3">
                        <span className="text-xs text-gray-400 flex-1 truncate">{form[f.key]}</span>
                        <button onClick={() => setForm((prev) => ({ ...prev, [f.key]: null }))} className="text-red-400/60 hover:text-red-400 text-xs">Remove</button>
                      </div>
                    )}
                    <label className="block cursor-pointer">
                      <div className="border-2 border-dashed border-white/10 rounded-xl p-3 text-center hover:border-[#d4a853]/30 transition">
                        <Upload size={14} className="mx-auto mb-1 text-gray-600" />
                        <p className="text-xs text-gray-500">{form[f.key] ? "Replace image" : "Upload image"}</p>
                      </div>
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(f.key, e.target.files)} />
                    </label>
                  </div>
                ) : f.type === "textarea" ? (
                  <Textarea value={form[f.key] ?? ""} onChange={(e) => setForm((prev) => ({ ...prev, [f.key]: e.target.value }))} />
                ) : (
                  <Input value={form[f.key] ?? ""} onChange={(e) => setForm((prev) => ({ ...prev, [f.key]: e.target.value }))} />
                )}
              </Field>
            </div>
          );
        })}
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

