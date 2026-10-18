"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Mail,
  Phone,
  MapPin,
  ArrowUp,
  ArrowRight,
 
  Send,
  CheckCircle2,
} from "lucide-react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { LiaLinkedin } from "react-icons/lia";
import { BsTwitter, BsYoutube } from "react-icons/bs";
import { FaFacebook } from "react-icons/fa";

const easeOut = [0.16, 1, 0.3, 1] as const;

const PRODUCT_LINKS = [
  { label: "Vertical Autoclave", href: "/products/vertical-autoclave" },
  { label: "Orbital Shaking Incubator", href: "/products/orbital-shaking-incubator" },
  { label: "Stability Chamber", href: "/products/stability-chamber" },
  { label: "Vacuum Oven", href: "/products/vacuum-oven" },
  { label: "Laminar Airflow", href: "/products/laminar-airflow" },
  { label: "BOD Incubator", href: "/products/bod-incubator" },
];

const COMPANY_LINKS = [
  { label: "About us", href: "/about" },
  { label: "Our company", href: "/company" },
  { label: "Clients", href: "/clients" },
  { label: "Careers", href: "/careers" },
  { label: "Contact", href: "/contact" },
  { label: "Blog", href: "/blog" },
];

const RESOURCE_LINKS = [
  { label: "Product catalog", href: "/resources/catalog" },
  { label: "Technical specs", href: "/resources/specs" },
  { label: "Installation guides", href: "/resources/installation" },
  { label: "Service & AMC", href: "/resources/service" },
  { label: "Warranty", href: "/resources/warranty" },
  { label: "FAQs", href: "/resources/faqs" },
];

const SOCIALS = [
  { label: "LinkedIn", href: "https://linkedin.com", Icon: LiaLinkedin },
  { label: "Twitter", href: "https://twitter.com", Icon: BsTwitter },
  { label: "Facebook", href: "https://facebook.com", Icon: FaFacebook },
  { label: "YouTube", href: "https://youtube.com", Icon: BsYoutube },
];

/* ------------------------------------------------------------------ */
/* Link column                                                         */
/* ------------------------------------------------------------------ */
function LinkColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-text-muted">
        {title}
      </h3>
      <ul className="mt-5 space-y-3">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="group inline-flex items-center gap-2 text-sm text-text-secondary transition-colors hover:text-primary"
            >
              <span className="relative">
                {link.label}
                <span className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-primary transition-transform duration-300 group-hover:scale-x-100" />
              </span>
              <ArrowRight
                size={12}
                className="-translate-x-1 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
              />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Newsletter                                                          */
/* ------------------------------------------------------------------ */
function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "success">("idle");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus("success");
    setEmail("");
    setTimeout(() => setStatus("idle"), 3000);
  };

  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-text-muted">
        Stay in the loop
      </h3>
      <p className="mt-4 text-sm text-text-secondary">
        Product launches, technical notes, and service updates — twice a month.
      </p>

      <form onSubmit={onSubmit} className="mt-5">
        <div className="group relative flex items-center overflow-hidden rounded-xl border border-border bg-surface transition-colors focus-within:border-primary">
          <Mail size={15} className="ml-4 shrink-0 text-text-muted" />
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@lab.com"
            className="w-full bg-transparent px-3 py-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none"
          />
          <button
            type="submit"
            aria-label="Subscribe"
            className="mr-1.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-white transition-colors hover:bg-primary-hover active:scale-95"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={status}
                initial={{ scale: 0.5, opacity: 0, rotate: -45 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                exit={{ scale: 0.5, opacity: 0, rotate: 45 }}
                transition={{ duration: 0.25, ease: easeOut }}
                className="flex"
              >
                {status === "success" ? <CheckCircle2 size={15} /> : <Send size={14} />}
              </motion.span>
            </AnimatePresence>
          </button>
        </div>

        <AnimatePresence>
          {status === "success" && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-3 text-xs text-success"
            >
              Thanks — check your inbox to confirm.
            </motion.p>
          )}
        </AnimatePresence>
      </form>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Scroll-to-top                                                       */
/* ------------------------------------------------------------------ */
function ScrollToTop() {
  const [show, setShow] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (v) => setShow(v > 600));

  return (
    <AnimatePresence>
      {show && (
        <motion.button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          initial={{ opacity: 0, y: 20, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.8 }}
          transition={{ duration: 0.3, ease: easeOut }}
          aria-label="Scroll to top"
          className="group fixed bottom-6 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full border border-border bg-surface shadow-card-elevated transition-colors hover:border-primary hover:shadow-glow-md"
        >
          <ArrowUp
            size={18}
            className="text-text-secondary transition-all group-hover:-translate-y-0.5 group-hover:text-primary"
          />
        </motion.button>
      )}
    </AnimatePresence>
  );
}

