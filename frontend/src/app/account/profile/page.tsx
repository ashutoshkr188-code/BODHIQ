"use client";

import { RedirectToSignIn, UserProfile, useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { useClerk } from "@clerk/nextjs";
import { LogOut } from "lucide-react";
import Link from "next/link";

export default function AccountProfilePage() {
  const { isLoaded, isSignedIn } = useUser();
  const { signOut } = useClerk();

  if (!isLoaded) {
    return (
      <main className="min-h-screen bg-black text-white pt-32 px-6 pb-20">
        <div className="max-w-6xl mx-auto animate-pulse space-y-6">
          <div className="h-6 w-32 bg-white/5 rounded-lg" />
          <div className="h-10 w-64 bg-white/5 rounded-lg" />
          <div className="h-[500px] bg-white/5 rounded-2xl mt-8" />
        </div>
      </main>
    );
  }

  if (!isSignedIn) {
    return <RedirectToSignIn />;
  }

  return (
    <main className="min-h-screen bg-black text-white pt-32 px-6 pb-20">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mb-10"
        >
          <Link
            href="/account"
            className="text-xs uppercase tracking-[0.3em] text-gray-500 hover:text-[#d4a853] transition-colors mb-6 inline-block"
          >
            ← Account
          </Link>
          <p className="text-xs tracking-[0.4em] text-[#d4a853] uppercase mb-2">
            Account
          </p>
          <h1 className="text-3xl md:text-5xl font-serif">Your Profile</h1>
          <p className="text-gray-400 mt-2">
            Manage your personal information, security, and account settings.
          </p>
        </motion.div>

        {/* Clerk Profile UI */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.6 }}
          className="glass-card rounded-3xl p-3 md:p-5"
        >
          {/* Sign Out */}
          <div className="flex justify-end mb-3">
            <button
              onClick={() => signOut(() => window.location.assign("/"))}
              className="flex items-center gap-2 text-xs uppercase tracking-widest text-gray-500 hover:text-red-400 transition-colors px-3 py-2 rounded-lg hover:bg-white/[0.03]"
            >
              <LogOut size={14} />
              Sign Out
            </button>
          </div>

          <UserProfile
            path="/account/profile"
            routing="path"
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "bg-transparent shadow-none border-0",
                navbar: "bg-black/60 border-r border-[#d4a853]/15",
                pageScrollBox: "bg-transparent",
                formButtonPrimary:
                  "bg-[#d4a853] text-black hover:bg-[#e8c97a]",
                formFieldInput:
                  "bg-black border border-white/10 text-white focus:border-[#d4a853]/40 focus:ring-0 rounded-xl",
                formFieldLabel: "text-gray-400",
                headerTitle: "text-white font-serif",
                headerSubtitle: "text-gray-400",
                profileSectionTitleText: "text-white",
                profileSectionContent:
                  "bg-transparent border border-white/5 rounded-xl",
                navbarButton:
                  "text-gray-400 hover:text-[#d4a853] hover:bg-white/[0.03]",
                navbarButtonActive: "text-[#d4a853] bg-white/[0.05]",
                footerActionLink: "text-[#d4a853] hover:text-[#e8c97a]",
              },
            }}
          />
        </motion.div>
      </div>
    </main>
  );
}