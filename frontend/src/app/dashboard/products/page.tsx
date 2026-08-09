"use client";

import { useEffect, useState, useMemo } from "react";
import { useAuth } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";
import { resolveMediaUrl } from "@/lib/apiClient";
import { adminGetProducts, adminCreateProduct, adminUpdateProduct, adminDeleteProduct, adminGetCategories, uploadMultipleFiles } from "@/features/dashboard/api";
import { DashboardModal } from "@/features/dashboard/components/DashboardModal";
import { DashboardToast, ToastFromHook, useToast } from "@/features/dashboard/components/DashboardToast";
import { DashboardSkeleton } from "@/features/dashboard/components/DashboardSkeleton";
import type { Product, PaginatedResponse } from "@/types/api";
import {
  Plus, Search, Package, Edit3, Trash2, Image as ImageIcon,
  Filter, X, AlertTriangle, ChevronDown, Upload, Film, Trash, Loader2,
} from "lucide-react";

interface ProductFormData {
  name: string;
  slug: string;
  description: string;
  price: number | "";
  original_price: number | null | "";
  stock: number | "";
  allow_notify: boolean;
  category_id: string;
  main_image_url: string;
  images: string[];
  product_video_url: string;
  case_size: string;
  dial_color: string;
  strap_material: string;
  case_material: string;
  movement: string;
  water_resistance: string;
  glass_type: string;
  seo_meta_title: string;
  seo_meta_description: string;
  seo_keywords: string[];
}

const emptyForm: ProductFormData = {
  name: "",
  slug: "",
  description: "",
  price: "",
  original_price: null,
  stock: "",
  allow_notify: true,
  category_id: "",
  main_image_url: "",
  images: [],
  product_video_url: "",
  case_size: "",
  dial_color: "",
  strap_material: "",
  case_material: "",
  movement: "",
  water_resistance: "",
  glass_type: "",
  seo_meta_title: "",
  seo_meta_description: "",
  seo_keywords: [],
};

