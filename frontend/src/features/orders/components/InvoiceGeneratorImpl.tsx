"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, Loader2 } from "lucide-react";
import type { InvoiceOrder } from "@/types/api";

interface InvoiceCartItem {
  name: string;
  quantity: number;
  price: number;
}

// ─── Toast Component (self-dismissing) ───
function Toast({ message, type }: { message: string; type: "error" | "success" }) {
  const bg = type === "error" ? "#991b1b" : "#166534";
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      style={{
        position: "fixed",
        bottom: 40,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 9999,
        background: bg,
        color: "#ffffff",
        padding: "14px 28px",
        borderRadius: 999,
        fontSize: 13,
        fontWeight: 500,
        letterSpacing: "0.02em",
        boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
      }}
    >
      {message}
    </motion.div>
  );
}

// ─── Main Component ───
export default function InvoiceGeneratorImpl({
  order,
  buttonText = "Download Invoice",
  variant = "primary",
}: {
  order: InvoiceOrder;
  buttonText?: string;
  variant?: "primary" | "secondary" | "outline";
}) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "error" | "success" } | null>(null);
  const invoiceRef = useRef<HTMLDivElement>(null);

  const showToast = useCallback((message: string, type: "error" | "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  }, []);

  const generatePDF = async () => {
    if (!invoiceRef.current) return;
    setIsGenerating(true);

    try {
      const element = invoiceRef.current;

      // Make the hidden invoice visible for capture
      element.style.display = "block";
      // Give the browser one frame to layout
      await new Promise((r) => setTimeout(r, 100));

      // Dynamic imports — only loaded on demand
      const [jsPDF, html2canvasModule] = await Promise.all([
        import("jspdf").then((mod) => mod.default),
        import("html2canvas").then((mod) => mod.default),
      ]);

      const canvas = await html2canvasModule(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
        // Force html2canvas to ignore inherited oklch styles
        onclone: (clonedDoc: Document) => {
          const root = clonedDoc.documentElement;
          root.style.setProperty("color", "#000000");
          root.style.setProperty("background-color", "#ffffff");
        },
      });

      element.style.display = "none";

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`BODHIQ-Invoice-${order.orderNumber}.pdf`);

      showToast("Invoice downloaded successfully!", "success");
    } catch (error) {
      console.error("Invoice generation failed:", error);
      showToast("Invoice download failed. Please try again.", "error");
    } finally {
      setIsGenerating(false);
    }
  };

  // ─── Button styles (these use Tailwind — fine, they're never captured) ───
  const getButtonStyles = () => {
    switch (variant) {
      case "primary":
        return "px-8 py-3.5 bg-[#d4a853] text-black hover:bg-[#e8c97a] border border-[#d4a853]";
      case "secondary":
        return "px-6 py-2.5 bg-white/5 text-[#d4a853] hover:bg-white/10 border border-[#d4a853]/30";
      case "outline":
        return "px-6 py-2.5 bg-transparent text-gray-400 hover:text-white border border-white/10 hover:border-white/30";
      default:
        return "px-8 py-3.5 bg-[#d4a853] text-black hover:bg-[#e8c97a]";
    }
  };

  if (!order) return null;

  // ─── Reusable inline style constants (all hex/rgb, zero oklch) ───
  const GOLD = "#d4a853";
  const BLACK = "#1a1a1a";
  const DARK_GRAY = "#555555";
  const MEDIUM_GRAY = "#888888";
  const LIGHT_GRAY = "#cccccc";
  const BORDER = "#e0e0e0";
  const BORDER_GOLD = "rgba(212, 168, 83, 0.35)";
  const BG_WHITE = "#ffffff";
  const BG_SUBTLE = "#fafafa";

  return (
    <>
      {/* ─── Button (website UI — Tailwind OK here) ─── */}
      <button
        onClick={generatePDF}
        disabled={isGenerating}
        className={`rounded-full text-xs uppercase tracking-widest font-medium transition duration-300 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed ${getButtonStyles()}`}
      >
        <AnimatePresence mode="wait">
          {isGenerating ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2"
            >
              <Loader2 size={14} className="animate-spin" />
              Generating Invoice...
            </motion.div>
          ) : (
            <motion.div
              key="ready"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2"
            >
              <Download size={14} />
              {buttonText}
            </motion.div>
          )}
        </AnimatePresence>
      </button>

      {/* ─── Toast Notification ─── */}
      <AnimatePresence>
        {toast && <Toast message={toast.message} type={toast.type} />}
      </AnimatePresence>

      {/* ─────────────────────────────────────────────────────────────
          HIDDEN INVOICE TEMPLATE — PURE INLINE STYLES ONLY
          
          CRITICAL: Zero Tailwind classes are used inside this div.
          Every color is hex or rgb(). html2canvas will never 
          encounter oklch() from this subtree.
      ───────────────────────────────────────────────────────────── */}
      <div style={{ position: "absolute", left: "-9999px", top: "-9999px", width: 0, height: 0, overflow: "hidden" }}>
        <div
          id="invoice-pdf"
          ref={invoiceRef}
          style={{
            width: 800,
            padding: 56,
            display: "none",
            backgroundColor: BG_WHITE,
            color: BLACK,
            fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif",
            fontSize: 14,
            lineHeight: 1.6,
          }}
        >
          {/* ── Header ── */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: `2px solid ${BORDER_GOLD}`, paddingBottom: 32, marginBottom: 36 }}>
            <div>
              <div style={{ fontSize: 28, letterSpacing: "0.35em", fontWeight: 300, color: GOLD, marginBottom: 4 }}>
                BODHIQ
              </div>
              <div style={{ fontSize: 10, color: MEDIUM_GRAY, textTransform: "uppercase", letterSpacing: "0.2em" }}>
                Timeless Craftsmanship
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 22, fontWeight: 600, color: BLACK, marginBottom: 6 }}>
                INVOICE
              </div>
              <div style={{ fontSize: 13, fontFamily: "'Courier New', monospace", color: DARK_GRAY }}>
                #{order.orderNumber}
              </div>
              <div style={{ fontSize: 12, color: MEDIUM_GRAY, marginTop: 4 }}>
                {new Date(order.createdAt).toLocaleDateString("en-IN", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
            </div>
          </div>

          {/* ── Customer & Shipping ── */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, marginBottom: 40 }}>
            <div>
              <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.2em", color: GOLD, marginBottom: 12, fontWeight: 600 }}>
                Billed To
              </div>
              <div style={{ fontSize: 14, color: BLACK, fontWeight: 600, marginBottom: 4 }}>
                {order.customerName}
              </div>
              <div style={{ fontSize: 13, color: DARK_GRAY }}>
                {order.customerEmail}
              </div>
            </div>
            {order.shippingAddress && (
              <div>
                <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.2em", color: GOLD, marginBottom: 12, fontWeight: 600 }}>
                  Shipped To
                </div>
                <div style={{ fontSize: 14, color: BLACK, fontWeight: 600, marginBottom: 4 }}>
                  {order.shippingAddress.fullName}
                </div>
                <div style={{ fontSize: 13, color: DARK_GRAY, lineHeight: 1.7 }}>
                  {order.shippingAddress.street}<br />
                  {order.shippingAddress.city}, {order.shippingAddress.state}<br />
                  {order.shippingAddress.postalCode}, {order.shippingAddress.country}
                </div>
              </div>
            )}
          </div>

          {/* ── Items Table ── */}
          <div style={{ marginBottom: 40 }}>
            <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.2em", color: GOLD, marginBottom: 16, fontWeight: 600 }}>
              Order Details
            </div>

            {/* Table Header */}
            <div style={{ display: "grid", gridTemplateColumns: "7fr 2fr 3fr", gap: 16, borderBottom: `2px solid ${BORDER_GOLD}`, paddingBottom: 10, marginBottom: 4 }}>
              <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.15em", color: MEDIUM_GRAY, fontWeight: 600 }}>Item</div>
              <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.15em", color: MEDIUM_GRAY, fontWeight: 600, textAlign: "center" }}>Qty</div>
              <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.15em", color: MEDIUM_GRAY, fontWeight: 600, textAlign: "right" }}>Price</div>
            </div>

            {/* Table Rows */}
            {order.cartItems?.map((item: InvoiceCartItem, i: number) => (
              <div
                key={i}
                style={{
                  display: "grid",
                  gridTemplateColumns: "7fr 2fr 3fr",
                  gap: 16,
                  padding: "14px 0",
                  borderBottom: `1px solid ${BORDER}`,
                }}
              >
                <div style={{ fontSize: 14, fontWeight: 500, color: BLACK }}>{item.name}</div>
                <div style={{ fontSize: 14, color: DARK_GRAY, textAlign: "center" }}>{item.quantity}</div>
                <div style={{ fontSize: 14, color: BLACK, textAlign: "right", fontWeight: 500 }}>
                  ₹{item.price.toLocaleString()}
                </div>
              </div>
            ))}
          </div>

          {/* ── Totals ── */}
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 48 }}>
            <div style={{ width: 260 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, padding: "8px 0", color: DARK_GRAY }}>
                <span>Subtotal</span>
                <span style={{ color: BLACK }}>₹{order.amount.toLocaleString()}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, padding: "8px 0", color: DARK_GRAY }}>
                <span>Shipping</span>
                <span style={{ color: BLACK }}>Complimentary</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, padding: "8px 0", color: DARK_GRAY }}>
                <span>Taxes</span>
                <span style={{ color: BLACK }}>Included</span>
              </div>
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderTop: `2px solid ${BORDER_GOLD}`,
                paddingTop: 14,
                marginTop: 8,
              }}>
                <span style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.2em", color: GOLD, fontWeight: 600 }}>
                  Total
                </span>
                <span style={{ fontSize: 20, fontWeight: 700, color: BLACK }}>
                  ₹{order.amount.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* ── Status Badge ── */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 32 }}>
            <div style={{
              display: "inline-block",
              padding: "8px 24px",
              borderRadius: 999,
              backgroundColor: BG_SUBTLE,
              border: `1px solid ${BORDER}`,
              fontSize: 11,
              textTransform: "uppercase",
              letterSpacing: "0.15em",
              color: DARK_GRAY,
              fontWeight: 600,
            }}>
              Status: {order.status || "Confirmed"}
            </div>
          </div>

          {/* ── Footer ── */}
          <div style={{ textAlign: "center", borderTop: `1px solid ${BORDER}`, paddingTop: 28 }}>
            <div style={{ fontSize: 12, color: MEDIUM_GRAY, marginBottom: 6 }}>
              Thank you for trusting BODHIQ. For support, contact bodhiq.official@gmail.com
            </div>
            {order.razorpayPaymentId && (
              <div style={{ fontSize: 10, color: LIGHT_GRAY, textTransform: "uppercase", letterSpacing: "0.15em" }}>
                Payment Ref: {order.razorpayPaymentId}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