/* ------------------------------------------------------------------ */
/* Footer                                                              */
/* ------------------------------------------------------------------ */
export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <>
      <footer className="relative overflow-hidden border-t border-border bg-background">
        {/* Ambient wash */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-primary/[0.04] to-transparent" />

        {/* Faint grid */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
            backgroundSize: "72px 72px",
            color: "var(--color-text-primary)",
            maskImage:
              "radial-gradient(ellipse at 50% 0%, black 20%, transparent 70%)",
            WebkitMaskImage:
              "radial-gradient(ellipse at 50% 0%, black 20%, transparent 70%)",
          }}
        />

        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          {/* Top: brand + newsletter */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, ease: easeOut }}
            className="grid grid-cols-1 gap-12 border-b border-border py-16 lg:grid-cols-12 lg:gap-16 lg:py-20"
          >
            {/* Brand */}
            <div className="lg:col-span-5">
              <Link href="/" className="group inline-flex items-center gap-2.5">
                <span className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary-dark shadow-glow-button">
                  <span className="text-sm font-bold text-white">G</span>
                  <motion.span
                    className="absolute inset-0 -z-10 rounded-lg bg-primary"
                    animate={{ opacity: [0.5, 0, 0.5], scale: [1, 1.6, 1] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  />
                </span>
                <span className="text-lg font-semibold tracking-tight text-text-primary">
                  GSI
                </span>
              </Link>

              <p className="mt-6 max-w-md text-sm leading-relaxed text-text-secondary">
                Precision laboratory equipment engineered for continuous use —
                autoclaves, incubators, stability chambers, and airflow systems
                built to hold tolerance, backed by our own service network.
              </p>

              {/* Contact block */}
              <ul className="mt-8 space-y-3.5">
                <li>
                  <a
                    href="mailto:hello@gsi-labs.com"
                    className="group flex items-start gap-3 text-sm text-text-secondary transition-colors hover:text-primary"
                  >
                    <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-border bg-surface transition-colors group-hover:border-primary/40">
                      <Mail size={13} className="text-text-muted transition-colors group-hover:text-primary" />
                    </span>
                    hello@gsi-labs.com
                  </a>
                </li>
                <li>
                  <a
                    href="tel:+10000000000"
                    className="group flex items-start gap-3 text-sm text-text-secondary transition-colors hover:text-primary"
                  >
                    <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-border bg-surface transition-colors group-hover:border-primary/40">
                      <Phone size={13} className="text-text-muted transition-colors group-hover:text-primary" />
                    </span>
                    +1 (000) 000-0000
                  </a>
                </li>
                <li>
                  <div className="flex items-start gap-3 text-sm text-text-secondary">
                    <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-border bg-surface">
                      <MapPin size={13} className="text-text-muted" />
                    </span>
                    <span>
                      142 Industrial Park, Sector 7
                      <br />
                      Bengaluru, KA 560100, India
                    </span>
                  </div>
                </li>
              </ul>

              {/* Socials */}
              <div className="mt-8 flex items-center gap-2">
                {SOCIALS.map(({ label, href, Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="group flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-surface transition-all duration-300 hover:-translate-y-0.5 hover:border-primary hover:shadow-glow-sm"
                  >
                    <Icon
                      size={15}
                      className="text-text-muted transition-colors group-hover:text-primary"
                    />
                  </a>
                ))}
              </div>
            </div>

            {/* Newsletter */}
            <div className="lg:col-span-3">
              <Newsletter />
            </div>

            {/* Certifications */}
            <div className="lg:col-span-4">
              <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-text-muted">
                Certified & compliant
              </h3>
              <div className="mt-5 grid grid-cols-2 gap-3">
                {[
                  { k: "ISO 9001:2015", s: "Quality management" },
                  { k: "CE Marked", s: "European conformity" },
                  { k: "EN 13060", s: "Sterilizer standard" },
                  { k: "ICH Q1A", s: "Stability testing" },
                ].map((c) => (
                  <div
                    key={c.k}
                    className="rounded-xl border border-border bg-surface p-3.5 transition-colors hover:border-primary/30"
                  >
                    <p className="text-xs font-semibold text-text-primary">
                      {c.k}
                    </p>
                    <p className="mt-0.5 text-[11px] text-text-muted">
                      {c.s}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Middle: link columns */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, delay: 0.1, ease: easeOut }}
            className="grid grid-cols-2 gap-10 border-b border-border py-16 sm:grid-cols-3 lg:grid-cols-4 lg:gap-8"
          >
            <LinkColumn title="Products" links={PRODUCT_LINKS} />
            <LinkColumn title="Company" links={COMPANY_LINKS} />
            <LinkColumn title="Resources" links={RESOURCE_LINKS} />
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-text-muted">
                Support
              </h3>
              <ul className="mt-5 space-y-3">
                <li className="text-sm text-text-secondary">
                  Mon–Sat · 9:00–18:00 IST
                </li>
                <li className="text-sm text-text-secondary">
                  24h emergency line
                </li>
                <li>
                  <Link
                    href="/support"
                    className="group inline-flex items-center gap-2 text-sm text-primary transition-colors hover:text-primary-hover"
                  >
                    Book a service
                    <ArrowRight
                      size={12}
                      className="transition-transform group-hover:translate-x-0.5"
                    />
                  </Link>
                </li>
              </ul>
            </div>
          </motion.div>

          {/* Bottom bar */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15, ease: easeOut }}
            className="flex flex-col items-start justify-between gap-4 py-8 sm:flex-row sm:items-center"
          >
            <p className="text-xs text-text-muted">
              © {year} GSI Labs Pvt. Ltd. All rights reserved.
            </p>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
              {[
                { label: "Privacy", href: "/privacy" },
                { label: "Terms", href: "/terms" },
                { label: "Cookies", href: "/cookies" },
                { label: "Sitemap", href: "/sitemap" },
              ].map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="text-xs text-text-muted transition-colors hover:text-primary"
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Giant watermark wordmark */}
        <div className="pointer-events-none relative overflow-hidden">
          <motion.p
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: easeOut }}
            className="select-none whitespace-nowrap text-center text-[18vw] font-bold leading-none tracking-tighter text-text-primary/[0.035] lg:text-[14vw]"
          >
            GSI LABS
          </motion.p>
        </div>
      </footer>

      <ScrollToTop />
    </>
  );
}