export default function ProductsPage() {
  const { getToken } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStock, setFilterStock] = useState<"all" | "instock" | "outofstock">("all");

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"basics" | "media" | "specs" | "seo">("basics");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<ProductFormData>({ ...emptyForm });

  // Delete confirmation
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);

  const { toast, show: showToast, hide: hideToast } = useToast();
  const [uploading, setUploading] = useState(false);

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>, type: "main" | "gallery" | "video") {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const token = await getToken();
    if (!token) return;

    setUploading(true);
    try {
      const filesArray = Array.from(files);
      const res = await uploadMultipleFiles(token, filesArray);
      
      if (res.success && res.files) {
        const urls = res.files.map((f) => f.url);
        
        if (type === "main") {
          setFormData((prev) => ({ ...prev, main_image_url: urls[0] }));
          showToast("Main image uploaded successfully", "success");
        } else if (type === "video") {
          setFormData((prev) => ({ ...prev, product_video_url: urls[0] }));
          showToast("Video uploaded successfully", "success");
        } else if (type === "gallery") {
          setFormData((prev) => ({ ...prev, images: [...prev.images, ...urls] }));
          showToast(`Uploaded ${urls.length} gallery images`, "success");
        }
      }
    } catch (e) {
      console.error(e);
      showToast("Failed to upload files", "error");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  useEffect(() => {
    loadProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadProducts() {
    const token = await getToken();
    if (!token) return;
    try {
      const [prodRes, catRes] = await Promise.all([
        adminGetProducts(token) as Promise<PaginatedResponse<Product>>,
        adminGetCategories(token),
      ]);
      setProducts(prodRes.items || []);
      setCategories(catRes || []);
    } catch (e) {
      console.error(e);
      showToast("Failed to load products", "error");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    const token = await getToken();
    if (!token) return;
    try {
      await adminDeleteProduct(token, deleteTarget.id);
      showToast("Product deleted successfully", "success");
      loadProducts();
    } catch (e) {
      console.error(e);
      showToast("Failed to delete product", "error");
    } finally {
      setDeleteTarget(null);
    }
  }

  // Filtered + searched products
  const filteredProducts = useMemo(() => {
    let result = products;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) => p.name.toLowerCase().includes(q) || p.slug.toLowerCase().includes(q)
      );
    }
    if (filterStock === "instock") result = result.filter((p) => p.stock > 0);
    if (filterStock === "outofstock") result = result.filter((p) => p.stock === 0);
    return result;
  }, [products, searchQuery, filterStock]);

  function openCreate() {
    setEditingId(null);
    setFormData({
      ...emptyForm,
      category_id: categories[0]?.id || "",
    });
    setActiveTab("basics");
    setModalOpen(true);
  }

  function openEdit(product: Product) {
    setEditingId(product.id);
    setFormData({
      name: product.name,
      slug: product.slug,
      description: product.description || "",
      price: product.price,
      original_price: product.original_price ?? null,
      stock: product.stock,
      allow_notify: product.allow_notify ?? true,
      category_id: product.category_id,
      main_image_url: product.main_image_url || "",
      images: product.images || [],
      product_video_url: product.product_video_url || "",
      case_size: product.case_size || "",
      dial_color: product.dial_color || "",
      strap_material: product.strap_material || "",
      case_material: product.case_material || "",
      movement: product.movement || "",
      water_resistance: product.water_resistance || "",
      glass_type: product.glass_type || "",
      seo_meta_title: product.seo_meta_title || "",
      seo_meta_description: product.seo_meta_description || "",
      seo_keywords: product.seo_keywords || [],
    });
    setActiveTab("basics");
    setModalOpen(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();

    // Client-side validation
    if (!formData.name || formData.name.trim() === "") {
      showToast("Product name is required", "error");
      setActiveTab("basics");
      return;
    }
    if (formData.price === "" || formData.price <= 0) {
      showToast("Product price must be greater than 0", "error");
      setActiveTab("basics");
      return;
    }
    if (formData.stock === "" || formData.stock < 0) {
      showToast("Stock count cannot be negative", "error");
      setActiveTab("basics");
      return;
    }
    if (!formData.category_id) {
      showToast("Product category is required", "error");
      setActiveTab("basics");
      return;
    }
    if (formData.original_price !== null && formData.original_price !== "" && formData.original_price <= 0) {
      showToast("Original price must be greater than 0", "error");
      setActiveTab("basics");
      return;
    }

    const token = await getToken();
    if (!token) return;

    const submissionData = {
      ...formData,
      price: Number(formData.price),
      stock: Number(formData.stock),
      original_price: (formData.original_price === "" || formData.original_price === null) ? null : Number(formData.original_price),
    };

    try {
      if (editingId) {
        await adminUpdateProduct(token, editingId, submissionData);
        showToast("Product updated successfully", "success");
      } else {
        await adminCreateProduct(token, submissionData);
        showToast("Product created successfully", "success");
      }
      setModalOpen(false);
      setEditingId(null);
      setFormData({ ...emptyForm });
      loadProducts();
    } catch (err: any) {
      console.error(err);
      let errMsg = "Failed to save product";
      try {
        if (err.message) {
          const index = err.message.indexOf(" — ");
          if (index !== -1) {
            const bodyPart = err.message.substring(err.message.indexOf(":", index) + 1).trim();
            const parsed = JSON.parse(bodyPart);
            if (parsed.detail && Array.isArray(parsed.detail)) {
              errMsg = parsed.detail.map((d: any) => {
                const fieldName = d.loc[d.loc.length - 1];
                return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}: ${d.msg}`;
              }).join(", ");
            } else if (parsed.detail) {
              errMsg = parsed.detail;
            }
          }
        }
      } catch {}
      showToast(errMsg, "error");
    }
  }

  // Auto-generate slug from name
  function handleNameChange(name: string) {
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
    setFormData((prev) => ({ ...prev, name, slug: editingId ? prev.slug : slug }));
  }

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="h-8 w-48 rounded-lg bg-white/[0.04] animate-pulse" />
        <DashboardSkeleton rows={6} cols={5} />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.25em] text-[#d4a853] font-medium mb-2">Catalog</p>
          <h1 className="text-3xl font-serif text-white">Products</h1>
          <p className="text-sm text-gray-500 mt-1">{products.length} item{products.length !== 1 ? "s" : ""} in catalog</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={openCreate}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#d4a853] to-[#e8c97a] text-black text-xs uppercase tracking-widest font-medium rounded-xl hover:shadow-lg hover:shadow-[#d4a853]/10 transition-shadow"
        >
          <Plus size={14} />
          Add Product
        </motion.button>
      </div>

      {/* Search + Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/[0.02] border border-white/[0.06] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-[#d4a853]/30 transition"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-white transition">
              <X size={14} />
            </button>
          )}
        </div>
        <div className="relative">
          <Filter size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none" />
          <select
            value={filterStock}
            onChange={(e) => setFilterStock(e.target.value as typeof filterStock)}
            className="appearance-none bg-white/[0.02] border border-white/[0.06] rounded-xl pl-8 pr-8 py-2.5 text-xs text-gray-400 focus:outline-none focus:border-[#d4a853]/30 transition cursor-pointer"
          >
            <option value="all">All Stock</option>
            <option value="instock">In Stock</option>
            <option value="outofstock">Out of Stock</option>
          </select>
          <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none" />
        </div>
      </div>

      {/* Products Table */}
      <div className="rounded-2xl bg-white/[0.015] border border-white/[0.04] overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-white/[0.04]">
              {["Product", "Price", "Stock", "Status", "Actions"].map((h) => (
                <th key={h} className="px-5 py-3.5 text-[9px] uppercase tracking-[0.15em] text-gray-600 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-16 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <Package size={28} className="text-gray-700" />
                    <p className="text-sm text-gray-500">
                      {searchQuery ? "No products match your search" : "No products in catalog yet"}
                    </p>
                    {!searchQuery && (
                      <button onClick={openCreate} className="text-xs text-[#d4a853] hover:text-[#e8c97a] transition">
                        + Add your first product
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            )}
            <AnimatePresence>
              {filteredProducts.map((product, i) => (
                <motion.tr
                  key={product.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.03 }}
                  className="border-b border-white/[0.03] hover:bg-white/[0.015] transition-colors group"
                >
                  {/* Product Info */}
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.06] overflow-hidden shrink-0 flex items-center justify-center">
                        {product.main_image_url ? (
                          <img src={resolveMediaUrl(product.main_image_url)} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <ImageIcon size={14} className="text-gray-700" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm text-white font-medium truncate">{product.name}</p>
                        <p className="text-[11px] text-gray-600 font-mono truncate">{product.slug}</p>
                      </div>
                    </div>
                  </td>
                  {/* Price */}
                  <td className="px-5 py-3 text-sm text-white">₹{product.price.toLocaleString()}</td>
                  {/* Stock */}
                  <td className="px-5 py-3">
                    <span className={`text-sm font-medium ${product.stock > 0 ? "text-gray-300" : "text-rose-400"}`}>
                      {product.stock}
                    </span>
                  </td>
                  {/* Status */}
                  <td className="px-5 py-3">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider font-medium ${
                      product.stock > 0
                        ? "bg-emerald-500/[0.08] text-emerald-400"
                        : "bg-rose-500/[0.08] text-rose-400"
                    }`}>
                      <span className={`w-1 h-1 rounded-full ${product.stock > 0 ? "bg-emerald-400" : "bg-rose-400"}`} />
                      {product.stock > 0 ? "Active" : "Out"}
                    </span>
                  </td>
                  {/* Actions */}
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => openEdit(product)}
                        className="p-2 rounded-lg text-gray-500 hover:text-[#d4a853] hover:bg-[#d4a853]/[0.06] transition"
                      >
                        <Edit3 size={14} />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(product)}
                        className="p-2 rounded-lg text-gray-500 hover:text-rose-400 hover:bg-rose-500/[0.06] transition"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* Create / Edit Modal */}
      <DashboardModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditingId(null); }}
        title={editingId ? "Edit Product" : "New Product"}
        subtitle={editingId ? "Update product details" : "Add a new item to the catalog"}
      >
        <div className="relative">
          {/* Upload Loading Overlay */}
          {uploading && (
            <div className="absolute inset-0 bg-black/70 backdrop-blur-xs z-50 flex flex-col items-center justify-center gap-3 rounded-2xl">
              <Loader2 className="w-8 h-8 text-[#d4a853] animate-spin" />
              <p className="text-xs text-[#d4a853] font-medium uppercase tracking-widest">Uploading media...</p>
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-5">
            {/* Tabs */}
            <div className="flex border-b border-white/[0.04] mb-4 gap-2">
              {(["basics", "media", "specs", "seo"] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 pb-2.5 text-[10px] uppercase tracking-[0.15em] font-medium border-b-2 transition ${
                    activeTab === tab
                      ? "border-[#d4a853] text-white"
                      : "border-transparent text-gray-500 hover:text-gray-300"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {activeTab === "basics" && (
              <div className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.15em] text-gray-500 mb-1.5">Product Name</label>
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl px-3.5 py-2.5 text-sm text-white placeholder:text-gray-700 focus:outline-none focus:border-[#d4a853]/30 transition"
                    placeholder="SHUNYA I — Limited Edition"
                  />
                </div>

                {/* Slug */}
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.15em] text-gray-500 mb-1.5">URL Slug</label>
                  <input
                    required
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl px-3.5 py-2.5 text-sm text-white font-mono placeholder:text-gray-700 focus:outline-none focus:border-[#d4a853]/30 transition"
                    placeholder="shunya-i-limited-edition"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.15em] text-gray-500 mb-1.5">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl px-3.5 py-2.5 text-sm text-white placeholder:text-gray-700 focus:outline-none focus:border-[#d4a853]/30 transition resize-none"
                    placeholder="A minimalist luxury timepiece..."
                  />
                </div>

                {/* Category + Stock */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] uppercase tracking-[0.15em] text-gray-500 mb-1.5">Category</label>
                    <select
                      required
                      value={formData.category_id}
                      onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                      className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#d4a853]/30 transition cursor-pointer font-medium"
                    >
                      <option value="" disabled className="bg-[#121212] text-gray-500">Select a category...</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id} className="bg-[#121212] text-white">
                          {cat.title}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-[0.15em] text-gray-500 mb-1.5">Stock</label>
                    <input
                      required
                      type="number"
                      min="0"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: e.target.value === "" ? "" : Number(e.target.value) })}
                      className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#d4a853]/30 transition"
                    />
                  </div>
                </div>

                {/* Price + Original Price */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] uppercase tracking-[0.15em] text-gray-500 mb-1.5">Price (₹)</label>
                    <input
                      required
                      type="number"
                      min="0.01"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value === "" ? "" : Number(e.target.value) })}
                      className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#d4a853]/30 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-[0.15em] text-gray-500 mb-1.5">Original Price (₹ - Optional)</label>
                    <input
                      type="number"
                      min="0.01"
                      step="0.01"
                      value={formData.original_price === null ? "" : formData.original_price}
                      onChange={(e) => setFormData({ ...formData, original_price: e.target.value === "" ? null : Number(e.target.value) })}
                      className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#d4a853]/30 transition"
                      placeholder="e.g. 19999"
                    />
                  </div>
                </div>

                {/* Notifications switch */}
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-white/[0.01] border border-white/[0.04] mt-2">
                  <div>
                    <p className="text-xs font-medium text-white">Back-in-Stock Notifications</p>
                    <p className="text-[9px] text-gray-500 mt-0.5">Allow users to subscribe to updates when out of stock</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.allow_notify}
                    onChange={(e) => setFormData({ ...formData, allow_notify: e.target.checked })}
                    className="w-4 h-4 rounded border-white/[0.08] bg-white/[0.03] text-[#d4a853] focus:ring-0 cursor-pointer shrink-0"
                  />
                </div>
              </div>
            )}

            {activeTab === "media" && (
              <div className="space-y-4">
                {/* Main Image (Cover) */}
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-2xl bg-white/[0.03] border border-white/[0.06] overflow-hidden flex items-center justify-center shrink-0 relative group">
                    {formData.main_image_url ? (
                      <>
                        <img src={resolveMediaUrl(formData.main_image_url)} alt="" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setFormData((prev) => ({ ...prev, main_image_url: "" }))}
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
                    <label className="block text-[10px] uppercase tracking-[0.15em] text-gray-500">Main Image</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={formData.main_image_url}
                        onChange={(e) => setFormData({ ...formData, main_image_url: e.target.value })}
                        placeholder="Image URL or upload..."
                        className="flex-1 bg-white/[0.03] border border-white/[0.06] rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-gray-700 focus:outline-none focus:border-[#d4a853]/30 transition"
                      />
                      <label className="flex items-center justify-center px-4 rounded-xl bg-[#d4a853]/10 border border-[#d4a853]/20 hover:bg-[#d4a853]/20 text-[#d4a853] text-[10px] uppercase tracking-wider cursor-pointer font-medium transition shrink-0">
                        <Upload size={12} className="mr-1.5" />
                        Upload
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileUpload(e, "main")}
                          className="hidden"
                          disabled={uploading}
                        />
                      </label>
                    </div>
                  </div>
                </div>

                {/* Gallery Images (Multiple) */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-[10px] uppercase tracking-[0.15em] text-gray-500">Gallery Images (Multiple)</label>
                    <label className="flex items-center justify-center px-3 py-1.5 rounded-xl bg-[#d4a853]/10 border border-[#d4a853]/20 hover:bg-[#d4a853]/20 text-[#d4a853] text-[10px] uppercase tracking-wider cursor-pointer font-medium transition">
                      <Plus size={12} className="mr-1" />
                      Add Images
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, "gallery")}
                        className="hidden"
                        disabled={uploading}
                      />
                    </label>
                  </div>

                  {formData.images && formData.images.length > 0 ? (
                    <div className="grid grid-cols-4 gap-2.5 p-3 rounded-2xl bg-white/[0.01] border border-white/[0.04]">
                      {formData.images.map((url, idx) => (
                        <div key={url} className="relative aspect-square rounded-xl bg-white/[0.03] border border-white/[0.06] overflow-hidden group">
                          <img src={resolveMediaUrl(url)} alt="" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => setFormData((prev) => ({
                              ...prev,
                              images: prev.images.filter((_, i) => i !== idx)
                            }))}
                            className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-rose-400 transition"
                          >
                            <Trash size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 rounded-2xl border border-dashed border-white/[0.06] text-center text-xs text-gray-600">
                      No gallery images added yet. Click Add Images to upload.
                    </div>
                  )}
                </div>

                {/* Product Video */}
                <div className="space-y-2">
                  <label className="block text-[10px] uppercase tracking-[0.15em] text-gray-500">Product Video</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={formData.product_video_url}
                      onChange={(e) => setFormData({ ...formData, product_video_url: e.target.value })}
                      placeholder="Video URL (mp4, webm) or upload..."
                      className="flex-1 bg-white/[0.03] border border-white/[0.06] rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-gray-700 focus:outline-none focus:border-[#d4a853]/30 transition"
                    />
                    <label className="flex items-center justify-center px-4 rounded-xl bg-[#d4a853]/10 border border-[#d4a853]/20 hover:bg-[#d4a853]/20 text-[#d4a853] text-[10px] uppercase tracking-wider cursor-pointer font-medium transition shrink-0">
                      <Film size={12} className="mr-1.5" />
                      Upload
                      <input
                        type="file"
                        accept="video/*"
                        onChange={(e) => handleFileUpload(e, "video")}
                        className="hidden"
                        disabled={uploading}
                      />
                    </label>
                  </div>

                  {formData.product_video_url && (
                    <div className="relative rounded-2xl border border-white/[0.06] bg-black/40 overflow-hidden aspect-video group mt-2">
                      <video
                        src={resolveMediaUrl(formData.product_video_url)}
                        controls
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, product_video_url: "" }))}
                        className="absolute top-2 right-2 p-1.5 rounded-full bg-black/80 hover:bg-black text-rose-400 opacity-0 group-hover:opacity-100 transition"
                      >
                        <Trash size={12} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "specs" && (
              <div className="space-y-4">
                {/* Case Size + Case Material */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] uppercase tracking-[0.15em] text-gray-500 mb-1.5">Case Size</label>
                    <input
                      type="text"
                      value={formData.case_size}
                      onChange={(e) => setFormData({ ...formData, case_size: e.target.value })}
                      placeholder="e.g. 40mm"
                      className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-gray-700 focus:outline-none focus:border-[#d4a853]/30 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-[0.15em] text-gray-500 mb-1.5">Case Material</label>
                    <input
                      type="text"
                      value={formData.case_material}
                      onChange={(e) => setFormData({ ...formData, case_material: e.target.value })}
                      placeholder="e.g. 316L Surgical Steel"
                      className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-gray-700 focus:outline-none focus:border-[#d4a853]/30 transition"
                    />
                  </div>
                </div>

                {/* Dial Color + Strap Material */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] uppercase tracking-[0.15em] text-gray-500 mb-1.5">Dial Color</label>
                    <input
                      type="text"
                      value={formData.dial_color}
                      onChange={(e) => setFormData({ ...formData, dial_color: e.target.value })}
                      placeholder="e.g. Obsidian Black"
                      className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-gray-700 focus:outline-none focus:border-[#d4a853]/30 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-[0.15em] text-gray-500 mb-1.5">Strap Material</label>
                    <input
                      type="text"
                      value={formData.strap_material}
                      onChange={(e) => setFormData({ ...formData, strap_material: e.target.value })}
                      placeholder="e.g. Italian Leather"
                      className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-gray-700 focus:outline-none focus:border-[#d4a853]/30 transition"
                    />
                  </div>
                </div>

                {/* Movement + Glass Type */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] uppercase tracking-[0.15em] text-gray-500 mb-1.5">Movement</label>
                    <input
                      type="text"
                      value={formData.movement}
                      onChange={(e) => setFormData({ ...formData, movement: e.target.value })}
                      placeholder="e.g. Miyota Automatic"
                      className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-gray-700 focus:outline-none focus:border-[#d4a853]/30 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-[0.15em] text-gray-500 mb-1.5">Glass Type</label>
                    <input
                      type="text"
                      value={formData.glass_type}
                      onChange={(e) => setFormData({ ...formData, glass_type: e.target.value })}
                      placeholder="e.g. Sapphire Crystal"
                      className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-gray-700 focus:outline-none focus:border-[#d4a853]/30 transition"
                    />
                  </div>
                </div>

                {/* Water Resistance */}
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.15em] text-gray-500 mb-1.5">Water Resistance</label>
                  <input
                    type="text"
                    value={formData.water_resistance}
                    onChange={(e) => setFormData({ ...formData, water_resistance: e.target.value })}
                    placeholder="e.g. 5 ATM / 50m"
                    className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-gray-700 focus:outline-none focus:border-[#d4a853]/30 transition"
                  />
                </div>
              </div>
            )}

            {activeTab === "seo" && (
              <div className="space-y-4">
                {/* SEO Meta Title */}
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.15em] text-gray-500 mb-1.5">SEO Meta Title</label>
                  <input
                    type="text"
                    value={formData.seo_meta_title}
                    onChange={(e) => setFormData({ ...formData, seo_meta_title: e.target.value })}
                    placeholder="e.g. SHUNYA I | Premium Luxury Watch"
                    className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-gray-700 focus:outline-none focus:border-[#d4a853]/30 transition"
                  />
                </div>

                {/* SEO Meta Description */}
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.15em] text-gray-500 mb-1.5">SEO Meta Description</label>
                  <textarea
                    value={formData.seo_meta_description}
                    onChange={(e) => setFormData({ ...formData, seo_meta_description: e.target.value })}
                    rows={3}
                    className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-gray-700 focus:outline-none focus:border-[#d4a853]/30 transition resize-none"
                    placeholder="Provide search engine summary..."
                  />
                </div>

                {/* SEO Keywords */}
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.15em] text-gray-500 mb-1.5">SEO Keywords (Comma Separated)</label>
                  <input
                    type="text"
                    value={formData.seo_keywords.join(", ")}
                    onChange={(e) => setFormData({ ...formData, seo_keywords: e.target.value.split(",").map(s => s.trim()).filter(Boolean) })}
                    placeholder="e.g. watch, luxury, automatic"
                    className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-gray-700 focus:outline-none focus:border-[#d4a853]/30 transition"
                  />
                </div>
              </div>
            )}

            {/* Submit */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="flex-1 px-4 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-xl text-sm text-gray-400 hover:text-white hover:bg-white/[0.06] transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2.5 bg-gradient-to-r from-[#d4a853] to-[#e8c97a] rounded-xl text-sm text-black font-medium hover:shadow-lg hover:shadow-[#d4a853]/10 transition-shadow"
              >
                {editingId ? "Update Product" : "Create Product"}
              </button>
            </div>
          </form>
        </div>
      </DashboardModal>

      {/* Delete Confirmation Modal */}
      <DashboardModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete Product"
        maxWidth="max-w-md"
      >
        <div className="text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-rose-500/[0.08] flex items-center justify-center mx-auto">
            <AlertTriangle size={24} className="text-rose-400" />
          </div>
          <p className="text-sm text-gray-400">
            Are you sure you want to delete <span className="text-white font-medium">{deleteTarget?.name}</span>? This action cannot be undone.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setDeleteTarget(null)}
              className="flex-1 px-4 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-xl text-sm text-gray-400 hover:text-white transition"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="flex-1 px-4 py-2.5 bg-rose-500/10 border border-rose-500/20 rounded-xl text-sm text-rose-400 hover:bg-rose-500/20 transition"
            >
              Delete
            </button>
          </div>
        </div>
      </DashboardModal>

      {/* Toast */}
      <DashboardToast {...toast} onClose={hideToast} />
    </div>
  );
}


