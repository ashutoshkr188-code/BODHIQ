"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { Save, RefreshCw, Plus, Trash2, GripVertical, ChevronDown, ChevronRight } from "lucide-react";
import { ToastFromHook, useToast } from "@/features/dashboard/components/DashboardToast";
import { VisibilityField } from "@/features/dashboard/components/VisibilityField";

import {
  getContentHeader, updateContentHeader,
} from "@/features/dashboard/api";

const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input
    {...props}
    className="w-full bg-[#111] border border-white/8 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-[#d4a853]/40 transition placeholder:text-gray-700"
  />
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

export default function GlobalSettingsPage() {
  const { getToken } = useAuth();
  const { toast, show: showToast, hide: hideToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [form, setForm] = useState<any>({
    logo_text: "",
    mobile_tagline: "",
    nav_links: [],
    visibility: {},
  });

  useEffect(() => {
    (async () => {
      const token = await getToken();
      if (!token) return;
      const data = await getContentHeader(token).catch(() => null);
      if (data) setForm({ ...form, ...data });
      setLoading(false);
    })();
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      const token = await getToken();
      if (!token) throw new Error("No token");
      await updateContentHeader(token, form);
      showToast("Settings saved.", "success");
    } catch (e: any) {
      showToast(e.message || "Failed to save.", "error");
    } finally {
      setSaving(false);
    }
  };

  const updateNavLink = (index: number, key: string, val: any) => {
    const newLinks = [...(form.nav_links || [])];
    newLinks[index] = { ...newLinks[index], [key]: val };
    setForm({ ...form, nav_links: newLinks });
  };

  const removeNavLink = (index: number) => {
    const newLinks = [...(form.nav_links || [])];
    newLinks.splice(index, 1);
    setForm({ ...form, nav_links: newLinks });
  };

  const addNavLink = () => {
    const newLinks = [...(form.nav_links || [])];
    newLinks.push({ title: "New Link", href: "/", dropdown: null });
    setForm({ ...form, nav_links: newLinks });
  };

  const addDropdown = (parentIndex: number) => {
    const newLinks = [...(form.nav_links || [])];
    if (!newLinks[parentIndex].dropdown) newLinks[parentIndex].dropdown = [];
    newLinks[parentIndex].dropdown.push({ title: "Sub Link", href: "/" });
    setForm({ ...form, nav_links: newLinks });
  };

  const updateDropdown = (parentIndex: number, childIndex: number, key: string, val: any) => {
    const newLinks = [...(form.nav_links || [])];
    newLinks[parentIndex].dropdown[childIndex] = { ...newLinks[parentIndex].dropdown[childIndex], [key]: val };
    setForm({ ...form, nav_links: newLinks });
  };

  const removeDropdown = (parentIndex: number, childIndex: number) => {
    const newLinks = [...(form.nav_links || [])];
    newLinks[parentIndex].dropdown.splice(childIndex, 1);
    if (newLinks[parentIndex].dropdown.length === 0) newLinks[parentIndex].dropdown = null;
    setForm({ ...form, nav_links: newLinks });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-serif">Header & Navigation</h1>
            <p className="text-gray-500 mt-1">Manage global navigation settings.</p>
          </div>
        </div>
        <div className="animate-pulse h-64 bg-white/5 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20 relative">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif">Header & Navigation</h1>
          <p className="text-gray-500 mt-1">Manage global navigation settings.</p>
        </div>
        <SaveBtn saving={saving} onClick={save} />
      </div>

      <SectionCard title="Brand Identity">
        <VisibilityField
          label="Logo Text"
          visible={form.visibility?.logo_text ?? true}
          onToggle={(v) => setForm({ ...form, visibility: { ...form.visibility, logo_text: v } })}
        >
          <Input value={form.logo_text ?? ""} onChange={(e) => setForm({ ...form, logo_text: e.target.value })} placeholder="BODHIQ" />
        </VisibilityField>

        <VisibilityField
          label="Mobile Tagline"
          visible={form.visibility?.mobile_tagline ?? true}
          onToggle={(v) => setForm({ ...form, visibility: { ...form.visibility, mobile_tagline: v } })}
        >
          <Input value={form.mobile_tagline ?? ""} onChange={(e) => setForm({ ...form, mobile_tagline: e.target.value })} placeholder="Luxury handcrafted timepieces." />
        </VisibilityField>
      </SectionCard>

      <SectionCard title="Navigation Menu">
        <div className="space-y-4">
          {(form.nav_links || []).map((link: any, i: number) => (
            <div key={i} className="bg-white/[0.02] border border-white/5 p-4 rounded-xl space-y-4 relative group">
              <div className="flex gap-4 items-start pr-8">
                <GripVertical className="text-gray-600 mt-2 cursor-grab" size={20} />
                <div className="flex-1 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-gray-500 mb-1.5 block uppercase tracking-wider">Label</label>
                      <Input value={link.title} onChange={(e) => updateNavLink(i, "title", e.target.value)} />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 mb-1.5 block uppercase tracking-wider">Link</label>
                      <Input value={link.href} onChange={(e) => updateNavLink(i, "href", e.target.value)} />
                    </div>
                  </div>
                  
                  {/* Dropdown Items */}
                  {link.dropdown && link.dropdown.length > 0 && (
                    <div className="pl-6 border-l-2 border-white/10 space-y-3">
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Dropdown Items</p>
                      {link.dropdown.map((sub: any, j: number) => (
                        <div key={j} className="flex gap-4 items-start relative group/sub">
                           <div className="flex-1 grid grid-cols-2 gap-4">
                              <Input value={sub.title} onChange={(e) => updateDropdown(i, j, "title", e.target.value)} placeholder="Sub Label" />
                              <Input value={sub.href} onChange={(e) => updateDropdown(i, j, "href", e.target.value)} placeholder="/link" />
                           </div>
                           <button onClick={() => removeDropdown(i, j)} className="mt-2 text-rose-500/50 hover:text-rose-500 transition">
                              <Trash2 size={16} />
                           </button>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <button onClick={() => addDropdown(i)} className="text-xs text-[#d4a853] hover:text-[#e8c97a] flex items-center gap-1 mt-2">
                    <Plus size={12} /> Add Dropdown Link
                  </button>

                </div>
              </div>
              <button 
                onClick={() => removeNavLink(i)} 
                className="absolute top-4 right-4 text-rose-500/0 group-hover:text-rose-500/50 hover:!text-rose-500 transition p-2"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
          
          <button
            onClick={addNavLink}
            className="w-full py-4 border border-dashed border-white/10 rounded-xl text-gray-500 hover:text-white hover:border-white/30 transition flex items-center justify-center gap-2 text-sm"
          >
            <Plus size={16} /> Add Navigation Link
          </button>
        </div>
      </SectionCard>

      {toast && <ToastFromHook toast={toast} onClose={hideToast} />}
    </div>
  );
}
