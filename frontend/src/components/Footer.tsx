"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Instagram, Mail, Youtube, Facebook } from "lucide-react";
import { useState } from "react";
import BackToTop from "@/components/ui/BackToTop";

interface FooterLink {
  label?: string;
  title?: string;
  href: string;
}

interface SocialLink {
  platform: string;
  url: string;
}

interface FooterData {
  newsletterText?: string;
  newsletterPlaceholder?: string;
  newsletterButtonText?: string;
  companyLinks?: FooterLink[];
  quickLinks?: FooterLink[];
  contactEmailPrimary?: string;
  contactEmailSecondary?: string;
  socialLinks?: SocialLink[];
  copyrightText?: string;
  bottomTagline?: string;
}

interface FooterSiteSettings {
  contactEmail?: string;
  footerText?: string;
}

// Fallbacks
const defaultCompanyLinks = [
  { label: "About Us", href: "/about" },
  { label: "Our Values", href: "/values" },
  { label: "Privacy Notice", href: "/privacy" },
  { label: "Terms & Conditions", href: "/terms" },
  { label: "Disclaimer", href: "/disclaimer" },
  { label: "Corporate Information", href: "/corporate" },
  { label: "Media Outreach", href: "/media" },
  { label: "Distributor Queries", href: "/distributor" },
  { label: "Grievance Redressal", href: "/grievance" },
];

const defaultQuickLinks = [
  { label: "Knowledge", href: "/knowledge" },
  { label: "FAQs", href: "/faqs" },
  { label: "Shipping Policy", href: "/shipping-policy" },
  { label: "Return & Refund Policy", href: "/return-policy" },
  { label: "Payment Policy", href: "/payment-policy" },
  { label: "Track Order", href: "/track-order" },
  { label: "Download App", href: "/download-app" },
];

const defaultSocialLinks = [
  {
    platform: "Email",
    url: "mailto:bodhiq.official@gmail.com",
  },
  {
    platform: "Instagram",
    url: "https://instagram.com/bodhiq.in",
  },
  { platform: "Facebook", url: "#" },
  { platform: "YouTube", url: "#" },
];

const getIcon = (platform: string) => {
  const p = platform.toLowerCase();
  if (p.includes("instagram")) return Instagram;
  if (p.includes("facebook")) return Facebook;
  if (p.includes("youtube")) return Youtube;
  return Mail;
};

export default function Footer({ data, settings }: { data?: FooterData; settings?: FooterSiteSettings }) {
  // Map dynamic fields
  const newsletterText = data?.newsletterText || "Be the first to know about new collections, exclusive releases, and the philosophy behind each piece.";
  const newsletterPlaceholder = data?.newsletterPlaceholder || "Your email address";
  const newsletterButtonText = data?.newsletterButtonText || "Subscribe";
  
  const companyLinks = data?.companyLinks && data.companyLinks.length > 0 
    ? data.companyLinks.map((l: FooterLink) => ({ label: l.title || l.label, href: l.href }))
    : defaultCompanyLinks;

  const quickLinks = data?.quickLinks && data.quickLinks.length > 0
    ? data.quickLinks.map((l: FooterLink) => ({ label: l.title || l.label, href: l.href }))
    : defaultQuickLinks;

  const primaryEmail = data?.contactEmailPrimary || settings?.contactEmail || "bodhiq.official@gmail.com";
  const secondaryEmail = data?.contactEmailSecondary; // Can be empty

  const socialLinks = data?.socialLinks && data.socialLinks.length > 0
    ? data.socialLinks
    : defaultSocialLinks;

  const copyrightText = data?.copyrightText || `© ${new Date().getFullYear()} BODHIQ. All rights reserved.`;
  const bottomTagline = data?.bottomTagline || settings?.footerText || "Timeless Craftsmanship";
  
  const [emailInput, setEmailInput] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput.trim()) {
      setSubscribed(true);
      setEmailInput("");
    }
  };

  return (
    <>
      <footer className="bg-[#0a0a0a] text-white px-6 pt-20 pb-10 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          {/* Newsletter Section */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="text-center mb-16 pb-16 border-b border-white/5"
          >
            <p className="text-xs uppercase tracking-[0.35em] text-[#d4a853] mb-3">
              Stay Connected
            </p>
            <h3 className="text-2xl md:text-3xl font-serif mb-3">
              Join the BODHIQ World
            </h3>
            <p className="text-gray-500 text-sm mb-8 max-w-md mx-auto">
              {newsletterText}
            </p>

            {subscribed ? (
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-[#d4a853] text-sm"
              >
                Thank you for subscribing.
              </motion.p>
            ) : (
              <form
                onSubmit={handleNewsletterSubmit}
                className="flex flex-col sm:flex-row items-center gap-3 max-w-md mx-auto"
              >
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder={newsletterPlaceholder}
                  required
                  className="w-full bg-transparent border border-white/10 rounded-full px-5 py-3 text-sm outline-none focus:border-[#d4a853]/40 transition placeholder:text-gray-600"
                />
                <button
                  type="submit"
                  className="w-full sm:w-auto whitespace-nowrap px-6 py-3 border border-[#d4a853] text-[#d4a853] rounded-full text-xs uppercase tracking-widest hover:bg-[#d4a853] hover:text-black transition duration-300"
                >
                  {newsletterButtonText}
                </button>
              </form>
            )}
          </motion.div>

          {/* Links Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16">
            {/* Company Overview */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              <h3 className="text-sm font-medium tracking-wider uppercase mb-6 text-white/80">
                Company Overview
              </h3>
              <ul className="space-y-3">
                {companyLinks.map((link: FooterLink) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-gray-400 text-sm hover:text-[#d4a853] transition-colors duration-300"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Quick Links */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
            >
              <h3 className="text-sm font-medium tracking-wider uppercase mb-6 text-white/80">
                Quick Links
              </h3>
              <ul className="space-y-3">
                {quickLinks.map((link: FooterLink) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-gray-400 text-sm hover:text-[#d4a853] transition-colors duration-300"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Contact */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
            >
              <h3 className="text-sm font-medium tracking-wider uppercase mb-6 text-white/80">
                Contact Us
              </h3>

              <div className="space-y-6 text-sm text-gray-400">
                <p className="leading-7">
                  Need help fast? Email us at{" "}
                  <a
                    href={`mailto:${primaryEmail}`}
                    className="underline underline-offset-4 hover:text-[#d4a853] transition-colors duration-300"
                  >
                    {primaryEmail}
                  </a>
                </p>

                {secondaryEmail && (
                  <p className="leading-7">
                    For brand and gifting inquiries, write to us at{" "}
                    <a
                      href={`mailto:${secondaryEmail}`}
                      className="underline underline-offset-4 hover:text-[#d4a853] transition-colors duration-300"
                    >
                      {secondaryEmail}
                    </a>
                  </p>
                )}

                <div className="flex items-center gap-5">
                  {socialLinks.map((social: SocialLink) => {
                    const Icon = getIcon(social.platform);
                    const isExternal = social.url && !social.url.startsWith("mailto:");
                    return (
                      <a
                        key={social.platform}
                        href={social.url}
                        target={isExternal ? "_blank" : undefined}
                        rel={isExternal ? "noreferrer" : undefined}
                        className="text-white/60 hover:text-[#d4a853] transition-colors duration-300"
                        aria-label={social.platform}
                      >
                        <Icon size={18} />
                      </a>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-16 pt-6 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-600">
            <p>{copyrightText}</p>
            <p className="tracking-[0.25em] uppercase">
              {bottomTagline}
            </p>
          </div>
        </div>
      </footer>

      <BackToTop />
    </>
  );
}