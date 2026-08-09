"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { Save, RefreshCw, Plus, Trash2, GripVertical } from "lucide-react";
import { ToastFromHook, useToast } from "@/features/dashboard/components/DashboardToast";
import { VisibilityField } from "@/features/dashboard/components/VisibilityField";

import {
  getFooterSettings, updateFooterSettings,
} from "@/features/dashboard/api";

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

export default function FooterSettingsPage() {
  const { getToken } = useAuth();
  const { toast, show: showToast, hide: hideToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [form, setForm] = useState<any>({
    newsletter_eyebrow: "",
    newsletter_title: "",
    newsletter_text: "",
    newsletter_placeholder: "",
    newsletter_button_text: "",
    company_section_label: "",
    quick_links_section_label: "",
    contact_section_label: "",
    contact_email_primary: "",
    contact_email_secondary: "",
    help_text: "",
    gifting_text: "",
    copyright_text: "",
    bottom_tagline: "",
    visibility: {},
    company_links: [],
    quick_links: [],
  });

  useEffect(() => {
    (async () => {
      const token = await getToken();
      if (!token) return;
      const data = await getFooterSettings(token).catch(() => null);
      if (data) {
        // Map from camelCase to snake_case to match form and models
        const mapped = {
          newsletter_eyebrow: data.newsletterEyebrow,
          newsletter_title: data.newsletterTitle,
          newsletter_text: data.newsletterText,
          newsletter_placeholder: data.newsletterPlaceholder,
          newsletter_button_text: data.newsletterButtonText,
          company_section_label: data.companySectionLabel,
          quick_links_section_label: data.quickLinksSectionLabel,
          contact_section_label: data.contactSectionLabel,
          contact_email_primary: data.contactEmailPrimary,
          contact_email_secondary: data.contactEmailSecondary,
          help_text: data.helpText,
          gifting_text: data.giftingText,
          copyright_text: data.copyrightText,
          bottom_tagline: data.bottomTagline,
          company_links: data.companyLinks || [],
          quick_links: data.quickLinks || [],
          visibility: data.visibility || {},
        };
        setForm({ ...form, ...mapped });
      }
      setLoading(false);
    })();
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      const token = await getToken();
      if (!token) throw new Error("No token");
      await updateFooterSettings(token, form);
      showToast("Footer settings saved.", "success");
    } catch (e: any) {
      showToast(e.message || "Failed to save.", "error");
    } finally {
      setSaving(false);
    }
  };

  const updateLink = (listName: "company_links" | "quick_links", index: number, key: string, val: string) => {
    const newLinks = [...form[listName]];
    newLinks[index] = { ...newLinks[index], [key]: val };
    setForm({ ...form, [listName]: newLinks });
  };

  const removeLink = (listName: "company_links" | "quick_links", index: number) => {
    const newLinks = [...form[listName]];
    newLinks.splice(index, 1);
    setForm({ ...form, [listName]: newLinks });
  };

  const addLink = (listName: "company_links" | "quick_links") => {
    const newLinks = [...form[listName]];
    newLinks.push({ label: "New Link", href: "/" });
    setForm({ ...form, [listName]: newLinks });
  };


  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-serif">Footer Content</h1>
            <p className="text-gray-500 mt-1">Manage global footer settings.</p>
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
          <h1 className="text-3xl font-serif">Footer Content</h1>
          <p className="text-gray-500 mt-1">Manage global footer settings.</p>
        </div>
        <SaveBtn saving={saving} onClick={save} />
      </div>

      <SectionCard title="Newsletter Section">
        <VisibilityField
          label="Eyebrow"
          visible={form.visibility?.newsletter_eyebrow ?? true}
          onToggle={(v) => setForm({ ...form, visibility: { ...form.visibility, newsletter_eyebrow: v } })}
        >
          <Input value={form.newsletter_eyebrow ?? ""} onChange={(e) => setForm({ ...form, newsletter_eyebrow: e.target.value })} />
        </VisibilityField>

        <VisibilityField
          label="Title"
          visible={form.visibility?.newsletter_title ?? true}
          onToggle={(v) => setForm({ ...form, visibility: { ...form.visibility, newsletter_title: v } })}
        >
          <Input value={form.newsletter_title ?? ""} onChange={(e) => setForm({ ...form, newsletter_title: e.target.value })} />
        </VisibilityField>
        
        <VisibilityField
          label="Description Text"
          visible={form.visibility?.newsletter_text ?? true}
          onToggle={(v) => setForm({ ...form, visibility: { ...form.visibility, newsletter_text: v } })}
        >
          <Textarea value={form.newsletter_text ?? ""} onChange={(e) => setForm({ ...form, newsletter_text: e.target.value })} />
        </VisibilityField>

        <div className="grid grid-cols-2 gap-4">
          <VisibilityField
            label="Input Placeholder"
            visible={form.visibility?.newsletter_placeholder ?? true}
            onToggle={(v) => setForm({ ...form, visibility: { ...form.visibility, newsletter_placeholder: v } })}
          >
            <Input value={form.newsletter_placeholder ?? ""} onChange={(e) => setForm({ ...form, newsletter_placeholder: e.target.value })} />
          </VisibilityField>

          <VisibilityField
            label="Button Text"
            visible={form.visibility?.newsletter_button_text ?? true}
            onToggle={(v) => setForm({ ...form, visibility: { ...form.visibility, newsletter_button_text: v } })}
          >
            <Input value={form.newsletter_button_text ?? ""} onChange={(e) => setForm({ ...form, newsletter_button_text: e.target.value })} />
          </VisibilityField>
        </div>
      </SectionCard>

      <SectionCard title="Section Labels">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <VisibilityField
            label="Company Links Label"
            visible={form.visibility?.company_section_label ?? true}
            onToggle={(v) => setForm({ ...form, visibility: { ...form.visibility, company_section_label: v } })}
          >
            <Input value={form.company_section_label ?? ""} onChange={(e) => setForm({ ...form, company_section_label: e.target.value })} />
          </VisibilityField>

          <VisibilityField
            label="Quick Links Label"
            visible={form.visibility?.quick_links_section_label ?? true}
            onToggle={(v) => setForm({ ...form, visibility: { ...form.visibility, quick_links_section_label: v } })}
          >
            <Input value={form.quick_links_section_label ?? ""} onChange={(e) => setForm({ ...form, quick_links_section_label: e.target.value })} />
          </VisibilityField>

          <VisibilityField
            label="Contact Label"
            visible={form.visibility?.contact_section_label ?? true}
            onToggle={(v) => setForm({ ...form, visibility: { ...form.visibility, contact_section_label: v } })}
          >
            <Input value={form.contact_section_label ?? ""} onChange={(e) => setForm({ ...form, contact_section_label: e.target.value })} />
          </VisibilityField>
        </div>
      </SectionCard>

      <SectionCard title="Link Lists">
        <div className="grid grid-cols-2 gap-8">
          <div>
            <h4 className="text-sm font-medium text-white mb-4">Company Links</h4>
            <div className="space-y-3">
              {form.company_links.map((link: any, i: number) => (
                <div key={i} className="flex items-center gap-3">
                  <Input value={link.label} onChange={(e) => updateLink("company_links", i, "label", e.target.value)} placeholder="Label" />
                  <Input value={link.href} onChange={(e) => updateLink("company_links", i, "href", e.target.value)} placeholder="/link" />
                  <button onClick={() => removeLink("company_links", i)} className="text-rose-500 hover:text-rose-400 p-2"><Trash2 size={16} /></button>
                </div>
              ))}
              <button onClick={() => addLink("company_links")} className="text-xs text-[#d4a853] hover:text-[#e8c97a] flex items-center gap-1 mt-2">
                <Plus size={12} /> Add Link
              </button>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-medium text-white mb-4">Quick Links</h4>
            <div className="space-y-3">
              {form.quick_links.map((link: any, i: number) => (
                <div key={i} className="flex items-center gap-3">
                  <Input value={link.label} onChange={(e) => updateLink("quick_links", i, "label", e.target.value)} placeholder="Label" />
                  <Input value={link.href} onChange={(e) => updateLink("quick_links", i, "href", e.target.value)} placeholder="/link" />
                  <button onClick={() => removeLink("quick_links", i)} className="text-rose-500 hover:text-rose-400 p-2"><Trash2 size={16} /></button>
                </div>
              ))}
              <button onClick={() => addLink("quick_links")} className="text-xs text-[#d4a853] hover:text-[#e8c97a] flex items-center gap-1 mt-2">
                <Plus size={12} /> Add Link
              </button>
            </div>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Contact Information">
        <div className="grid grid-cols-2 gap-4">
          <VisibilityField
            label="Primary Email"
            visible={form.visibility?.contact_email_primary ?? true}
            onToggle={(v) => setForm({ ...form, visibility: { ...form.visibility, contact_email_primary: v } })}
          >
            <Input value={form.contact_email_primary ?? ""} onChange={(e) => setForm({ ...form, contact_email_primary: e.target.value })} placeholder="Usually defaults to Site Settings email" />
          </VisibilityField>

          <VisibilityField
            label="Secondary Email (Optional)"
            visible={form.visibility?.contact_email_secondary ?? true}
            onToggle={(v) => setForm({ ...form, visibility: { ...form.visibility, contact_email_secondary: v } })}
          >
            <Input value={form.contact_email_secondary ?? ""} onChange={(e) => setForm({ ...form, contact_email_secondary: e.target.value })} />
          </VisibilityField>
        </div>
        
        <VisibilityField
          label="Help Text"
          visible={form.visibility?.help_text ?? true}
          onToggle={(v) => setForm({ ...form, visibility: { ...form.visibility, help_text: v } })}
        >
          <Input value={form.help_text ?? ""} onChange={(e) => setForm({ ...form, help_text: e.target.value })} />
        </VisibilityField>
        
        <VisibilityField
          label="Gifting Text"
          visible={form.visibility?.gifting_text ?? true}
          onToggle={(v) => setForm({ ...form, visibility: { ...form.visibility, gifting_text: v } })}
        >
          <Input value={form.gifting_text ?? ""} onChange={(e) => setForm({ ...form, gifting_text: e.target.value })} />
        </VisibilityField>
      </SectionCard>
      
      <SectionCard title="Footer Bottom">
        <VisibilityField
          label="Copyright Text"
          visible={form.visibility?.copyright_text ?? true}
          onToggle={(v) => setForm({ ...form, visibility: { ...form.visibility, copyright_text: v } })}
        >
          <Input value={form.copyright_text ?? ""} onChange={(e) => setForm({ ...form, copyright_text: e.target.value })} />
        </VisibilityField>

        <VisibilityField
          label="Bottom Tagline (Right side)"
          visible={form.visibility?.bottom_tagline ?? true}
          onToggle={(v) => setForm({ ...form, visibility: { ...form.visibility, bottom_tagline: v } })}
        >
          <Input value={form.bottom_tagline ?? ""} onChange={(e) => setForm({ ...form, bottom_tagline: e.target.value })} />
        </VisibilityField>
      </SectionCard>

      {toast && <ToastFromHook toast={toast} onClose={hideToast} />}
    </div>
  );
}
