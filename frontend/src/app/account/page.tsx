"use client";

import { useState, useEffect } from "react";
import { useUser, RedirectToSignIn, useAuth } from "@clerk/nextjs";
import { useClerk } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Package,
  MapPin,
  CreditCard,
  Phone,
  User,
  LogOut,
  ChevronRight,
  Shield,
} from "lucide-react";
import { motion } from "framer-motion";
import { routeFetch } from "@/lib/apiClient";

const navItems = [
  {
    title: "Profile",
    description: "Personal information & settings",
    icon: User,
    href: "/account/profile",
  },
  {
    title: "Orders",
    description: "Track & manage purchases",
    icon: Package,
    href: "/account/orders",
  },
  {
    title: "Addresses",
    description: "Shipping & billing addresses",
    icon: MapPin,
    href: "/account/address",
  },
  {
    title: "Payments",
    description: "Saved payment methods",
    icon: CreditCard,
    href: "/account/payment",
  },
  {
    title: "Support",
    description: "Get help & contact us",
    icon: Phone,
    href: "/account/contact",
  },
];

export default function AccountPage() {
  const { isSignedIn, user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const { getToken } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    async function checkRole() {
      const token = await getToken();
      if (!token) return;
      try {
        const res = await routeFetch<any>("/users/me", token);
        if (res?.role === "admin") {
          setIsAdmin(true);
        }
      } catch (e) {
        console.error("Failed to check user role:", e);
      }
    }
    if (isSignedIn) {
      checkRole();
    }
  }, [isSignedIn, getToken]);

  if (!isLoaded) {
    return (
      <main className="min-h-screen bg-black text-white pt-32 px-6 pb-20">
        <div className="max-w-6xl mx-auto">
          {/* Skeleton */}
          <div className="animate-pulse space-y-6">
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 rounded-full bg-white/5" />
              <div className="space-y-3">
                <div className="h-6 w-48 bg-white/5 rounded-lg" />
                <div className="h-4 w-32 bg-white/5 rounded-lg" />
              </div>
            </div>
            <div className="grid gap-4 mt-10">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-20 bg-white/5 rounded-2xl" />
              ))}
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!isSignedIn) {
    return <RedirectToSignIn />;
  }

  return (
    <main className="min-h-screen bg-black text-white pt-32 px-6 pb-20">
      <div className="max-w-4xl mx-auto">
        {/* User Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="mb-12"
        >
          <div className="glass-card rounded-3xl p-8 md:p-10 relative overflow-hidden">
            {/* Subtle glow */}
            <div className="absolute -top-20 -right-20 w-60 h-60 bg-[#d4a853]/5 rounded-full blur-[80px]" />

            <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-6">
              {/* Avatar */}
              <div className="p-1 rounded-full bg-gradient-to-br from-[#d4a853]/60 to-[#d4a853]/20">
                {user?.imageUrl ? (
                  <Image
                    src={user.imageUrl}
                    alt={user.fullName || "User"}
                    width={80}
                    height={80}
                    className="w-20 h-20 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-[#d4a853] text-black flex items-center justify-center text-2xl font-serif">
                    {user?.firstName?.charAt(0) || "U"}
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="text-center sm:text-left flex-1">
                <p className="text-xs uppercase tracking-[0.35em] text-[#d4a853] mb-2">
                  Welcome back
                </p>
                <h1 className="text-3xl md:text-4xl font-serif">
                  {user?.fullName || user?.firstName || "Guest"}
                </h1>
                <p className="text-gray-500 text-sm mt-2">
                  {user?.primaryEmailAddress?.emailAddress}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Admin Dashboard Link */}
        {isAdmin && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <Link
              href="/dashboard"
              className="group flex items-center gap-5 rounded-2xl border border-[#d4a853]/30 bg-gradient-to-r from-[#d4a853]/[0.08] to-[#b08d3e]/[0.04] p-5 hover:bg-gradient-to-r hover:from-[#d4a853]/[0.12] hover:to-[#b08d3e]/[0.06] hover:border-[#d4a853]/60 transition-all duration-500 shadow-[0_4px_20px_rgba(212,168,83,0.06)]"
            >
              <div className="w-11 h-11 rounded-xl border border-[#d4a853]/35 bg-[#d4a853]/10 flex items-center justify-center text-[#d4a853] shrink-0 group-hover:bg-[#d4a853]/20 group-hover:scale-105 transition-all duration-500">
                <Shield size={18} />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h2 className="text-[15px] font-medium text-[#d4a853] tracking-wide">
                    Admin Control Panel
                  </h2>
                  <span className="text-[9px] uppercase tracking-widest px-2 py-0.5 rounded-full bg-[#d4a853]/15 border border-[#d4a853]/30 text-[#d4a853]">
                    Staff
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-0.5">
                  Manage watches, categories, users, and content settings
                </p>
              </div>

              <ChevronRight
                size={16}
                className="text-[#d4a853] group-hover:translate-x-0.5 transition-all duration-300 shrink-0"
              />
            </Link>
          </motion.div>
        )}

        {/* Navigation Cards */}
        <div className="space-y-3">
          {navItems.map((item, index) => {
            const Icon = item.icon;

            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: 0.15 + index * 0.06,
                  ease: "easeOut",
                }}
              >
                <Link
                  href={item.href}
                  className="group flex items-center gap-5 rounded-2xl border border-white/5 bg-white/[0.02] p-5 hover:bg-white/[0.04] hover:border-[#d4a853]/20 transition-all duration-500"
                >
                  <div className="w-11 h-11 rounded-xl border border-[#d4a853]/15 bg-[#d4a853]/5 flex items-center justify-center text-[#d4a853] shrink-0 group-hover:bg-[#d4a853]/10 group-hover:border-[#d4a853]/30 transition-all duration-500">
                    <Icon size={18} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h2 className="text-[15px] font-medium text-white group-hover:text-[#d4a853] transition-colors duration-300">
                      {item.title}
                    </h2>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {item.description}
                    </p>
                  </div>

                  <ChevronRight
                    size={16}
                    className="text-gray-600 group-hover:text-[#d4a853] group-hover:translate-x-0.5 transition-all duration-300 shrink-0"
                  />
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Sign Out */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 pt-8 border-t border-white/5"
        >
          <button
            onClick={() => signOut(() => window.location.assign("/"))}
            className="group flex items-center gap-3 text-sm text-gray-500 hover:text-red-400 transition-colors duration-300"
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </motion.div>
      </div>
    </main>
  );
}