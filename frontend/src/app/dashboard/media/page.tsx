"use client";

import { useEffect, useState, useRef } from "react";
import { useAuth } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";
import { uploadMultipleFiles, adminGetUploadedFiles, type UploadedFile } from "@/features/dashboard/api";
import { resolveMediaUrl } from "@/lib/apiClient";
import { DashboardToast, useToast } from "@/features/dashboard/components/DashboardToast";
import { Upload, Copy, Check, FileText, Image as ImageIcon, Play, Trash } from "lucide-react";

export default function MediaPage() {
  const { getToken } = useAuth();
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { toast, show: showToast, hide: hideToast } = useToast();

  useEffect(() => {
    loadFiles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadFiles() {
    const token = await getToken();
    if (!token) return;
    try {
      const res = await adminGetUploadedFiles(token);
      setFiles(res.files || []);
    } catch (e) {
      console.error(e);
      showToast("Failed to load media files", "error");
    } finally {
      setLoading(false);
    }
  }

  async function handleFilesSelected(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;
    const token = await getToken();
    if (!token) return;

    setUploading(true);
    showToast(`Uploading ${fileList.length} file(s)...`, "info");
    try {
      const selectedArray = Array.from(fileList);
      await uploadMultipleFiles(token, selectedArray);
      showToast("Files uploaded successfully", "success");
      loadFiles();
    } catch (e) {
      console.error(e);
      showToast("Upload failed. Files must be images/videos under 50MB.", "error");
    } finally {
      setUploading(false);
    }
  }

  function handleCopyUrl(path: string) {
    const fullUrl = resolveMediaUrl(path);
    navigator.clipboard.writeText(fullUrl);
    setCopiedUrl(path);
    showToast("URL copied to clipboard", "success");
    setTimeout(() => setCopiedUrl(null), 2000);
  }

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="h-8 w-48 rounded-lg bg-white/[0.04] animate-pulse" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="aspect-square rounded-2xl bg-white/[0.03] animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div>
        <p className="text-[10px] uppercase tracking-[0.25em] text-[#d4a853] font-medium mb-2">Assets</p>
        <h1 className="text-3xl font-serif text-white">Media Library</h1>
        <p className="text-sm text-gray-500 mt-1">Upload and manage product images, hero background videos, and marketing assets.</p>
      </div>

      {/* Upload Zone */}
      <div
        onClick={() => fileInputRef.current?.click()}
        className={`border border-dashed border-white/[0.08] hover:border-[#d4a853]/30 bg-white/[0.01] hover:bg-white/[0.02] rounded-2xl p-10 text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center gap-4 group ${
          uploading ? "pointer-events-none opacity-50" : ""
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,video/*"
          className="hidden"
          onChange={(e) => handleFilesSelected(e.target.files)}
        />
        <div className="w-12 h-12 rounded-xl bg-white/[0.03] group-hover:bg-[#d4a853]/5 flex items-center justify-center border border-white/[0.06] group-hover:border-[#d4a853]/25 transition">
          <Upload size={18} className="text-gray-400 group-hover:text-[#d4a853] transition" />
        </div>
        <div>
          <p className="text-sm text-white font-medium">Click or drag files here to upload</p>
          <p className="text-xs text-gray-500 mt-1">Images (PNG, JPG, WebP) and Videos (MP4, WebM) up to 50MB</p>
        </div>
      </div>

      {/* Media Grid */}
      <div>
        <h2 className="text-sm font-medium uppercase tracking-wider text-gray-400 mb-4">All Files ({files.length})</h2>

        {files.length === 0 ? (
          <div className="rounded-2xl border border-white/[0.04] bg-white/[0.008] py-16 text-center text-sm text-gray-600 flex flex-col items-center gap-2">
            <ImageIcon size={24} className="text-gray-750" />
            <p>Your media library is empty.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            <AnimatePresence>
              {files.map((file, i) => (
                <motion.div
                  key={file.url}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25, delay: i * 0.01 }}
                  className="group relative aspect-square rounded-2xl bg-[#0a0a0a] border border-white/[0.04] overflow-hidden flex flex-col hover:border-[#d4a853]/20 transition-all duration-300"
                >
                  {/* Thumbnail / Video Preview */}
                  <div className="flex-1 overflow-hidden relative bg-white/[0.01] flex items-center justify-center">
                    {file.type === "video" ? (
                      <div className="w-full h-full relative flex items-center justify-center bg-black">
                        {/* Play overlay */}
                        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/30 group-hover:bg-black/50 transition">
                          <div className="w-10 h-10 rounded-full bg-black/60 border border-white/10 flex items-center justify-center text-[#d4a853] shadow-lg">
                            <Play size={14} className="fill-[#d4a853] translate-x-0.5" />
                          </div>
                        </div>
                        <video
                          src={resolveMediaUrl(file.url)}
                          muted
                          playsInline
                          className="w-full h-full object-cover opacity-80"
                        />
                      </div>
                    ) : (
                      <img
                        src={resolveMediaUrl(file.url)}
                        alt={file.filename}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      />
                    )}
                  </div>

                  {/* Copy overlay and actions on hover */}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/75 to-transparent p-3 pt-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-[10px] font-mono text-gray-400 truncate">{file.filename}</p>
                    </div>
                    <button
                      onClick={() => handleCopyUrl(file.url)}
                      className="shrink-0 p-1.5 rounded-lg bg-[#d4a853] text-black hover:bg-[#e8c97a] transition shadow-lg"
                      title="Copy URL"
                    >
                      {copiedUrl === file.url ? <Check size={12} /> : <Copy size={12} />}
                    </button>
                  </div>

                  {/* Type indicator pill */}
                  <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md text-[9px] font-medium uppercase tracking-wider bg-black/75 border border-white/5 text-gray-400">
                    {file.type}
                  </span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Toast */}
      <DashboardToast {...toast} onClose={hideToast} />
    </div>
  );
}
