"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  FileText,
  ArrowLeft,
  Settings,
  Sparkles,
  Users,
  Image,
  List,
} from "lucide-react";
import { useUser } from "@clerk/nextjs";

const links = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "Products", href: "/dashboard/products", icon: ShoppingBag },
  { name: "Orders", href: "/dashboard/orders", icon: Package },
  { name: "Content", href: "/dashboard/content", icon: FileText },
  { name: "Users", href: "/dashboard/users", icon: Users },
  { name: "Media", href: "/dashboard/media", icon: Image },
  { name: "Footer", href: "/dashboard/footer", icon: List },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { user } = useUser();

  return (
    <aside className="w-[260px] min-h-screen bg-[#070707] border-r border-white/[0.04] flex flex-col">
      {/* Brand */}
      <div className="px-7 pt-8 pb-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#d4a853] to-[#b08d3e] flex items-center justify-center">
            <Sparkles size={16} className="text-black" />
          </div>
          <div>
            <h1 className="text-lg font-serif text-white tracking-wider">BODHIQ</h1>
            <p className="text-[9px] text-gray-600 uppercase tracking-[0.2em] font-medium">Control Panel</p>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="mx-5 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        <p className="text-[9px] uppercase tracking-[0.2em] text-gray-600 font-medium px-3 mb-3">Main Menu</p>
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 group ${
                isActive
                  ? "text-black"
                  : "text-gray-500 hover:text-gray-300 hover:bg-white/[0.03]"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 bg-gradient-to-r from-[#d4a853] to-[#e8c97a] rounded-xl"
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}
              <Icon size={16} className="relative z-10 shrink-0" />
              <span className="relative z-10 text-[13px] font-medium tracking-wide">{link.name}</span>
              {isActive && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="relative z-10 ml-auto w-1.5 h-1.5 rounded-full bg-black/30"
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Info */}
      <div className="mx-5 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

      {user && (
        <div className="px-5 py-4">
          <div className="flex items-center gap-3 px-2 py-2 rounded-xl bg-white/[0.02]">
            {user.imageUrl ? (
              <img src={user.imageUrl} alt="" className="w-8 h-8 rounded-lg object-cover" />
            ) : (
              <div className="w-8 h-8 rounded-lg bg-[#d4a853]/10 flex items-center justify-center text-[#d4a853] text-xs font-semibold">
                {user.firstName?.[0] || "A"}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-xs text-white truncate font-medium">{user.firstName || "Admin"}</p>
              <p className="text-[10px] text-gray-600 truncate">{user.primaryEmailAddress?.emailAddress}</p>
            </div>
          </div>
        </div>
      )}

      {/* Back to Store */}
      <div className="px-4 pb-6">
        <Link
          href="/"
          className="flex items-center gap-2 px-3 py-2.5 text-[12px] text-gray-600 hover:text-[#d4a853] transition-colors rounded-xl hover:bg-white/[0.02]"
        >
          <ArrowLeft size={14} />
          <span className="tracking-wide">Back to Store</span>
        </Link>
      </div>
    </aside>
  );
}
