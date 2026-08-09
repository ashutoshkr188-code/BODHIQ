"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { Save, RefreshCw, Eye, EyeOff, Video, Image, Plus, Trash2, GripVertical, Link } from "lucide-react";
import { ToastFromHook, useToast } from "@/features/dashboard/components/DashboardToast";
import { VisibilityField } from "@/features/dashboard/components/VisibilityField";

import {
  getContentHomepage, updateContentHomepage,
  getContentFeaturedCollection, updateContentFeaturedCollection,
  getContentHeader, updateContentHeader,
  uploadMultipleFiles,
} from "@/features/dashboard/api";

// ─── Shared UI Helpers ────────────────────────────────────────────────────────

// Replaced by VisibilityField

const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input
    {...props}
    className="w-full bg-[#111] border border-white/8 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-[#d4a853]/40 transition placeholder:text-gray-700"
  />
);

const Textarea = (props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <textarea
    {...props}
    rows={4}
    className="w-full bg-[#111] border border-white/8 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-[#d4a853]/40 transition placeholder:text-gray-700 resize-y"
  />
);

const Toggle = ({
  checked, onChange, label,
}: { checked: boolean; onChange: (v: boolean) => void; label: string }) => (
  <label className="flex items-center gap-3 cursor-pointer">
    <div
      onClick={() => onChange(!checked)}
      className={`relative w-10 h-5.5 rounded-full transition-colors duration-200 ${checked ? "bg-[#d4a853]" : "bg-white/10"}`}
    >
      <div className={`absolute top-0.5 w-4.5 h-4.5 rounded-full bg-white transition-transform duration-200 ${checked ? "translate-x-5" : "translate-x-0.5"}`} />
    </div>
    <span className="text-sm text-gray-300">{label}</span>
  </label>
);

const SectionCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="bg-[#0d0d0d] border border-white/5 rounded-2xl p-6 space-y-5">
    <h3 className="text-base font-serif text-white/80">{title}</h3>
    <div className="h-px bg-white/5" />
    {children}
  </div>
);

const SaveBtn = ({ saving, onClick }: { saving: boolean; onClick: () => void }) => (
  <button
    onClick={onClick}
    disabled={saving}
    className="flex items-center gap-2 px-5 py-2 bg-[#d4a853] hover:bg-[#e8c97a] text-black text-xs uppercase tracking-widest font-semibold rounded-xl transition disabled:opacity-50"
  >
    {saving ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />}
    {saving ? "Saving…" : "Save Changes"}
  </button>
);

// ─── Homepage Hero Editor ─────────────────────────────────────────────────────

