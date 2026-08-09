"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { getSettings, updateSettings } from "@/features/dashboard/api";
import { DashboardToast, ToastFromHook, useToast } from "@/features/dashboard/components/DashboardToast";
import { Save, RefreshCw, Sliders, Globe, Tag, X } from "lucide-react";

interface SettingsFormData {
  logoText: string;
  contactEmail: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string[];
}

const emptyForm: SettingsFormData = {
  logoText: "",
  contactEmail: "",
  seoTitle: "",
  seoDescription: "",
  seoKeywords: [],
};

export default function SettingsPage() {
  const { getToken } = useAuth();
  const [formData, setFormData] = useState<SettingsFormData>({ ...emptyForm });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [keywordInput, setKeywordInput] = useState("");

  const { toast, show: showToast, hide: hideToast } = useToast();

  useEffect(() => {
    loadSettings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadSettings() {
    const token = await getToken();
    if (!token) return;
    try {
      const data = await getSettings(token);
      if (data) {
        setFormData({
          logoText: data.logoText || "",
          contactEmail: data.contactEmail || "",
          seoTitle: data.seoTitle || "",
          seoDescription: data.seoDescription || "",
          seoKeywords: data.seoKeywords || [],
        });
      }
    } catch (e) {
      console.error(e);
      showToast("Failed to load settings", "error");
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
      await updateSettings(token, formData);
      showToast("Settings updated successfully", "success");
    } catch (e) {
      console.error(e);
      showToast("Failed to update settings", "error");
    } finally {
      setSaving(false);
    }
  }

  // Keywords Helpers
  function addKeyword() {
    const trimmed = keywordInput.trim();
    if (!trimmed) return;
    if (formData.seoKeywords.includes(trimmed)) {
      setKeywordInput("");
      return;
    }
    setFormData((prev) => ({
      ...prev,
      seoKeywords: [...prev.seoKeywords, trimmed],
    }));
    setKeywordInput("");
  }

  function removeKeyword(keyword: string) {
    setFormData((prev) => ({
      ...prev,
      seoKeywords: prev.seoKeywords.filter((k) => k !== keyword),
    }));
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      e.preventDefault();
      addKeyword();
    }
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
      <div>
        <p className="text-[10px] uppercase tracking-[0.25em] text-[#d4a853] font-medium mb-2">Configuration</p>
        <h1 className="text-3xl font-serif text-white">General Settings</h1>
        <p className="text-sm text-gray-500 mt-1">Configure brand assets, SEO meta descriptors, and contact info.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Brand & Assets */}
        <div className="rounded-2xl border border-white/[0.04] bg-white/[0.01] p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-white/[0.04] pb-3 mb-2">
            <Sliders size={16} className="text-[#d4a853]" />
            <h2 className="text-sm font-medium text-white uppercase tracking-wider">Brand Identity</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] uppercase tracking-[0.15em] text-gray-500 mb-1.5">Logo Brand Text</label>
              <input
                required
                type="text"
                value={formData.logoText}
                onChange={(e) => setFormData({ ...formData, logoText: e.target.value })}
                className="w-full bg-white/[0.02] border border-white/[0.06] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#d4a853]/30 transition"
                placeholder="BODHIQ"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-[0.15em] text-gray-500 mb-1.5">Primary Contact Email</label>
              <input
                required
                type="email"
                value={formData.contactEmail}
                onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                className="w-full bg-white/[0.02] border border-white/[0.06] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#d4a853]/30 transition"
                placeholder="hello@bodhiq.in"
              />
            </div>
          </div>
        </div>

        {/* SEO & Metadata */}
        <div className="rounded-2xl border border-white/[0.04] bg-white/[0.01] p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-white/[0.04] pb-3 mb-2">
            <Globe size={16} className="text-[#d4a853]" />
            <h2 className="text-sm font-medium text-white uppercase tracking-wider">SEO & Metadata</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-[10px] uppercase tracking-[0.15em] text-gray-500 mb-1.5">SEO Meta Title</label>
              <input
                required
                type="text"
                value={formData.seoTitle}
                onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
                className="w-full bg-white/[0.02] border border-white/[0.06] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#d4a853]/30 transition"
                placeholder="BODHIQ — Luxury Handcrafted Timepieces"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-[0.15em] text-gray-500 mb-1.5">SEO Meta Description</label>
              <textarea
                required
                value={formData.seoDescription}
                onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
                rows={4}
                className="w-full bg-white/[0.02] border border-white/[0.06] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#d4a853]/30 transition resize-none"
                placeholder="Luxury handcrafted watches inspired by Wabi-Sabi and Kintsugi philosophies..."
              />
            </div>

            {/* Keyword tags */}
            <div>
              <label className="block text-[10px] uppercase tracking-[0.15em] text-gray-500 mb-1.5">SEO Keywords</label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={keywordInput}
                  onChange={(e) => setKeywordInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type a keyword and press Enter..."
                  className="flex-1 bg-white/[0.02] border border-white/[0.06] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#d4a853]/30 transition"
                />
                <button
                  type="button"
                  onClick={addKeyword}
                  className="px-4 bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] rounded-xl text-xs uppercase tracking-wider text-white font-medium transition"
                >
                  Add Tag
                </button>
              </div>

              <div className="flex flex-wrap gap-2 p-3 bg-white/[0.005] border border-white/[0.04] rounded-xl min-h-16">
                {formData.seoKeywords.length === 0 && (
                  <span className="text-xs text-gray-700 italic self-center">No keywords added yet.</span>
                )}
                {formData.seoKeywords.map((k) => (
                  <span
                    key={k}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-[#d4a853]/[0.08] border border-[#d4a853]/20 text-[#d4a853] text-xs font-medium"
                  >
                    <Tag size={10} />
                    {k}
                    <button
                      type="button"
                      onClick={() => removeKeyword(k)}
                      className="hover:text-white transition"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
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


