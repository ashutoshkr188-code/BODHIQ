"use client";

import { useEffect, useState, useMemo } from "react";
import { useAuth } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";
import { adminGetOrders, adminUpdateOrderStatus } from "@/features/dashboard/api";
import { DashboardModal } from "@/features/dashboard/components/DashboardModal";
import { DashboardToast, ToastFromHook, useToast } from "@/features/dashboard/components/DashboardToast";
import { DashboardSkeleton } from "@/features/dashboard/components/DashboardSkeleton";
import type { Order } from "@/types/api";
import {
  Package, Search, Eye, ChevronDown, X,
  Clock, CheckCircle, Truck, CreditCard, MapPin,
} from "lucide-react";

const statusConfig: Record<string, { bg: string; text: string; dot: string; icon: typeof Clock }> = {
  pending:   { bg: "bg-amber-500/[0.08]",   text: "text-amber-400",   dot: "bg-amber-400",   icon: Clock },
  paid:      { bg: "bg-emerald-500/[0.08]", text: "text-emerald-400", dot: "bg-emerald-400", icon: CreditCard },
  shipped:   { bg: "bg-blue-500/[0.08]",    text: "text-blue-400",    dot: "bg-blue-400",    icon: Truck },
  delivered: { bg: "bg-emerald-500/[0.08]", text: "text-emerald-300", dot: "bg-emerald-300", icon: CheckCircle },
};

