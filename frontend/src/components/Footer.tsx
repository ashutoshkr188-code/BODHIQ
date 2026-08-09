"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Instagram, Mail, Youtube, Facebook } from "lucide-react";
import { useState } from "react";
import { usePathname } from "next/navigation";
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
  newsletterEyebrow?: string | null;
  newsletterTitle?: string | null;
  newsletterText?: string | null;
  newsletterPlaceholder?: string | null;
  newsletterButtonText?: string | null;
  companySectionLabel?: string | null;
  quickLinksSectionLabel?: string | null;
  contactSectionLabel?: string | null;
  companyLinks?: FooterLink[];
  quickLinks?: FooterLink[];
  contactEmailPrimary?: string | null;
  contactEmailSecondary?: string | null;
  helpText?: string | null;
  giftingText?: string | null;
  socialLinks?: SocialLink[];
  copyrightText?: string | null;
  bottomTagline?: string | null;
  visibility?: Record<string, boolean>;
}


interface FooterSiteSettings {
  contactEmail?: string;
}

const getIcon = (platform: string) => {
  const p = platform.toLowerCase();
  if (p.includes("instagram")) return Instagram;
  if (p.includes("facebook")) return Facebook;
  if (p.includes("youtube")) return Youtube;
  return Mail;
};

export default function Footer({ data, settings }: { data?: FooterData; settings?: FooterSiteSettings }) {
  const pathname = usePathname();
  if (pathname?.startsWith("/dashboard")) return null;

  const v = data?.visibility ?? {};
  const newsletterEyebrow = v.newsletter_eyebrow !== false ? (data?.newsletterEyebrow ?? null) : null;
  const newsletterTitle = v.newsletter_title !== false ? (data?.newsletterTitle ?? null) : null;
  const newsletterText = v.newsletter_text !== false ? (data?.newsletterText ?? null) : null;
  const newsletterPlaceholder = v.newsletter_placeholder !== false ? (data?.newsletterPlaceholder ?? "Your email address") : "Your email address";
  const newsletterButtonText = v.newsletter_button_text !== false ? (data?.newsletterButtonText ?? "Subscribe") : "Subscribe";


  const companySectionLabel = v.company_section_label !== false ? (data?.companySectionLabel ?? null) : null;
  const quickLinksSectionLabel = v.quick_links_section_label !== false ? (data?.quickLinksSectionLabel ?? null) : null;
  const contactSectionLabel = v.contact_section_label !== false ? (data?.contactSectionLabel ?? null) : null;


  const companyLinks = data?.companyLinks && data.companyLinks.length > 0
    ? data.companyLinks.map((l: FooterLink) => ({ label: l.title || l.label, href: l.href }))
    : [];

  const quickLinks = data?.quickLinks && data.quickLinks.length > 0
    ? data.quickLinks.map((l: FooterLink) => ({ label: l.title || l.label, href: l.href }))
    : [];

  const primaryEmail = v.contact_email_primary !== false ? (data?.contactEmailPrimary || settings?.contactEmail || null) : null;
  const secondaryEmail = v.contact_email_secondary !== false ? (data?.contactEmailSecondary || null) : null;

  const helpText = v.help_text !== false ? (data?.helpText ?? null) : null;
  const giftingText = v.gifting_text !== false ? (data?.giftingText ?? null) : null;


  const socialLinks = data?.socialLinks && data.socialLinks.length > 0
    ? data.socialLinks
    : [];

  const copyrightText = v.copyright_text !== false ? (data?.copyrightText ?? null) : null;
  const bottomTagline = v.bottom_tagline !== false ? (data?.bottomTagline ?? null) : null;


  const [emailInput, setEmailInput] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput.trim()) {
      setSubscribed(true);
      setEmailInput("");
    }
  };

  const hasNewsletterSection = newsletterTitle || newsletterText || newsletterEyebrow;
  const hasLinksSection = companyLinks.length > 0 || quickLinks.length > 0 || primaryEmail;
  const hasBottomBar = copyrightText || bottomTagline;

  return (
    <>
      <footer className="bg-[#0a0a0a] text-white px-6 pt-20 pb-10 border-t border-white/5">
        <div className="max-w-7xl mx-auto">

          {/* Newsletter Section */}
          {hasNewsletterSection && (
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="text-center mb-16 pb-16 border-b border-white/5"
            >
              {newsletterEyebrow && (
                <p className="text-xs uppercase tracking-[0.35em] text-[#d4a853] mb-3">
                  {newsletterEyebrow}
                </p>
              )}
              {newsletterTitle && (
                <h3 className="text-2xl md:text-3xl font-serif mb-3">
                  {newsletterTitle}
                </h3>
              )}
              {newsletterText && (
                <p className="text-gray-500 text-sm mb-8 max-w-md mx-auto">
                  {newsletterText}
                </p>
              )}

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
          )}

          {/* Links Grid */}
          {hasLinksSection && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16">
              {/* Company Links */}
              {companyLinks.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.7, ease: "easeOut" }}
                >
                  {companySectionLabel && (
                    <h3 className="text-sm font-medium tracking-wider uppercase mb-6 text-white/80">
                      {companySectionLabel}
                    </h3>
                  )}
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
              )}

              {/* Quick Links */}
              {quickLinks.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
                >
                  {quickLinksSectionLabel && (
                    <h3 className="text-sm font-medium tracking-wider uppercase mb-6 text-white/80">
                      {quickLinksSectionLabel}
                    </h3>
                  )}
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
              )}

              {/* Contact */}
              {(primaryEmail || socialLinks.length > 0) && (
                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
                >
                  {contactSectionLabel && (
                    <h3 className="text-sm font-medium tracking-wider uppercase mb-6 text-white/80">
                      {contactSectionLabel}
                    </h3>
                  )}

                  <div className="space-y-6 text-sm text-gray-400">
                    {primaryEmail && (
                      <p className="leading-7">
                        {helpText ? <>{helpText}{" "}</> : null}
                        <a
                          href={`mailto:${primaryEmail}`}
                          className="underline underline-offset-4 hover:text-[#d4a853] transition-colors duration-300"
                        >
                          {primaryEmail}
                        </a>
                      </p>
                    )}

                    {secondaryEmail && (
                      <p className="leading-7">
                        {giftingText ? <>{giftingText}{" "}</> : null}
                        <a
                          href={`mailto:${secondaryEmail}`}
                          className="underline underline-offset-4 hover:text-[#d4a853] transition-colors duration-300"
                        >
                          {secondaryEmail}
                        </a>
                      </p>
                    )}

                    {socialLinks.length > 0 && (
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
                    )}
                  </div>
                </motion.div>
              )}
            </div>
          )}

          {/* Bottom Bar */}
          {hasBottomBar && (
            <div className="mt-16 pt-6 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-600">
              {copyrightText && <p>{copyrightText}</p>}
              {bottomTagline && (
                <p className="tracking-[0.25em] uppercase">{bottomTagline}</p>
              )}
            </div>
          )}
        </div>
      </footer>

      <BackToTop />
    </>
  );
}