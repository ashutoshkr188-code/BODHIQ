"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, ShoppingBag, Package, FileText,
  ArrowLeft, Settings, Sparkles, Users, Image, List,
  ChevronDown, Home, Globe, FileQuestion, ScrollText,
} from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { useState } from "react";

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  children?: { name: string; href: string }[];
}

const links: NavItem[] = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
  {
    name: "Website Content",
    href: "/dashboard/content",
    icon: Globe,
    children: [
      { name: "Hero & Homepage", href: "/dashboard/content" },
      { name: "Philosophy", href: "/dashboard/content/philosophy" },
      { name: "Promo Banner", href: "/dashboard/content/promo" },
      { name: "Featured Collection", href: "/dashboard/content/featured" },
    ],
  },
  {
    name: "Pages",
    href: "/dashboard/pages",
    icon: FileText,
    children: [
      { name: "About", href: "/dashboard/pages/about" },
      { name: "Craftsmanship", href: "/dashboard/pages/craftsmanship" },
      { name: "FAQs", href: "/dashboard/pages/faqs" },
      { name: "Info Pages", href: "/dashboard/pages/info" },
      { name: "Policy Pages", href: "/dashboard/pages/policies" },
    ],
  },
  { name: "Footer", href: "/dashboard/footer", icon: List },
  { name: "Header & Nav", href: "/dashboard/global", icon: Home },
  { name: "Settings & SEO", href: "/dashboard/settings", icon: Settings },
  { name: "Products", href: "/dashboard/products", icon: ShoppingBag },
  { name: "Orders", href: "/dashboard/orders", icon: Package },
  { name: "Users", href: "/dashboard/users", icon: Users },
  { name: "Media Library", href: "/dashboard/media", icon: Image },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { user } = useUser();

  const [openGroups, setOpenGroups] = useState<string[]>(() => {
    // Auto-open the group that contains the current path
    return links
      .filter((l) => l.children && (pathname === l.href || l.children.some((c) => pathname.startsWith(c.href))))
      .map((l) => l.name);
  });

  const toggleGroup = (name: string) => {
    setOpenGroups((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    );
  };

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

      <div className="mx-5 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-0.5 overflow-y-auto">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          const isGroupOpen = openGroups.includes(link.name);
          const isChildActive = link.children?.some((c) => pathname.startsWith(c.href));

          if (link.children) {
            return (
              <div key={link.name}>
                <button
                  onClick={() => toggleGroup(link.name)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-left ${
                    isChildActive
                      ? "text-[#d4a853] bg-[#d4a853]/5"
                      : "text-gray-500 hover:text-gray-300 hover:bg-white/[0.03]"
                  }`}
                >
                  <Icon size={16} className="shrink-0" />
                  <span className="flex-1 text-[13px] font-medium tracking-wide">{link.name}</span>
                  <ChevronDown
                    size={13}
                    className={`transition-transform duration-200 ${isGroupOpen ? "rotate-180" : ""}`}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {isGroupOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="pl-9 pr-2 py-1 space-y-0.5">
                        {link.children.map((child) => {
                          const isChildItemActive = pathname === child.href;
                          return (
                            <Link
                              key={child.href}
                              href={child.href}
                              className={`block px-3 py-2 rounded-lg text-[12px] transition-all duration-200 ${
                                isChildItemActive
                                  ? "text-[#d4a853] bg-[#d4a853]/8 font-medium"
                                  : "text-gray-600 hover:text-gray-400 hover:bg-white/[0.02]"
                              }`}
                            >
                              {child.name}
                            </Link>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          }

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 group ${
                isActive ? "text-black" : "text-gray-500 hover:text-gray-300 hover:bg-white/[0.03]"
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
