"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { motion } from "framer-motion";
import {
  getContentHeader,
  updateContentHeader,
  getContentPhilosophy,
  updateContentPhilosophy,
  getContentHomepage,
  updateContentHomepage,
  getContentPromo,
  updateContentPromo,
  uploadMultipleFiles,
  type BackgroundMediaItem,
  type PromoContent,
} from "@/features/dashboard/api";
import { resolveMediaUrl } from "@/lib/apiClient";
import { DashboardToast, useToast } from "@/features/dashboard/components/DashboardToast";
import { Save, Plus, Trash, Globe, FileText, Image as ImageIcon, Sliders, Play, RefreshCw, Upload, Loader2 } from "lucide-react";
 
interface HeaderData {
  logo_text: string;
  nav_links: { title: string; href: string }[];
}
 
interface HomepageData {
  hero_title: string;
  hero_subtitle: string;
  hero_description: string;
  hero_cta: string;
  background_media: BackgroundMediaItem[];
}
 
interface PhilosophyData {
  title: string;
  description: string;
  image_url: string | null;
}
 
export default function ContentPage() {
  const { getToken } = useAuth();
  const [headerData, setHeaderData] = useState<HeaderData>({ logo_text: "", nav_links: [] });
  const [homepageData, setHomepageData] = useState<HomepageData>({ hero_title: "", hero_subtitle: "", hero_description: "", hero_cta: "", background_media: [] });
  const [philosophyData, setPhilosophyData] = useState<PhilosophyData>({ title: "", description: "", image_url: null });
  const [promoData, setPromoData] = useState<PromoContent>({ title: "", description: "", bg_type: "image", bg_url: null, button_text: "", button_link: "" });
  
  const [loading, setLoading] = useState(true);
  const [savingHeader, setSavingHeader] = useState(false);
  const [savingHomepage, setSavingHomepage] = useState(false);
  const [savingPhilosophy, setSavingPhilosophy] = useState(false);
  const [savingPromo, setSavingPromo] = useState(false);
  const [uploading, setUploading] = useState(false);
 
  const { toast, show: showToast, hide: hideToast } = useToast();
 
  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;
 
    const token = await getToken();
    if (!token) return;
 
    setUploading(true);
    try {
      const filesArray = Array.from(files);
      const res = await uploadMultipleFiles(token, filesArray);
      if (res.success && res.files && res.files.length > 0) {
        setPhilosophyData((prev) => ({ ...prev, image_url: res.files[0].url }));
        showToast("Philosophy image uploaded successfully", "success");
      }
    } catch (e) {
      console.error(e);
      showToast("Failed to upload image", "error");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  useEffect(() => {
    loadAllContent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadAllContent() {
    const token = await getToken();
    if (!token) return;
    try {
      const [header, homepage, philosophy, promo] = await Promise.all([
        getContentHeader(token),
        getContentHomepage(token),
        getContentPhilosophy(token),
        getContentPromo(token),
      ]);
      setHeaderData({
        logo_text: header.logo_text || "BODHIQ",
        nav_links: header.nav_links || [],
      });
      setHomepageData({
        hero_title: homepage.hero_title || "",
        hero_subtitle: homepage.hero_subtitle || "",
        hero_description: homepage.hero_description || "",
        hero_cta: homepage.hero_cta || "",
        background_media: homepage.background_media || [],
      });
      setPhilosophyData(philosophy);
      setPromoData(promo);
    } catch (e) {
      console.error(e);
      showToast("Failed to load CMS content", "error");
    } finally {
      setLoading(false);
    }
  }

  // Header Handlers
  async function handleSaveHeader(e: React.FormEvent) {
    e.preventDefault();
    const token = await getToken();
    if (!token) return;
    setSavingHeader(true);
    try {
      await updateContentHeader(token, headerData);
      showToast("Header content updated successfully", "success");
    } catch {
      showToast("Failed to update header content", "error");
    } finally {
      setSavingHeader(false);
    }
  }

  function addNavLink() {
    setHeaderData((prev) => ({
      ...prev,
      nav_links: [...prev.nav_links, { title: "New Link", href: "/" }],
    }));
  }

  function removeNavLink(index: number) {
    setHeaderData((prev) => ({
      ...prev,
      nav_links: prev.nav_links.filter((_, i) => i !== index),
    }));
  }

  function handleNavLinkChange(index: number, field: "title" | "href", value: string) {
    setHeaderData((prev) => {
      const newList = [...prev.nav_links];
      newList[index] = { ...newList[index], [field]: value };
      return { ...prev, nav_links: newList };
    });
  }

  function addMediaItem() {
    setHomepageData((prev) => ({
      ...prev,
      background_media: [
        ...prev.background_media,
        { type: "image", url: "/watches/shunya-1/hero.jpg", order: prev.background_media.length },
      ],
    }));
  }

  function removeMediaItem(index: number) {
    setHomepageData((prev) => {
      const newList = prev.background_media
        .filter((_, i) => i !== index)
        .map((item, idx) => ({ ...item, order: idx }));
      return { ...prev, background_media: newList };
    });
  }

  function handleMediaChange(index: number, field: keyof BackgroundMediaItem, value: any) {
    setHomepageData((prev) => {
      const newList = [...prev.background_media];
      newList[index] = { ...newList[index], [field]: value };
      return { ...prev, background_media: newList };
    });
  }

  async function handleHeroMediaUpload(index: number, e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const token = await getToken();
    if (!token) return;

    setUploading(true);
    try {
      const filesArray = Array.from(files);
      const res = await uploadMultipleFiles(token, filesArray);
      if (res.success && res.files && res.files.length > 0) {
        const uploadedUrl = res.files[0].url;
        setHomepageData((prev) => {
          const newList = [...prev.background_media];
          newList[index] = { ...newList[index], url: uploadedUrl };
          return { ...prev, background_media: newList };
        });
        showToast("Hero background media uploaded", "success");
      }
    } catch (e) {
      console.error(e);
      showToast("Failed to upload background media", "error");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  // Homepage Handlers
  async function handleSaveHomepage(e: React.FormEvent) {
    e.preventDefault();
    const token = await getToken();
    if (!token) return;
    setSavingHomepage(true);
    try {
      await updateContentHomepage(token, homepageData);
      showToast("Homepage hero updated successfully", "success");
    } catch {
      showToast("Failed to update homepage hero", "error");
    } finally {
      setSavingHomepage(false);
    }
  }

  // Philosophy Handlers
  async function handleSavePhilosophy(e: React.FormEvent) {
    e.preventDefault();
    const token = await getToken();
    if (!token) return;
    setSavingPhilosophy(true);
    try {
      await updateContentPhilosophy(token, philosophyData);
      showToast("Philosophy updated successfully", "success");
    } catch {
      showToast("Failed to update philosophy", "error");
    } finally {
      setSavingPhilosophy(false);
    }
  }

  async function handlePromoBgUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const token = await getToken();
    if (!token) return;

    setUploading(true);
    try {
      const filesArray = Array.from(files);
      const res = await uploadMultipleFiles(token, filesArray);
      if (res.success && res.files && res.files.length > 0) {
        setPromoData((prev) => ({ ...prev, bg_url: res.files[0].url }));
        showToast("Promo background uploaded successfully", "success");
      }
    } catch (e) {
      console.error(e);
      showToast("Failed to upload background", "error");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  async function handleSavePromo(e: React.FormEvent) {
    e.preventDefault();
    const token = await getToken();
    if (!token) return;
    setSavingPromo(true);
    try {
      await updateContentPromo(token, promoData);
      showToast("Promo banner updated successfully", "success");
    } catch {
      showToast("Failed to update promo banner", "error");
    } finally {
      setSavingPromo(false);
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
    <div className="space-y-10 pb-12">
      {/* Header */}
      <div>
        <p className="text-[10px] uppercase tracking-[0.25em] text-[#d4a853] font-medium mb-2">CMS</p>
        <h1 className="text-3xl font-serif text-white">Content Management</h1>
        <p className="text-sm text-gray-500 mt-1">Manage static assets, page copy, hero banners, and brand philosophy.</p>
      </div>

      {/* Homepage Hero Section */}
      <form onSubmit={handleSaveHomepage} className="rounded-2xl border border-white/[0.04] bg-white/[0.01] p-6 space-y-4">
        <div className="flex items-center gap-2 border-b border-white/[0.04] pb-3 mb-2">
          <Globe size={16} className="text-[#d4a853]" />
          <h2 className="text-sm font-medium text-white uppercase tracking-wider">Homepage Hero</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] uppercase tracking-[0.15em] text-gray-500 mb-1.5">Hero Title</label>
            <input
              type="text"
              value={homepageData.hero_title}
              onChange={(e) => setHomepageData({ ...homepageData, hero_title: e.target.value })}
              className="w-full bg-white/[0.02] border border-white/[0.06] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#d4a853]/30 transition"
            />
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-[0.15em] text-gray-500 mb-1.5">Hero Subtitle</label>
            <input
              type="text"
              value={homepageData.hero_subtitle}
              onChange={(e) => setHomepageData({ ...homepageData, hero_subtitle: e.target.value })}
              className="w-full bg-white/[0.02] border border-white/[0.06] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#d4a853]/30 transition"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-[10px] uppercase tracking-[0.15em] text-gray-500 mb-1.5">Hero Description</label>
            <textarea
              value={homepageData.hero_description}
              onChange={(e) => setHomepageData({ ...homepageData, hero_description: e.target.value })}
              rows={3}
              className="w-full bg-white/[0.02] border border-white/[0.06] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#d4a853]/30 transition resize-none"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-[10px] uppercase tracking-[0.15em] text-gray-500 mb-1.5">Hero CTA Button Text</label>
            <input
              type="text"
              value={homepageData.hero_cta}
              onChange={(e) => setHomepageData({ ...homepageData, hero_cta: e.target.value })}
              className="w-full bg-white/[0.02] border border-white/[0.06] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#d4a853]/30 transition"
            />
          </div>
        </div>

        {/* Background Loops Media */}
        <div className="space-y-4 border-t border-white/[0.04] pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs uppercase tracking-wider text-gray-400 font-medium">Hero Background Media Loop</h3>
              <p className="text-[10px] text-gray-600 mt-0.5">Add multiple images or videos that loop on the landing hero page.</p>
            </div>
            <button
              type="button"
              onClick={addMediaItem}
              className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-[#d4a853] hover:text-[#e8c97a] transition font-medium"
            >
              <Plus size={12} /> Add Media
            </button>
          </div>

          <div className="space-y-4">
            {homepageData.background_media?.map((media, idx) => (
              <div key={idx} className="flex gap-3 items-center bg-white/[0.005] border border-white/[0.03] p-4 rounded-xl">
                {/* Preview Thumbnail */}
                <div className="w-12 h-12 rounded-xl bg-white/[0.02] border border-white/[0.06] overflow-hidden flex items-center justify-center shrink-0 relative group">
                  {media.url ? (
                    media.type === "video" ? (
                      <Play size={14} className="text-[#d4a853]" />
                    ) : (
                      <img src={resolveMediaUrl(media.url)} alt="" className="w-full h-full object-cover" />
                    )
                  ) : (
                    <ImageIcon size={16} className="text-gray-700" />
                  )}
                </div>

                {/* Media Type Dropdown */}
                <select
                  value={media.type}
                  onChange={(e) => handleMediaChange(idx, "type", e.target.value)}
                  className="bg-white/[0.02] border border-white/[0.06] rounded-xl px-3 py-2 text-xs text-gray-400 focus:outline-none focus:border-[#d4a853]/30 transition cursor-pointer"
                >
                  <option value="image">Image</option>
                  <option value="video">Video</option>
                </select>

                {/* Media URL Input */}
                <input
                  type="text"
                  value={media.url || ""}
                  onChange={(e) => handleMediaChange(idx, "url", e.target.value)}
                  className="flex-1 bg-white/[0.02] border border-white/[0.06] rounded-xl px-3.5 py-2 text-xs text-white font-mono focus:outline-none focus:border-[#d4a853]/30 transition"
                />

                {/* Upload Button */}
                <label className="flex items-center justify-center px-4 py-2 rounded-xl bg-[#d4a853]/10 border border-[#d4a853]/20 hover:bg-[#d4a853]/20 text-[#d4a853] text-[10px] uppercase tracking-wider cursor-pointer font-medium transition shrink-0">
                  <Upload size={12} className="mr-1.5" />
                  Upload
                  <input
                    type="file"
                    accept={media.type === "video" ? "video/*" : "image/*"}
                    onChange={(e) => handleHeroMediaUpload(idx, e)}
                    className="hidden"
                    disabled={uploading}
                  />
                </label>

                {/* Order Index indicator */}
                <span className="text-[10px] uppercase font-mono text-gray-600 px-2 shrink-0">
                  Order {media.order}
                </span>

                {/* Delete Button */}
                <button
                  type="button"
                  onClick={() => removeMediaItem(idx)}
                  className="p-2 rounded-lg text-gray-500 hover:text-rose-400 hover:bg-rose-500/[0.06] transition shrink-0"
                >
                  <Trash size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={savingHomepage}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#d4a853] hover:bg-[#e8c97a] text-black text-xs uppercase tracking-widest font-semibold rounded-xl transition disabled:opacity-50"
          >
            {savingHomepage ? <RefreshCw size={12} className="animate-spin" /> : <Save size={12} />}
            Save Hero
          </button>
        </div>
      </form>

      {/* Brand Philosophy Section */}
      <form onSubmit={handleSavePhilosophy} className="relative rounded-2xl border border-white/[0.04] bg-white/[0.01] p-6 space-y-4">
        {/* Upload Loading Overlay */}
        {uploading && (
          <div className="absolute inset-0 bg-black/70 backdrop-blur-xs z-50 flex flex-col items-center justify-center gap-3 rounded-2xl">
            <Loader2 className="w-8 h-8 text-[#d4a853] animate-spin" />
            <p className="text-xs text-[#d4a853] font-medium uppercase tracking-widest">Uploading image...</p>
          </div>
        )}

        <div className="flex items-center gap-2 border-b border-white/[0.04] pb-3 mb-2">
          <FileText size={16} className="text-[#d4a853]" />
          <h2 className="text-sm font-medium text-white uppercase tracking-wider">Brand Philosophy</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-[10px] uppercase tracking-[0.15em] text-gray-500 mb-1.5">Section Title</label>
            <input
              type="text"
              value={philosophyData.title}
              onChange={(e) => setPhilosophyData({ ...philosophyData, title: e.target.value })}
              className="w-full bg-white/[0.02] border border-white/[0.06] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#d4a853]/30 transition"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-[10px] uppercase tracking-[0.15em] text-gray-500 mb-1.5">Description Paragraph</label>
            <textarea
              value={philosophyData.description}
              onChange={(e) => setPhilosophyData({ ...philosophyData, description: e.target.value })}
              rows={4}
              className="w-full bg-white/[0.02] border border-white/[0.06] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#d4a853]/30 transition resize-none"
            />
          </div>
          
          {/* Philosophy Image Upload */}
          <div className="md:col-span-2 space-y-2">
            <label className="block text-[10px] uppercase tracking-[0.15em] text-gray-500">Philosophy Image</label>
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-2xl bg-white/[0.02] border border-white/[0.06] overflow-hidden flex items-center justify-center shrink-0 relative group">
                {philosophyData.image_url ? (
                  <>
                    <img src={resolveMediaUrl(philosophyData.image_url)} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setPhilosophyData((prev) => ({ ...prev, image_url: null }))}
                      className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-rose-400 transition"
                    >
                      <Trash size={14} />
                    </button>
                  </>
                ) : (
                  <ImageIcon size={24} className="text-gray-700" />
                )}
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={philosophyData.image_url || ""}
                    onChange={(e) => setPhilosophyData({ ...philosophyData, image_url: e.target.value || null })}
                    className="flex-1 bg-white/[0.02] border border-white/[0.06] rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-gray-700 focus:outline-none focus:border-[#d4a853]/30 transition"
                  />
                  <label className="flex items-center justify-center px-4 rounded-xl bg-[#d4a853]/10 border border-[#d4a853]/20 hover:bg-[#d4a853]/20 text-[#d4a853] text-[10px] uppercase tracking-wider cursor-pointer font-medium transition shrink-0">
                    <Upload size={12} className="mr-1.5" />
                    Upload
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={uploading}
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={savingPhilosophy || uploading}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#d4a853] hover:bg-[#e8c97a] text-black text-xs uppercase tracking-widest font-semibold rounded-xl transition disabled:opacity-50"
          >
            {savingPhilosophy ? <RefreshCw size={12} className="animate-spin" /> : <Save size={12} />}
            Save Philosophy
          </button>
        </div>
      </form>

      {/* Promo Banner Section */}
      <form onSubmit={handleSavePromo} className="relative rounded-2xl border border-white/[0.04] bg-white/[0.01] p-6 space-y-4">
        {/* Upload Loading Overlay */}
        {uploading && (
          <div className="absolute inset-0 bg-black/70 backdrop-blur-xs z-50 flex flex-col items-center justify-center gap-3 rounded-2xl">
            <Loader2 className="w-8 h-8 text-[#d4a853] animate-spin" />
            <p className="text-xs text-[#d4a853] font-medium uppercase tracking-widest">Uploading media...</p>
          </div>
        )}

        <div className="flex items-center gap-2 border-b border-white/[0.04] pb-3 mb-2">
          <Sliders size={16} className="text-[#d4a853]" />
          <h2 className="text-sm font-medium text-white uppercase tracking-wider">Promo Banner Section</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-[10px] uppercase tracking-[0.15em] text-gray-500 mb-1.5">Banner Title</label>
            <input
              type="text"
              value={promoData.title}
              onChange={(e) => setPromoData({ ...promoData, title: e.target.value })}
              className="w-full bg-white/[0.02] border border-white/[0.06] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#d4a853]/30 transition"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-[10px] uppercase tracking-[0.15em] text-gray-500 mb-1.5">Banner Description</label>
            <textarea
              value={promoData.description}
              onChange={(e) => setPromoData({ ...promoData, description: e.target.value })}
              rows={3}
              className="w-full bg-white/[0.02] border border-white/[0.06] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#d4a853]/30 transition resize-none"
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-[0.15em] text-gray-500 mb-1.5">Background Type</label>
            <select
              value={promoData.bg_type}
              onChange={(e) => setPromoData({ ...promoData, bg_type: e.target.value })}
              className="w-full bg-white/[0.02] border border-white/[0.06] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#d4a853]/30 transition cursor-pointer"
            >
              <option value="image">Image</option>
              <option value="video">Video</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-[0.15em] text-gray-500 mb-1.5">Button Text</label>
            <input
              type="text"
              value={promoData.button_text}
              onChange={(e) => setPromoData({ ...promoData, button_text: e.target.value })}
              className="w-full bg-white/[0.02] border border-white/[0.06] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#d4a853]/30 transition"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-[10px] uppercase tracking-[0.15em] text-gray-500 mb-1.5">Button Link Path</label>
            <input
              type="text"
              value={promoData.button_link}
              onChange={(e) => setPromoData({ ...promoData, button_link: e.target.value })}
              className="w-full bg-white/[0.02] border border-white/[0.06] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#d4a853]/30 transition font-mono"
            />
          </div>
          
          {/* Background Media Upload */}
          <div className="md:col-span-2 space-y-2">
            <label className="block text-[10px] uppercase tracking-[0.15em] text-gray-500">Promo Background Media ({promoData.bg_type})</label>
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-2xl bg-white/[0.02] border border-white/[0.06] overflow-hidden flex items-center justify-center shrink-0 relative group">
                {promoData.bg_url ? (
                  <>
                    {promoData.bg_type === "video" ? (
                      <div className="w-full h-full relative flex items-center justify-center bg-black">
                        <Play size={20} className="text-[#d4a853] fill-[#d4a853]/20" />
                      </div>
                    ) : (
                      <img src={resolveMediaUrl(promoData.bg_url)} alt="" className="w-full h-full object-cover" />
                    )}
                    <button
                      type="button"
                      onClick={() => setPromoData((prev) => ({ ...prev, bg_url: null }))}
                      className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-rose-400 transition"
                    >
                      <Trash size={14} />
                    </button>
                  </>
                ) : (
                  <ImageIcon size={24} className="text-gray-700" />
                )}
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoData.bg_url || ""}
                    onChange={(e) => setPromoData({ ...promoData, bg_url: e.target.value || null })}
                    className="flex-1 bg-white/[0.02] border border-white/[0.06] rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-gray-700 focus:outline-none focus:border-[#d4a853]/30 transition"
                  />
                  <label className="flex items-center justify-center px-4 rounded-xl bg-[#d4a853]/10 border border-[#d4a853]/20 hover:bg-[#d4a853]/20 text-[#d4a853] text-[10px] uppercase tracking-wider cursor-pointer font-medium transition shrink-0">
                    <Upload size={12} className="mr-1.5" />
                    Upload
                    <input
                      type="file"
                      accept={promoData.bg_type === "video" ? "video/*" : "image/*"}
                      onChange={handlePromoBgUpload}
                      className="hidden"
                      disabled={uploading}
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={savingPromo || uploading}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#d4a853] hover:bg-[#e8c97a] text-black text-xs uppercase tracking-widest font-semibold rounded-xl transition disabled:opacity-50"
          >
            {savingPromo ? <RefreshCw size={12} className="animate-spin" /> : <Save size={12} />}
            Save Promo Banner
          </button>
        </div>
      </form>

      {/* Header and Navigation Section */}
      <form onSubmit={handleSaveHeader} className="rounded-2xl border border-white/[0.04] bg-white/[0.01] p-6 space-y-6">
        <div className="flex items-center gap-2 border-b border-white/[0.04] pb-3 mb-2">
          <Sliders size={16} className="text-[#d4a853]" />
          <h2 className="text-sm font-medium text-white uppercase tracking-wider">Site Header & Navigation</h2>
        </div>

        {/* Logo and Navigation Links */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div className="md:col-span-1">
              <label className="block text-[10px] uppercase tracking-[0.15em] text-gray-500 mb-1.5">Header Brand Text</label>
              <input
                type="text"
                value={headerData.logo_text}
                onChange={(e) => setHeaderData({ ...headerData, logo_text: e.target.value })}
                className="w-full bg-white/[0.02] border border-white/[0.06] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#d4a853]/30 transition"
              />
            </div>
            <div className="md:col-span-2 flex justify-between items-center mb-1">
              <h3 className="text-xs uppercase tracking-wider text-gray-400 font-medium">Header Links</h3>
              <button
                type="button"
                onClick={addNavLink}
                className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-[#d4a853] hover:text-[#e8c97a] transition font-medium"
              >
                <Plus size={12} /> Add Link
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {headerData.nav_links.map((link, idx) => (
              <div key={idx} className="flex gap-3 items-center">
                <input
                  type="text"
                  value={link.title}
                  onChange={(e) => handleNavLinkChange(idx, "title", e.target.value)}
                  className="flex-1 bg-white/[0.02] border border-white/[0.06] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#d4a853]/30 transition"
                />
                <input
                  type="text"
                  value={link.href}
                  onChange={(e) => handleNavLinkChange(idx, "href", e.target.value)}
                  className="flex-1 bg-white/[0.02] border border-white/[0.06] rounded-xl px-3.5 py-2 text-xs text-white font-mono focus:outline-none focus:border-[#d4a853]/30 transition"
                />
                <button
                  type="button"
                  onClick={() => removeNavLink(idx)}
                  className="p-2 rounded-lg text-gray-500 hover:text-rose-400 hover:bg-rose-500/[0.06] transition"
                >
                  <Trash size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end pt-2 border-t border-white/[0.04] pt-4">
          <button
            type="submit"
            disabled={savingHeader}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#d4a853] hover:bg-[#e8c97a] text-black text-xs uppercase tracking-widest font-semibold rounded-xl transition disabled:opacity-50"
          >
            {savingHeader ? <RefreshCw size={12} className="animate-spin" /> : <Save size={12} />}
            Save Header Settings
          </button>
        </div>
      </form>

      {/* Toast */}
      <DashboardToast {...toast} onClose={hideToast} />
    </div>
  );
}
