"use client";

import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Menu, X } from "lucide-react";
import { SignInButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useCartStore } from "@/hooks/cartStore";

interface DropdownItem {
  label: string;
  href: string;
}

interface NavLink {
  label: string;
  href: string;
  dropdown?: DropdownItem[];
}

interface NavSettings {
  navLinks?: NavLink[];
  logoText?: string;
}

const navLinks = [
  {
    label: "Collection",
    href: "/collection",
    dropdown: [
      { label: "Watches", href: "/collection/watches" },
      { label: "Accessories", href: "/collection/accessories" },
      { label: "New Arrivals", href: "/collection/new-arrivals" },
      { label: "Limited Edition", href: "/collection/limited-edition" },
    ],
  },
  { label: "Craftsmanship", href: "/craftsmanship" },
  { label: "About", href: "/about" },
];

export default function Navbar({ settings }: { settings?: NavSettings }) {
  const finalNavLinks = settings?.navLinks && settings.navLinks.length > 0 ? settings.navLinks : navLinks;
  const brandName = settings?.logoText || "BODHIQ";
  const { isSignedIn, user } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const itemCount = useCartStore((state) => state.getItemCount());
  const lastAddedAt = useCartStore((state) => state.lastAddedAt);
  const [showPlusOne, setShowPlusOne] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileDropdown, setMobileDropdown] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!lastAddedAt) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setShowPlusOne(true);
    const timer = setTimeout(() => setShowPlusOne(false), 900);
    return () => clearTimeout(timer);
  }, [lastAddedAt]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMobileOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile menu open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className={`fixed top-0 left-0 w-full z-50 text-white transition-all duration-500 ${
          scrolled
            ? "bg-black/90 backdrop-blur-md shadow-lg"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileOpen(true)}
            className="md:hidden p-3 -ml-3 hover:text-[#d4a853] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4a853]"
            aria-label="Open navigation menu"
            aria-expanded={mobileOpen}
          >
            <Menu size={22} />
          </button>

          {/* Desktop Left Links */}
          <div className="hidden md:flex items-center space-x-8 text-xs tracking-widest uppercase">
            {finalNavLinks.map((link: NavLink, idx: number) =>
              link.dropdown && link.dropdown.length > 0 ? (
                <div key={link.label} className="relative group">
                  <motion.p
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 + idx * 0.12 }}
                    whileHover={{ y: -1.5 }}
                    className="relative cursor-pointer"
                  >
                    {link.label}
                    <span className="absolute left-0 -bottom-1 w-0 h-px bg-[#d4a853] transition-all duration-300 group-hover:w-full" />
                  </motion.p>

                 <div className="absolute left-0 top-full z-50 pointer-events-none group-hover:pointer-events-auto">
  <div className="h-3 w-full" />
  <div className="min-w-60 overflow-hidden rounded-2xl border border-[#d4a853]/15 bg-black/90 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.45)] opacity-0 invisible -translate-y-3 scale-[0.98] transition-all duration-500 ease-out group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:scale-100">
                      {link.dropdown.map((item: DropdownItem) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="block px-5 py-3 text-white/90 hover:bg-white/4 hover:text-[#d4a853] transition duration-300"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <Link key={link.label} href={link.href} className="block">
                  <motion.p
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 + idx * 0.12 }}
                    whileHover={{ y: -1.5 }}
                    className="relative cursor-pointer group"
                  >
                    {link.label}
                    <span className="absolute left-0 -bottom-1 w-0 h-px bg-[#d4a853] transition-all duration-300 group-hover:w-full" />
                  </motion.p>
                </Link>
              )
            )}
          </div>

          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-sm tracking-[0.4em] font-light cursor-pointer select-none"
            onClick={() => router.push("/")}
          >
            {brandName}
          </motion.div>

          {/* Right Section */}
          <div className="flex items-center space-x-5">
            <Link href="/cart">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                whileHover={{ scale: 1.08 }}
                className="cursor-pointer relative"
              >
                <ShoppingBag size={18} />

                {mounted && itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 min-w-5 h-5 px-1 rounded-full bg-[#d4a853] text-black text-[10px] font-semibold flex items-center justify-center">
                    {itemCount}
                  </span>
                )}

                {mounted && showPlusOne && (
                  <motion.span
                    initial={{ opacity: 0, y: 8, scale: 0.8 }}
                    animate={{ opacity: 1, y: -18, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="absolute -top-6 right-0 text-[10px] font-semibold text-[#d4a853]"
                  >
                    +1
                  </motion.span>
                )}
              </motion.div>
            </Link>

            <div className="hidden md:block">
              {!isSignedIn ? (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <SignInButton mode="modal">
                    <button
                      type="button"
                      className="border border-[#d4a853] px-4 py-1.5 text-xs uppercase tracking-widest hover:bg-[#d4a853] hover:text-black transition duration-300"
                    >
                      Sign In
                    </button>
                  </SignInButton>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="relative"
                >
                  <motion.button
                    type="button"
                    onClick={() => router.push("/account")}
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.98 }}
                    className="cursor-pointer outline-none"
                  >
                    <div className="p-0.5 rounded-full bg-linear-to-r from-[#d4a853] to-[#b08d3e]">
                      <div className="bg-black rounded-full p-0.5">
                        {user?.imageUrl ? (
                          <Image
                            src={user.imageUrl}
                            alt={user.fullName || "User"}
                            width={36}
                            height={36}
                            className="w-9 h-9 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-[#d4a853] text-black flex items-center justify-center text-sm font-semibold">
                            {user?.firstName?.charAt(0) || "U"}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.button>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Slide-Out Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-60 bg-black/60 backdrop-blur-sm md:hidden"
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
              className="fixed top-0 left-0 bottom-0 w-[85%] max-w-sm z-70 bg-[#0a0a0a] border-r border-[#d4a853]/10 overflow-y-auto md:hidden"
            >
              <div className="p-6">
                {/* Close Button */}
                <div className="flex items-center justify-between mb-10">
                  <span className="text-sm tracking-[0.4em] font-light">
                    {brandName}
                  </span>
                  <button
                    onClick={() => setMobileOpen(false)}
                    className="p-3 -mr-3 hover:text-[#d4a853] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4a853]"
                    aria-label="Close navigation menu"
                  >
                    <X size={22} />
                  </button>
                </div>

                {/* Navigation Links */}
                <nav className="space-y-1">
                  {finalNavLinks.map((link: NavLink) =>
                    link.dropdown && link.dropdown.length > 0 ? (
                      <div key={link.label}>
                        <button
                          onClick={() =>
                            setMobileDropdown(
                              mobileDropdown === link.label
                                ? null
                                : link.label
                            )
                          }
                          className="w-full flex items-center justify-between py-3 text-lg font-serif text-white hover:text-[#d4a853] transition-colors"
                        >
                          {link.label}
                          <span className="text-[#d4a853] text-sm">
                            {mobileDropdown === link.label ? "−" : "+"}
                          </span>
                        </button>

                        <AnimatePresence>
                          {mobileDropdown === link.label && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3 }}
                              className="overflow-hidden"
                            >
                              <div className="pl-4 pb-2 space-y-1 border-l border-[#d4a853]/20">
                                {link.dropdown.map((item: DropdownItem) => (
                                  <Link
                                    key={item.href}
                                    href={item.href}
                                    className="block py-2 text-sm text-gray-400 hover:text-[#d4a853] transition-colors"
                                  >
                                    {item.label}
                                  </Link>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ) : (
                      <Link
                        key={link.label}
                        href={link.href}
                        className="block py-3 text-lg font-serif text-white hover:text-[#d4a853] transition-colors"
                      >
                        {link.label}
                      </Link>
                    )
                  )}
                </nav>

                {/* Separator */}
                <div className="gold-separator my-8" />

                {/* Auth Section for Mobile */}
                <div className="space-y-4">
                  {!isSignedIn ? (
                    <SignInButton mode="modal">
                      <button
                        type="button"
                        className="w-full border border-[#d4a853] py-3 text-xs uppercase tracking-widest text-[#d4a853] hover:bg-[#d4a853] hover:text-black transition duration-300"
                      >
                        Sign In
                      </button>
                    </SignInButton>
                  ) : (
                    <Link
                      href="/account"
                      className="flex items-center gap-3 py-3 text-white hover:text-[#d4a853] transition-colors"
                    >
                      {user?.imageUrl ? (
                        <Image
                          src={user.imageUrl}
                          alt={user.fullName || "User"}
                          width={32}
                          height={32}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-[#d4a853] text-black flex items-center justify-center text-sm font-semibold">
                          {user?.firstName?.charAt(0) || "U"}
                        </div>
                      )}
                      <span className="text-sm">My Account</span>
                    </Link>
                  )}
                </div>

                {/* Bottom Tagline */}
                <div className="mt-12 pt-6 border-t border-white/5">
                  <p className="text-[10px] uppercase tracking-[0.3em] text-gray-600">
                    Timeless Craftsmanship
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
