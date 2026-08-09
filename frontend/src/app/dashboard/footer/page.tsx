"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { getFooterSettings, updateFooterSettings } from "@/features/dashboard/api";
import { DashboardToast, ToastFromHook, useToast } from "@/features/dashboard/components/DashboardToast";
import { Save, Plus, Trash, Globe, Shield, RefreshCw } from "lucide-react";

interface LinkItem {
  label: string;
  href: string;
}

interface SocialLinkItem {
  platform: string;
  href: string;
  icon: string;
}

interface FooterFormData {
  newsletterText: string;
  newsletterPlaceholder: string;
  newsletterButtonText: string;
  companyLinks: LinkItem[];
  quickLinks: LinkItem[];
  contactEmailPrimary: string;
  contactEmailSecondary: string;
  socialLinks: SocialLinkItem[];
  copyrightText: string;
  bottomTagline: string;
}

const emptyForm: FooterFormData = {
  newsletterText: "",
  newsletterPlaceholder: "",
  newsletterButtonText: "",
  companyLinks: [],
  quickLinks: [],
  contactEmailPrimary: "",
  contactEmailSecondary: "",
  socialLinks: [],
  copyrightText: "",
  bottomTagline: "",
};

export default function FooterPage() {
  const { getToken } = useAuth();
  const [formData, setFormData] = useState<FooterFormData>({ ...emptyForm });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const { toast, show: showToast, hide: hideToast } = useToast();

  useEffect(() => {
    loadSettings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadSettings() {
    const token = await getToken();
    if (!token) return;
    try {
      const data = await getFooterSettings(token);
      if (data) {
        setFormData({
          newsletterText: data.newsletterText || "",
          newsletterPlaceholder: data.newsletterPlaceholder || "",
          newsletterButtonText: data.newsletterButtonText || "",
          companyLinks: data.companyLinks || [],
          quickLinks: data.quickLinks || [],
          contactEmailPrimary: data.contactEmailPrimary || "",
          contactEmailSecondary: data.contactEmailSecondary || "",
          socialLinks: data.socialLinks || [],
          copyrightText: data.copyrightText || "",
          bottomTagline: data.bottomTagline || "",
        });
      }
    } catch (e) {
      console.error(e);
      showToast("Failed to load footer settings", "error");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const token = await getToken();
    if (!token) return;

    setSaving(true);
    try {
      await updateFooterSettings(token, formData);
      showToast("Footer settings updated successfully", "success");
    } catch (e) {
      console.error(e);
      showToast("Failed to update footer settings", "error");
    } finally {
      setSaving(false);
    }
  }

  // Links List Helpers
  function addLink(type: "company" | "quick") {
    const listKey = type === "company" ? "companyLinks" : "quickLinks";
    setFormData((prev) => ({
      ...prev,
      [listKey]: [...prev[listKey], { label: "New Link", href: "/" }],
    }));
  }

  function removeLink(type: "company" | "quick", index: number) {
    const listKey = type === "company" ? "companyLinks" : "quickLinks";
    setFormData((prev) => ({
      ...prev,
      [listKey]: prev[listKey].filter((_, i) => i !== index),
    }));
  }

  function handleLinkChange(type: "company" | "quick", index: number, field: "label" | "href", value: string) {
    const listKey = type === "company" ? "companyLinks" : "quickLinks";
    setFormData((prev) => {
      const newList = [...prev[listKey]];
      newList[index] = { ...newList[index], [field]: value };
      return { ...prev, [listKey]: newList };
    });
  }

  // Social Links Helpers
  function addSocialLink() {
    setFormData((prev) => ({
      ...prev,
      socialLinks: [...prev.socialLinks, { platform: "Instagram", href: "https://", icon: "instagram" }],
    }));
  }

  function removeSocialLink(index: number) {
    setFormData((prev) => ({
      ...prev,
      socialLinks: prev.socialLinks.filter((_, i) => i !== index),
    }));
  }

  function handleSocialChange(index: number, field: keyof SocialLinkItem, value: string) {
    setFormData((prev) => {
      const newList = [...prev.socialLinks];
      newList[index] = { ...newList[index], [field]: value };
      return { ...prev, socialLinks: newList };
    });
  }

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-8 w-48 rounded-lg bg-white/[0.04]" />
        <div className="h-64 rounded-2xl bg-white/[0.02]" />
        <div className="h-64 rounded-2xl bg-white/[0.02]" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-[0.25em] text-[#d4a853] font-medium mb-2">Structure</p>
          <h1 className="text-3xl font-serif text-white">Footer Editor</h1>
          <p className="text-sm text-gray-500 mt-1">Configure company links, legal terms, and copyright settings.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Newsletter Section */}
        <div className="rounded-2xl border border-white/[0.04] bg-white/[0.01] p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-white/[0.04] pb-3 mb-2">
            <Globe size={16} className="text-[#d4a853]" />
            <h2 className="text-sm font-medium text-white uppercase tracking-wider">Newsletter Settings</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-[10px] uppercase tracking-[0.15em] text-gray-500 mb-1.5">Newsletter Prompt Text</label>
              <input
                type="text"
                value={formData.newsletterText}
                onChange={(e) => setFormData({ ...formData, newsletterText: e.target.value })}
                className="w-full bg-white/[0.02] border border-white/[0.06] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#d4a853]/30 transition"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-[0.15em] text-gray-500 mb-1.5">Email Placeholder</label>
              <input
                type="text"
                value={formData.newsletterPlaceholder}
                onChange={(e) => setFormData({ ...formData, newsletterPlaceholder: e.target.value })}
                className="w-full bg-white/[0.02] border border-white/[0.06] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#d4a853]/30 transition"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-[0.15em] text-gray-500 mb-1.5">Subscribe Button Text</label>
              <input
                type="text"
                value={formData.newsletterButtonText}
                onChange={(e) => setFormData({ ...formData, newsletterButtonText: e.target.value })}
                className="w-full bg-white/[0.02] border border-white/[0.06] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#d4a853]/30 transition"
              />
            </div>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Company Links */}
          <div className="rounded-2xl border border-white/[0.04] bg-white/[0.01] p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.04] pb-3 mb-2">
              <h2 className="text-sm font-medium text-white uppercase tracking-wider">Company Links</h2>
              <button
                type="button"
                onClick={() => addLink("company")}
                className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-[#d4a853] hover:text-[#e8c97a] transition font-medium"
              >
                <Plus size={12} /> Add
              </button>
            </div>

            <div className="space-y-3">
              {formData.companyLinks.map((link, idx) => (
                <div key={idx} className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={link.label}
                    placeholder="Label"
                    onChange={(e) => handleLinkChange("company", idx, "label", e.target.value)}
                    className="flex-1 bg-white/[0.02] border border-white/[0.06] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#d4a853]/30 transition"
                  />
                  <input
                    type="text"
                    value={link.href}
                    placeholder="Path (e.g. /about)"
                    onChange={(e) => handleLinkChange("company", idx, "href", e.target.value)}
                    className="flex-1 bg-white/[0.02] border border-white/[0.06] rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-[#d4a853]/30 transition"
                  />
                  <button
                    type="button"
                    onClick={() => removeLink("company", idx)}
                    className="p-2 rounded-lg text-gray-500 hover:text-rose-400 hover:bg-rose-500/[0.06] transition"
                  >
                    <Trash size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="rounded-2xl border border-white/[0.04] bg-white/[0.01] p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.04] pb-3 mb-2">
              <h2 className="text-sm font-medium text-white uppercase tracking-wider">Quick Links</h2>
              <button
                type="button"
                onClick={() => addLink("quick")}
                className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-[#d4a853] hover:text-[#e8c97a] transition font-medium"
              >
                <Plus size={12} /> Add
              </button>
            </div>

            <div className="space-y-3">
              {formData.quickLinks.map((link, idx) => (
                <div key={idx} className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={link.label}
                    placeholder="Label"
                    onChange={(e) => handleLinkChange("quick", idx, "label", e.target.value)}
                    className="flex-1 bg-white/[0.02] border border-white/[0.06] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#d4a853]/30 transition"
                  />
                  <input
                    type="text"
                    value={link.href}
                    placeholder="Path (e.g. /faqs)"
                    onChange={(e) => handleLinkChange("quick", idx, "href", e.target.value)}
                    className="flex-1 bg-white/[0.02] border border-white/[0.06] rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-[#d4a853]/30 transition"
                  />
                  <button
                    type="button"
                    onClick={() => removeLink("quick", idx)}
                    className="p-2 rounded-lg text-gray-500 hover:text-rose-400 hover:bg-rose-500/[0.06] transition"
                  >
                    <Trash size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Social Links & Emails */}
        <div className="rounded-2xl border border-white/[0.04] bg-white/[0.01] p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-white/[0.04] pb-3 mb-2">
            <div className="flex items-center gap-2">
              <Shield size={16} className="text-[#d4a853]" />
              <h2 className="text-sm font-medium text-white uppercase tracking-wider">Social Links & Contact</h2>
            </div>
            <button
              type="button"
              onClick={addSocialLink}
              className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-[#d4a853] hover:text-[#e8c97a] transition font-medium"
            >
              <Plus size={12} /> Add Social
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Emails */}
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase tracking-[0.15em] text-gray-500 mb-1.5">Primary Contact Email</label>
                <input
                  type="email"
                  value={formData.contactEmailPrimary}
                  onChange={(e) => setFormData({ ...formData, contactEmailPrimary: e.target.value })}
                  className="w-full bg-white/[0.02] border border-white/[0.06] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#d4a853]/30 transition"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-[0.15em] text-gray-500 mb-1.5">Secondary/Support Email</label>
                <input
                  type="email"
                  value={formData.contactEmailSecondary}
                  onChange={(e) => setFormData({ ...formData, contactEmailSecondary: e.target.value })}
                  className="w-full bg-white/[0.02] border border-white/[0.06] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#d4a853]/30 transition"
                />
              </div>
            </div>

            {/* Social Links List */}
            <div className="space-y-3">
              <label className="block text-[10px] uppercase tracking-[0.15em] text-gray-500">Active Platforms</label>
              {formData.socialLinks.map((social, idx) => (
                <div key={idx} className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={social.platform}
                    placeholder="Platform (e.g. Instagram)"
                    onChange={(e) => handleSocialChange(idx, "platform", e.target.value)}
                    className="flex-1 bg-white/[0.02] border border-white/[0.06] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#d4a853]/30 transition"
                  />
                  <input
                    type="text"
                    value={social.href}
                    placeholder="URL"
                    onChange={(e) => handleSocialChange(idx, "href", e.target.value)}
                    className="flex-1 bg-white/[0.02] border border-white/[0.06] rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-[#d4a853]/30 transition"
                  />
                  <button
                    type="button"
                    onClick={() => removeSocialLink(idx)}
                    className="p-2 rounded-lg text-gray-500 hover:text-rose-400 hover:bg-rose-500/[0.06] transition"
                  >
                    <Trash size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Banner & Taglines */}
        <div className="rounded-2xl border border-white/[0.04] bg-white/[0.01] p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-white/[0.04] pb-3 mb-2">
            <Shield size={16} className="text-[#d4a853]" />
            <h2 className="text-sm font-medium text-white uppercase tracking-wider">Bottom Banner & Copyright</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] uppercase tracking-[0.15em] text-gray-500 mb-1.5">Copyright Text</label>
              <input
                type="text"
                value={formData.copyrightText}
                onChange={(e) => setFormData({ ...formData, copyrightText: e.target.value })}
                className="w-full bg-white/[0.02] border border-white/[0.06] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#d4a853]/30 transition"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-[0.15em] text-gray-500 mb-1.5">Footer Brand Tagline</label>
              <input
                type="text"
                value={formData.bottomTagline}
                onChange={(e) => setFormData({ ...formData, bottomTagline: e.target.value })}
                className="w-full bg-white/[0.02] border border-white/[0.06] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#d4a853]/30 transition"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#d4a853] to-[#e8c97a] text-black text-xs uppercase tracking-widest font-medium rounded-xl hover:shadow-lg hover:shadow-[#d4a853]/10 transition disabled:opacity-50"
          >
            {saving ? (
              <>
                <RefreshCw size={14} className="animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save size={14} />
                Save Changes
              </>
            )}
          </motion.button>
        </div>
      </form>

      {/* Toast */}
      <DashboardToast {...toast} onClose={hideToast} />
    </div>
  );
}


