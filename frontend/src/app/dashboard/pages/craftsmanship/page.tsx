"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { Save, RefreshCw, Plus, Trash2, GripVertical, Upload, ChevronUp, ChevronDown } from "lucide-react";
import { VisibilityField } from "@/features/dashboard/components/VisibilityField";
import { ToastFromHook, useToast } from "@/features/dashboard/components/DashboardToast";
import { getContentCraftsmanship, updateContentCraftsmanship, uploadMultipleFiles } from "@/features/dashboard/api";

const Input = (p: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input {...p} className="w-full bg-[#0a0a0a] border border-white/8 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-[#d4a853]/40 transition placeholder:text-gray-700" />
);
const Textarea = (p: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <textarea {...p} rows={3} className="w-full bg-[#0a0a0a] border border-white/8 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-[#d4a853]/40 transition placeholder:text-gray-700 resize-y" />
);
const Toggle = ({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) => (
  <label className="flex items-center gap-3 cursor-pointer">
    <div onClick={() => onChange(!checked)} className={`relative w-10 h-5 rounded-full transition-colors ${checked ? "bg-[#d4a853]" : "bg-white/10"}`}>
      <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${checked ? "translate-x-5.5" : "translate-x-0.5"}`} />
    </div>
    <span className="text-sm text-gray-300">{label}</span>
  </label>
);

const emptyStep = () => ({
  number: "", title: "", subtitle: "", description: "", image: null, enabled: true, order: 0,
});

export default function CraftsmanshipDashboard() {
  const { getToken } = useAuth();
  const { toast, show: showToast, hide: hideToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<any>({
    section_enabled: true, page_eyebrow: "", page_title: "", page_subtitle: "",
    intro_eyebrow: "", intro_title: "", intro_body: "", intro_image: null,
    steps: [], closing_quote: "", meta_title: "", meta_description: "",
  });

  useEffect(() => {
    (async () => {
      const token = await getToken();
      if (!token) return;
      const data = await getContentCraftsmanship(token).catch(() => null);
      if (data) setForm({ ...form, ...data, steps: data.steps || [] });
      setLoading(false);
    })();
  }, []);

  const setField = (key: string, value: any) => setForm((f: any) => ({ ...f, [key]: value }));
  const setStep = (idx: number, key: string, value: any) => setForm((f: any) => ({ ...f, steps: f.steps.map((s: any, i: number) => i === idx ? { ...s, [key]: value } : s) }));
  const addStep = () => setForm((f: any) => ({ ...f, steps: [...f.steps, { ...emptyStep(), order: f.steps.length, number: String(f.steps.length + 1).padStart(2, "0") }] }));
  const removeStep = (idx: number) => setForm((f: any) => ({ ...f, steps: f.steps.filter((_: any, i: number) => i !== idx).map((s: any, i: number) => ({ ...s, order: i })) }));
  const moveStep = (idx: number, dir: -1 | 1) => {
    const newSteps = [...form.steps];
    const swapIdx = idx + dir;
    if (swapIdx < 0 || swapIdx >= newSteps.length) return;
    [newSteps[idx], newSteps[swapIdx]] = [newSteps[swapIdx], newSteps[idx]];
    setForm((f: any) => ({ ...f, steps: newSteps.map((s: any, i: number) => ({ ...s, order: i })) }));
  };

  const uploadStepImage = async (idx: number, files: FileList | null) => {
    if (!files?.[0]) return;
    const token = await getToken();
    if (!token) return;
    const result = await uploadMultipleFiles(token, [files[0]]).catch(() => null);
    if (result?.files[0]) setStep(idx, "image", result.files[0].url);
  };

  const save = async () => {
    setSaving(true);
    try {
      const token = await getToken();
      if (!token) throw new Error("No token");
      await updateContentCraftsmanship(token, form);
      showToast("Craftsmanship page saved.", "success");
    } catch (e: any) {
      showToast(e.message, "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="animate-pulse h-96 bg-white/5 rounded-2xl" />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-serif text-white">Craftsmanship Page</h1>
        <p className="text-sm text-gray-500 mt-1">Edit page content and manage craft steps (add, reorder, delete).</p>
      </div>

      {/* Page Header */}
      <div className="bg-[#0d0d0d] border border-white/5 rounded-2xl p-6 space-y-4">
        <h3 className="text-sm font-medium text-white/60 uppercase tracking-wider">Page Header</h3>
        <Toggle checked={form.section_enabled} onChange={(v) => setField("section_enabled", v)} label="Page Enabled" />
        <VisibilityField label="Eyebrow Label" visible={form.visibility?.page_eyebrow ?? true} onToggle={(v) => setForm((f: any) => ({ ...f, visibility: { ...f.visibility, page_eyebrow: v } }))}>
          <Input value={form.page_eyebrow ?? ""} onChange={(e) => setField("page_eyebrow", e.target.value)} placeholder="Eyebrow label" />
        </VisibilityField>
        <VisibilityField label="Page Title" visible={form.visibility?.page_title ?? true} onToggle={(v) => setForm((f: any) => ({ ...f, visibility: { ...f.visibility, page_title: v } }))}>
          <Input value={form.page_title ?? ""} onChange={(e) => setField("page_title", e.target.value)} placeholder="Page title" />
        </VisibilityField>
        <VisibilityField label="Page Subtitle" visible={form.visibility?.page_subtitle ?? true} onToggle={(v) => setForm((f: any) => ({ ...f, visibility: { ...f.visibility, page_subtitle: v } }))}>
          <Textarea value={form.page_subtitle ?? ""} onChange={(e) => setField("page_subtitle", e.target.value)} placeholder="Page subtitle" />
        </VisibilityField>
      </div>

      {/* Intro Section */}
      <div className="bg-[#0d0d0d] border border-white/5 rounded-2xl p-6 space-y-4">
        <h3 className="text-sm font-medium text-white/60 uppercase tracking-wider">Intro Section</h3>
        <VisibilityField label="Intro Eyebrow" visible={form.visibility?.intro_eyebrow ?? true} onToggle={(v) => setForm((f: any) => ({ ...f, visibility: { ...f.visibility, intro_eyebrow: v } }))}>
          <Input value={form.intro_eyebrow ?? ""} onChange={(e) => setField("intro_eyebrow", e.target.value)} placeholder="Intro eyebrow" />
        </VisibilityField>
        <VisibilityField label="Intro Title" visible={form.visibility?.intro_title ?? true} onToggle={(v) => setForm((f: any) => ({ ...f, visibility: { ...f.visibility, intro_title: v } }))}>
          <Input value={form.intro_title ?? ""} onChange={(e) => setField("intro_title", e.target.value)} placeholder="Intro title" />
        </VisibilityField>
        <VisibilityField label="Intro Body" visible={form.visibility?.intro_body ?? true} onToggle={(v) => setForm((f: any) => ({ ...f, visibility: { ...f.visibility, intro_body: v } }))}>
          <Textarea value={form.intro_body ?? ""} onChange={(e) => setField("intro_body", e.target.value)} placeholder="Intro body text" rows={4} />
        </VisibilityField>
        <VisibilityField label="Intro Image" visible={form.visibility?.intro_image ?? true} onToggle={(v) => setForm((f: any) => ({ ...f, visibility: { ...f.visibility, intro_image: v } }))}>
          <label className="block cursor-pointer">
            <div className="border-2 border-dashed border-white/10 rounded-xl p-3 text-center hover:border-[#d4a853]/30 transition">
              <Upload size={14} className="mx-auto mb-1 text-gray-600" />
              <p className="text-xs text-gray-500">{form.intro_image ? "Replace intro image" : "Upload intro image"}</p>
            </div>
            <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
              const token = await getToken();
              if (!token || !e.target.files?.[0]) return;
              const r = await uploadMultipleFiles(token, [e.target.files[0]]).catch(() => null);
              if (r?.files[0]) setField("intro_image", r.files[0].url);
            }} />
          </label>
        </VisibilityField>
      </div>

      {/* Craft Steps */}
      <div className="bg-[#0d0d0d] border border-white/5 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-white/60 uppercase tracking-wider">Craft Steps</h3>
          <button onClick={addStep} className="flex items-center gap-1.5 px-3 py-1.5 border border-[#d4a853]/30 text-[#d4a853] rounded-lg text-xs hover:bg-[#d4a853]/5 transition">
            <Plus size={13} /> Add Step
          </button>
        </div>

        {form.steps.length === 0 && (
          <p className="text-xs text-gray-600 text-center py-6">No steps yet. Click "Add Step" to create the first one.</p>
        )}

        {form.steps.map((step: any, idx: number) => (
          <div key={idx} className="border border-white/5 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <GripVertical size={14} className="text-gray-700 shrink-0" />
                <span className="text-xs text-gray-500 font-mono">{step.number || `#${idx + 1}`}</span>
              </div>
              <Toggle checked={step.enabled !== false} onChange={(v) => setStep(idx, "enabled", v)} label="Enabled" />
              <div className="flex items-center gap-1">
                <button onClick={() => moveStep(idx, -1)} disabled={idx === 0} className="p-1 text-gray-600 hover:text-white disabled:opacity-30 transition"><ChevronUp size={13} /></button>
                <button onClick={() => moveStep(idx, 1)} disabled={idx === form.steps.length - 1} className="p-1 text-gray-600 hover:text-white disabled:opacity-30 transition"><ChevronDown size={13} /></button>
                <button onClick={() => removeStep(idx)} className="p-1 text-red-400/60 hover:text-red-400 transition"><Trash2 size={13} /></button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input value={step.number ?? ""} onChange={(e) => setStep(idx, "number", e.target.value)} placeholder="Step number (01)" />
              <Input value={step.title} onChange={(e) => setStep(idx, "title", e.target.value)} placeholder="Step title (required)" />
            </div>
            <Input value={step.subtitle ?? ""} onChange={(e) => setStep(idx, "subtitle", e.target.value)} placeholder="Subtitle (optional)" />
            <Textarea value={step.description ?? ""} onChange={(e) => setStep(idx, "description", e.target.value)} placeholder="Step description" />
            <label className="block cursor-pointer">
              <div className="border border-dashed border-white/10 rounded-lg p-2 text-center hover:border-[#d4a853]/30 transition">
                <p className="text-xs text-gray-600">{step.image ? `Image: ${step.image}` : "Upload step image (optional)"}</p>
              </div>
              <input type="file" accept="image/*" className="hidden" onChange={(e) => uploadStepImage(idx, e.target.files)} />
            </label>
          </div>
        ))}
      </div>

      {/* Closing Quote & SEO */}
      <div className="bg-[#0d0d0d] border border-white/5 rounded-2xl p-6 space-y-4">
        <h3 className="text-sm font-medium text-white/60 uppercase tracking-wider">Closing Quote</h3>
        <VisibilityField label="Closing Quote" visible={form.visibility?.closing_quote ?? true} onToggle={(v) => setForm((f: any) => ({ ...f, visibility: { ...f.visibility, closing_quote: v } }))}>
          <Textarea value={form.closing_quote ?? ""} onChange={(e) => setField("closing_quote", e.target.value)} placeholder="Closing quote shown at the bottom of the page" />
        </VisibilityField>
        <h3 className="text-sm font-medium text-white/60 uppercase tracking-wider pt-2">SEO</h3>
        <Input value={form.meta_title ?? ""} onChange={(e) => setField("meta_title", e.target.value)} placeholder="SEO title" />
        <Textarea value={form.meta_description ?? ""} onChange={(e) => setField("meta_description", e.target.value)} placeholder="SEO description" rows={2} />
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