function HeroEditor() {
  const { getToken } = useAuth();
  const { toast, show: showToast, hide: hideToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<any>({
    badge_text: "", badge_visible: true,
    hero_title: "", hero_subtitle: "", hero_description: "", hero_cta: "", hero_cta_link: "",
    section_enabled: true, background_media: [],
    visibility: {},
  });


  useEffect(() => {
    (async () => {
      const token = await getToken();
      if (!token) return;
      const data = await getContentHomepage(token).catch(() => null);
      if (data) setForm({ ...form, ...data });
      setLoading(false);
    })();
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      const token = await getToken();
      if (!token) throw new Error("No token");
      await updateContentHomepage(token, form);
      showToast("Hero saved.", "success");
    } catch (e: any) {
      showToast(e.message || "Failed to save.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleMediaUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    try {
      const token = await getToken();
      if (!token) return;
      const result = await uploadMultipleFiles(token, Array.from(files));
      const newItems = result.files.map((f, i) => ({
        type: f.type,
        url: f.url,
        order: (form.background_media?.length || 0) + i,
      }));
      setForm((f: any) => ({ ...f, background_media: [...(f.background_media || []), ...newItems] }));
    } catch (e: any) {
      showToast("Upload failed: " + e.message, "error");
    }
  };

  if (loading) return <div className="animate-pulse h-64 bg-white/5 rounded-2xl" />;

  return (
    <div className="space-y-4">
      <SectionCard title="Hero Section">
        <Toggle
          checked={form.section_enabled}
          onChange={(v) => setForm({ ...form, section_enabled: v })}
          label="Section Enabled"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <VisibilityField
            label="Badge Text"
            hint="Leave blank to hide the badge completely"
            visible={form.visibility?.badge_text ?? true}
            onToggle={(v) => setForm({ ...form, visibility: { ...form.visibility, badge_text: v } })}
          >
            <Input
              value={form.badge_text ?? ""}
              onChange={(e) => setForm({ ...form, badge_text: e.target.value })}
              placeholder="Launch Edition — Limited First Drop"
            />
          </VisibilityField>
          <div className="flex items-center">
            {/* Kept empty for grid alignment or can add other fields */}
          </div>
        </div>

        <VisibilityField
          label="Hero Title"
          visible={form.visibility?.hero_title ?? true}
          onToggle={(v) => setForm({ ...form, visibility: { ...form.visibility, hero_title: v } })}
        >
          <Input value={form.hero_title ?? ""} onChange={(e) => setForm({ ...form, hero_title: e.target.value })} placeholder="BODHIQ SHUNYA I" />
        </VisibilityField>

        <VisibilityField
          label="Hero Tagline / Subtitle"
          visible={form.visibility?.hero_subtitle ?? true}
          onToggle={(v) => setForm({ ...form, visibility: { ...form.visibility, hero_subtitle: v } })}
        >
          <Input value={form.hero_subtitle ?? ""} onChange={(e) => setForm({ ...form, hero_subtitle: e.target.value })} placeholder="Imperfect. Almost." />
        </VisibilityField>

        <VisibilityField
          label="Hero Description"
          hint="Supports line breaks"
          visible={form.visibility?.hero_description ?? true}
          onToggle={(v) => setForm({ ...form, visibility: { ...form.visibility, hero_description: v } })}
        >
          <Textarea value={form.hero_description ?? ""} onChange={(e) => setForm({ ...form, hero_description: e.target.value })} placeholder="A minimalist luxury timepiece…" />
        </VisibilityField>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <VisibilityField
            label="CTA Button Text"
            visible={form.visibility?.hero_cta ?? true}
            onToggle={(v) => setForm({ ...form, visibility: { ...form.visibility, hero_cta: v } })}
          >
            <Input value={form.hero_cta ?? ""} onChange={(e) => setForm({ ...form, hero_cta: e.target.value })} placeholder="Explore" />
          </VisibilityField>

          <VisibilityField
            label="CTA Link URL"
            visible={form.visibility?.hero_cta_link ?? true}
            onToggle={(v) => setForm({ ...form, visibility: { ...form.visibility, hero_cta_link: v } })}
          >
            <div className="flex items-center gap-2">
              <Link size={14} className="text-gray-600 shrink-0" />
              <Input value={form.hero_cta_link ?? ""} onChange={(e) => setForm({ ...form, hero_cta_link: e.target.value })} placeholder="/collection" />
            </div>
          </VisibilityField>
        </div>
      </SectionCard>

      <SectionCard title="Background Media">
        <p className="text-xs text-gray-600">Upload videos or images. They will loop in order.</p>
        <label className="block cursor-pointer">
          <div className="border-2 border-dashed border-white/10 rounded-xl p-6 text-center hover:border-[#d4a853]/30 transition">
            <Video size={20} className="mx-auto mb-2 text-gray-600" />
            <p className="text-xs text-gray-500">Click to upload videos / images</p>
          </div>
          <input
            type="file"
            accept="video/*,image/*"
            multiple
            className="hidden"
            onChange={(e) => handleMediaUpload(e.target.files)}
          />
        </label>

        {form.background_media && form.background_media.length > 0 && (
          <div className="space-y-2">
            {form.background_media.map((m: any, i: number) => (
              <div key={i} className="flex items-center gap-3 bg-white/3 rounded-xl px-4 py-2.5">
                {m.type === "video" ? <Video size={14} className="text-[#d4a853] shrink-0" /> : <Image size={14} className="text-[#d4a853] shrink-0" />}
                <span className="text-xs text-gray-400 flex-1 truncate">{m.url}</span>
                <button
                  onClick={() => {
                    // Update visibility to toggle background media globally if needed, 
                    // or just manage visibility globally for 'background_media'
                    setForm({
                      ...form,
                      visibility: { ...form.visibility, background_media: !(form.visibility?.background_media ?? true) }
                    });
                  }}
                  className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] uppercase font-bold transition-colors mr-2 ${
                    (form.visibility?.background_media ?? true)
                      ? "bg-[#d4a853]/10 text-[#d4a853] hover:bg-[#d4a853]/20"
                      : "bg-red-500/10 text-red-400 hover:bg-red-500/20"
                  }`}
                >
                  {(form.visibility?.background_media ?? true) ? <Eye size={12} /> : <EyeOff size={12} />}
                </button>
                <button
                  onClick={() => setForm((f: any) => ({ ...f, background_media: f.background_media.filter((_: any, j: number) => j !== i) }))}
                  className="text-red-400/60 hover:text-red-400 transition"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>
        )}

      </SectionCard>

      <div className="flex justify-end">
        <SaveBtn saving={saving} onClick={save} />
      </div>

      <ToastFromHook toast={toast} onClose={hideToast} />
    </div>
  );
}

// ─── Featured Collection Editor ───────────────────────────────────────────────

function FeaturedCollectionEditor() {
  const { getToken } = useAuth();
  const { toast, show: showToast, hide: hideToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<any>({ section_enabled: true, eyebrow: "", title: "", description: "", cta_text: "", cta_link: "", visibility: {} });


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
      showToast("Featured Collection saved.", "success");
    } catch (e: any) {
      showToast(e.message || "Failed to save.", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="animate-pulse h-40 bg-white/5 rounded-2xl" />;

  return (
    <div className="space-y-4">
      <SectionCard title="Featured Collection Section">
        <Toggle checked={form.section_enabled} onChange={(v) => setForm({ ...form, section_enabled: v })} label="Section Enabled" />
        
        <VisibilityField
          label="Eyebrow Label"
          visible={form.visibility?.eyebrow ?? true}
          onToggle={(v) => setForm({ ...form, visibility: { ...form.visibility, eyebrow: v } })}
        >
          <Input value={form.eyebrow ?? ""} onChange={(e) => setForm({ ...form, eyebrow: e.target.value })} placeholder="The Collection" />
        </VisibilityField>

        <VisibilityField
          label="Section Title"
          visible={form.visibility?.title ?? true}
          onToggle={(v) => setForm({ ...form, visibility: { ...form.visibility, title: v } })}
        >
          <Input value={form.title ?? ""} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Timeless Presence" />
        </VisibilityField>

        <VisibilityField
          label="Description"
          visible={form.visibility?.description ?? true}
          onToggle={(v) => setForm({ ...form, visibility: { ...form.visibility, description: v } })}
        >
          <Textarea value={form.description ?? ""} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Discover our latest collection." />
        </VisibilityField>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <VisibilityField
            label="CTA Text"
            visible={form.visibility?.cta_text ?? true}
            onToggle={(v) => setForm({ ...form, visibility: { ...form.visibility, cta_text: v } })}
          >
            <Input value={form.cta_text ?? ""} onChange={(e) => setForm({ ...form, cta_text: e.target.value })} placeholder="View All" />
          </VisibilityField>

          <VisibilityField
            label="CTA Link"
            visible={form.visibility?.cta_link ?? true}
            onToggle={(v) => setForm({ ...form, visibility: { ...form.visibility, cta_link: v } })}
          >
            <Input value={form.cta_link ?? ""} onChange={(e) => setForm({ ...form, cta_link: e.target.value })} placeholder="/collection" />
          </VisibilityField>
        </div>
      </SectionCard>
      <div className="flex justify-end"><SaveBtn saving={saving} onClick={save} /></div>
      <ToastFromHook toast={toast} onClose={hideToast} />
    </div>
  );
}

// ─── Page Component ───────────────────────────────────────────────────────────

export default function ContentPage() {
  const [activeTab, setActiveTab] = useState<"hero" | "featured">("hero");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-serif text-white">Homepage</h1>
        <p className="text-sm text-gray-500 mt-1">Edit hero banner and featured collection section.</p>
      </div>

      <div className="flex gap-2 border-b border-white/5 pb-1">
        {([["hero", "Hero Section"], ["featured", "Featured Collection"]] as const).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`px-4 py-2 text-xs uppercase tracking-wider rounded-t-lg transition ${activeTab === key ? "text-[#d4a853] border-b-2 border-[#d4a853]" : "text-gray-500 hover:text-gray-300"}`}
          >
            {label}
          </button>
        ))}
      </div>

      {activeTab === "hero" && <HeroEditor />}
      {activeTab === "featured" && <FeaturedCollectionEditor />}
    </div>
  );
}

