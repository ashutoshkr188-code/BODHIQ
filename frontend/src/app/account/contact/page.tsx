"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "@clerk/nextjs";
import { Mail, MessageSquare, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function ContactPage() {
  const { user } = useUser();
  const [form, setForm] = useState({
    name: user?.fullName || "",
    email: user?.primaryEmailAddress?.emailAddress || "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.name && form.email && form.message) {
      setSubmitted(true);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white pt-32 px-6 pb-20">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mb-12"
        >
          <Link
            href="/account"
            className="text-xs uppercase tracking-[0.3em] text-gray-500 hover:text-[#d4a853] transition-colors mb-6 inline-block"
          >
            ← Account
          </Link>
          <p className="text-xs uppercase tracking-[0.35em] text-[#d4a853] mb-3">
            Support
          </p>
          <h1 className="text-3xl md:text-5xl font-serif">
            We&apos;re Here to Help
          </h1>
          <p className="text-gray-400 mt-3 max-w-xl">
            Every question deserves thoughtful attention. Share your concern, and
            our team will respond within 24 hours.
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="glass-card rounded-3xl p-10 md:p-14 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-16 h-16 rounded-full border border-green-500/20 bg-green-500/10 flex items-center justify-center text-green-400 mx-auto mb-6"
              >
                <CheckCircle size={28} />
              </motion.div>

              <h2 className="text-2xl font-serif mb-3">Message Received</h2>
              <p className="text-gray-400 text-sm leading-7 max-w-md mx-auto mb-8">
                Thank you for reaching out. A member of our team will review your
                message and respond to{" "}
                <span className="text-white">{form.email}</span> within 24 hours.
              </p>

              <button
                onClick={() => {
                  setSubmitted(false);
                  setForm((prev) => ({ ...prev, message: "" }));
                }}
                className="text-xs uppercase tracking-widest text-[#d4a853] hover:underline underline-offset-4"
              >
                Send Another Message
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, delay: 0.15 }}
            >
              <form
                onSubmit={handleSubmit}
                className="glass-card rounded-3xl p-8 md:p-10 space-y-6"
              >
                {/* Name */}
                <div>
                  <label className="text-xs uppercase tracking-[0.2em] text-gray-400 mb-2 block">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, name: e.target.value }))
                    }
                    placeholder="Full name"
                    required
                    className="w-full bg-transparent border border-white/10 rounded-xl px-5 py-3.5 text-sm outline-none focus:border-[#d4a853]/40 transition placeholder:text-gray-600"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="text-xs uppercase tracking-[0.2em] text-gray-400 mb-2 block">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, email: e.target.value }))
                    }
                    placeholder="your@email.com"
                    required
                    className="w-full bg-transparent border border-white/10 rounded-xl px-5 py-3.5 text-sm outline-none focus:border-[#d4a853]/40 transition placeholder:text-gray-600"
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="text-xs uppercase tracking-[0.2em] text-gray-400 mb-2 block">
                    Message
                  </label>
                  <textarea
                    value={form.message}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, message: e.target.value }))
                    }
                    placeholder="How can we assist you?"
                    required
                    rows={5}
                    className="w-full bg-transparent border border-white/10 rounded-xl px-5 py-3.5 text-sm outline-none focus:border-[#d4a853]/40 transition placeholder:text-gray-600 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto px-8 py-3.5 bg-[#d4a853] text-black rounded-full text-xs uppercase tracking-widest font-medium hover:bg-[#e8c97a] transition duration-300"
                >
                  Send Message
                </button>
              </form>

              {/* Direct Contact */}
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <a
                  href="mailto:bodhiq.official@gmail.com"
                  className="flex items-center gap-3 px-5 py-4 rounded-xl border border-white/5 bg-white/[0.02] hover:border-[#d4a853]/15 transition-colors group"
                >
                  <Mail
                    size={16}
                    className="text-[#d4a853]/60 group-hover:text-[#d4a853]"
                  />
                  <div>
                    <p className="text-xs text-gray-500">Email us directly</p>
                    <p className="text-sm text-gray-300">
                      bodhiq.official@gmail.com
                    </p>
                  </div>
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