export default function OrdersPage() {
  const { getToken } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const { toast, show: showToast, hide: hideToast } = useToast();

  useEffect(() => {
    loadOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadOrders() {
    const token = await getToken();
    if (!token) return;
    try {
      const res = await adminGetOrders(token, 1);
      setOrders(res.items || []);
    } catch (e) {
      console.error(e);
      showToast("Failed to load orders", "error");
    } finally {
      setLoading(false);
    }
  }

  const filteredOrders = useMemo(() => {
    let result = orders;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (o) =>
          o.order_number.toLowerCase().includes(q) ||
          o.customer_name.toLowerCase().includes(q) ||
          o.customer_email.toLowerCase().includes(q)
      );
    }
    if (filterStatus !== "all") {
      result = result.filter((o) => o.status === filterStatus);
    }
    return result;
  }, [orders, searchQuery, filterStatus]);

  async function handleStatusChange(orderId: string, newStatus: string) {
    const token = await getToken();
    if (!token) return;
    try {
      await adminUpdateOrderStatus(token, orderId, newStatus);
      setOrders(
        orders.map((o) =>
          o.id === orderId ? { ...o, status: newStatus as Order["status"] } : o
        )
      );
      showToast(`Order updated to ${newStatus}`, "success");
    } catch {
      showToast("Failed to update status", "error");
    }
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
      <div>
        <p className="text-[10px] uppercase tracking-[0.25em] text-[#d4a853] font-medium mb-2">Management</p>
        <h1 className="text-3xl font-serif text-white">Orders</h1>
        <p className="text-sm text-gray-500 mt-1">{orders.length} total order{orders.length !== 1 ? "s" : ""}</p>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
          <input
            type="text"
            placeholder="Search by order #, customer..."
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
          <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="appearance-none bg-white/[0.02] border border-white/[0.06] rounded-xl pl-4 pr-8 py-2.5 text-xs text-gray-400 focus:outline-none focus:border-[#d4a853]/30 transition cursor-pointer"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="rounded-2xl bg-white/[0.015] border border-white/[0.04] overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-white/[0.04]">
              {["Order", "Customer", "Amount", "Status", "Date", "Actions"].map((h) => (
                <th key={h} className="px-5 py-3.5 text-[9px] uppercase tracking-[0.15em] text-gray-600 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-16 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <Package size={28} className="text-gray-700" />
                    <p className="text-sm text-gray-500">
                      {searchQuery || filterStatus !== "all" ? "No matching orders" : "No orders yet"}
                    </p>
                  </div>
                </td>
              </tr>
            )}
            <AnimatePresence>
              {filteredOrders.map((order, i) => {
                const sc = statusConfig[order.status] || statusConfig.pending;
                return (
                  <motion.tr
                    key={order.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.03 }}
                    className="border-b border-white/[0.03] hover:bg-white/[0.015] transition-colors group"
                  >
                    <td className="px-5 py-3.5 text-xs font-mono text-white tracking-wider">{order.order_number}</td>
                    <td className="px-5 py-3.5">
                      <p className="text-xs text-gray-300">{order.customer_name}</p>
                      <p className="text-[10px] text-gray-600 mt-0.5">{order.customer_email}</p>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-white font-medium">₹{order.amount.toLocaleString()}</td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full ${sc.bg}`}>
                        <span className={`w-1 h-1 rounded-full ${sc.dot}`} />
                        <span className={`text-[10px] uppercase tracking-wider font-medium ${sc.text}`}>{order.status}</span>
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-gray-500">
                      {new Date(order.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "2-digit" })}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="p-2 rounded-lg text-gray-500 hover:text-[#d4a853] hover:bg-[#d4a853]/[0.06] transition"
                        >
                          <Eye size={14} />
                        </button>
                        <div className="relative">
                          <select
                            value={order.status}
                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                            className="appearance-none bg-transparent border border-white/[0.06] rounded-lg pl-2 pr-6 py-1.5 text-[10px] text-gray-400 focus:outline-none focus:border-[#d4a853]/30 transition cursor-pointer"
                          >
                            <option value="pending">Pending</option>
                            <option value="paid">Paid</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                          </select>
                          <ChevronDown size={10} className="absolute right-1.5 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none" />
                        </div>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* Order Detail Modal */}
      <DashboardModal
        open={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        title={`Order ${selectedOrder?.order_number || ""}`}
        subtitle="Complete order details"
        maxWidth="max-w-2xl"
      >
        {selectedOrder && <OrderDetailView order={selectedOrder} />}
      </DashboardModal>

      <DashboardToast {...toast} onClose={hideToast} />
    </div>
  );
}

function OrderDetailView({ order }: { order: Order }) {
  const sc = statusConfig[order.status] || statusConfig.pending;
  const StatusIcon = sc.icon;

  return (
    <div className="space-y-6">
      {/* Status Banner */}
      <div className={`flex items-center gap-3 p-4 rounded-xl ${sc.bg}`}>
        <StatusIcon size={18} className={sc.text} />
        <div>
          <p className={`text-sm font-medium ${sc.text}`}>Status: {order.status.charAt(0).toUpperCase() + order.status.slice(1)}</p>
          <p className="text-[11px] text-gray-500 mt-0.5">
            Placed on {new Date(order.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
          </p>
        </div>
      </div>

      {/* Customer + Payment */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
          <p className="text-[9px] uppercase tracking-[0.15em] text-gray-600 mb-2">Customer</p>
          <p className="text-sm text-white font-medium">{order.customer_name}</p>
          <p className="text-xs text-gray-500 mt-1">{order.customer_email}</p>
        </div>
        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
          <p className="text-[9px] uppercase tracking-[0.15em] text-gray-600 mb-2">Payment</p>
          <p className="text-sm text-white font-medium">₹{order.amount.toLocaleString()}</p>
          {order.razorpay_payment_id && (
            <p className="text-[10px] text-gray-600 font-mono mt-1">Ref: {order.razorpay_payment_id}</p>
          )}
        </div>
      </div>

      {/* Shipping Address */}
      {order.shipping_address && (
        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
          <div className="flex items-center gap-2 mb-2">
            <MapPin size={12} className="text-gray-600" />
            <p className="text-[9px] uppercase tracking-[0.15em] text-gray-600">Shipping Address</p>
          </div>
          <p className="text-sm text-white">{order.shipping_address.fullName}</p>
          <p className="text-xs text-gray-500 mt-1 leading-relaxed">
            {order.shipping_address.street}<br />
            {order.shipping_address.city}, {order.shipping_address.state}<br />
            {order.shipping_address.postalCode}, {order.shipping_address.country}
          </p>
          {order.shipping_address.phone && (
            <p className="text-xs text-gray-600 mt-2">📞 {order.shipping_address.phone}</p>
          )}
        </div>
      )}

      {/* Items */}
      <div>
        <p className="text-[9px] uppercase tracking-[0.15em] text-gray-600 mb-3">Items</p>
        <div className="space-y-2">
          {order.cart_items?.map((item, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-3 rounded-xl bg-white/[0.015] border border-white/[0.03]"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/[0.04] flex items-center justify-center">
                  <Package size={12} className="text-gray-600" />
                </div>
                <div>
                  <p className="text-sm text-white">{item.name}</p>
                  <p className="text-[10px] text-gray-600">Qty: {item.quantity}</p>
                </div>
              </div>
              <p className="text-sm text-white font-medium">₹{item.price.toLocaleString()}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Total */}
      <div className="flex items-center justify-between pt-4 border-t border-white/[0.04]">
        <p className="text-[10px] uppercase tracking-[0.15em] text-gray-500">Total Amount</p>
        <p className="text-xl font-serif text-white">₹{order.amount.toLocaleString()}</p>
      </div>
    </div>
  );
}


