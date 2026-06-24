import { auth } from "@clerk/nextjs/server";
import { getDashboardStats } from "@/features/dashboard/api";
import { StatCard } from "@/features/dashboard/components/StatCard";
import { DollarSign, ShoppingBag, Users, Package, Clock, TrendingUp, ArrowUpRight } from "lucide-react";
import type { DashboardStats, RecentOrder } from "@/types/api";
import Link from "next/link";

export default async function DashboardOverview() {
  const { getToken } = await auth();
  const token = await getToken();
  
  let stats: DashboardStats = {
    total_revenue: 0,
    total_orders: 0,
    total_products: 0,
    total_users: 0,
    pending_orders: 0,
    recent_orders: []
  };

  if (token) {
    try {
      stats = await getDashboardStats(token);
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div className="space-y-10 pb-12">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-[0.25em] text-[#d4a853] font-medium mb-2">Dashboard</p>
          <h1 className="text-3xl font-serif text-white">Overview</h1>
          <p className="text-sm text-gray-500 mt-1">Welcome back to the BODHIQ control center.</p>
        </div>
        <div className="flex items-center gap-2 text-[10px] text-gray-600 uppercase tracking-wider">
          <Clock size={12} />
          <span>{new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Revenue"
          value={`₹${stats.total_revenue?.toLocaleString() || 0}`}
          icon={<DollarSign size={44} />}
          delay={0.05}
          trend="12.5% this month"
          trendUp={true}
        />
        <StatCard
          title="Total Orders"
          value={stats.total_orders || 0}
          icon={<ShoppingBag size={44} />}
          delay={0.1}
        />
        <StatCard
          title="Products"
          value={stats.total_products || 0}
          icon={<Package size={44} />}
          delay={0.15}
        />
        <StatCard
          title="Users"
          value={stats.total_users || 0}
          icon={<Users size={44} />}
          delay={0.2}
        />
      </div>

      {/* Quick Actions + Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="space-y-4">
          <h2 className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-medium">Quick Actions</h2>
          <div className="space-y-2">
            {[
              { label: "Add New Product", href: "/dashboard/products", icon: Package, desc: "List a new item" },
              { label: "Manage Orders", href: "/dashboard/orders", icon: ShoppingBag, desc: "Process pending orders" },
              { label: "Edit Content", href: "/dashboard/content", icon: TrendingUp, desc: "Update website copy" },
            ].map((action) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.href}
                  href={action.href}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.04] hover:border-[#d4a853]/20 hover:bg-white/[0.03] transition-all duration-300 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#d4a853]/[0.06] flex items-center justify-center group-hover:bg-[#d4a853]/[0.12] transition">
                    <Icon size={16} className="text-[#d4a853]/60 group-hover:text-[#d4a853] transition" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-white font-medium">{action.label}</p>
                    <p className="text-[11px] text-gray-600">{action.desc}</p>
                  </div>
                  <ArrowUpRight size={14} className="text-gray-700 group-hover:text-[#d4a853] transition" />
                </Link>
              );
            })}
          </div>

          {/* Pending Orders Counter */}
          {stats.pending_orders > 0 && (
            <div className="p-4 rounded-2xl bg-amber-500/[0.06] border border-amber-500/10">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                <p className="text-sm text-amber-200/80">
                  <span className="font-semibold text-amber-200">{stats.pending_orders}</span> order{stats.pending_orders !== 1 ? "s" : ""} pending
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Recent Orders */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-medium">Recent Orders</h2>
            <Link
              href="/dashboard/orders"
              className="text-[10px] uppercase tracking-[0.15em] text-[#d4a853]/60 hover:text-[#d4a853] transition"
            >
              View All →
            </Link>
          </div>

          <div className="rounded-2xl bg-white/[0.015] border border-white/[0.04] overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/[0.04]">
                  {["Order", "Customer", "Date", "Amount", "Status"].map((h) => (
                    <th key={h} className="px-5 py-3.5 text-[9px] uppercase tracking-[0.15em] text-gray-600 font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {stats.recent_orders?.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-5 py-12 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <Package size={24} className="text-gray-700" />
                        <p className="text-sm text-gray-600">No orders yet</p>
                      </div>
                    </td>
                  </tr>
                )}
                {stats.recent_orders?.map((order: RecentOrder, i: number) => (
                  <tr
                    key={order.id}
                    className="border-b border-white/[0.03] hover:bg-white/[0.015] transition-colors"
                    style={{ animationDelay: `${i * 50}ms` }}
                  >
                    <td className="px-5 py-3.5 text-xs font-mono text-white tracking-wider">{order.order_number}</td>
                    <td className="px-5 py-3.5 text-xs text-gray-400">{order.customer_name}</td>
                    <td className="px-5 py-3.5 text-xs text-gray-500">
                      {new Date(order.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}
                    </td>
                    <td className="px-5 py-3.5 text-xs text-white font-medium">₹{order.amount?.toLocaleString()}</td>
                    <td className="px-5 py-3.5">
                      <StatusBadge status={order.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { bg: string; text: string; dot: string }> = {
    paid:      { bg: "bg-emerald-500/[0.08]", text: "text-emerald-400", dot: "bg-emerald-400" },
    pending:   { bg: "bg-amber-500/[0.08]",   text: "text-amber-400",  dot: "bg-amber-400" },
    shipped:   { bg: "bg-blue-500/[0.08]",    text: "text-blue-400",   dot: "bg-blue-400" },
    delivered: { bg: "bg-emerald-500/[0.08]", text: "text-emerald-300", dot: "bg-emerald-300" },
  };
  const c = config[status] || config.pending;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full ${c.bg}`}>
      <span className={`w-1 h-1 rounded-full ${c.dot}`} />
      <span className={`text-[10px] uppercase tracking-wider font-medium ${c.text}`}>{status}</span>
    </span>
  );
}
