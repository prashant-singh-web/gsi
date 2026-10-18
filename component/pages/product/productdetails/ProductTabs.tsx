"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Download, HelpCircle, Sparkles } from "lucide-react";
import type { Product } from "@/lib/product/type";

const easeOut = [0.16, 1, 0.3, 1] as const;

const TABS = [
  { key: "specs", label: "Specifications", Icon: FileText },
  { key: "features", label: "Features", Icon: Sparkles },
  { key: "downloads", label: "Downloads", Icon: Download },
  { key: "faq", label: "FAQ", Icon: HelpCircle },
] as const;

export default function ProductTabs({ product }: { product: Product }) {
  const [tab, setTab] = useState<(typeof TABS)[number]["key"]>("specs");

  return (
    <section className="border-t border-border-subtle bg-background-secondary">
      <div className="mx-auto max-w-7xl px-6 py-14 lg:px-8">
        {/* Tab bar */}
        <div className="flex flex-wrap gap-1 border-b border-border">
          {TABS.map(({ key, label, Icon }) => {
            const active = tab === key;
            return (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`relative inline-flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
                  active ? "text-primary" : "text-text-muted hover:text-text-primary"
                }`}
              >
                <Icon size={14} />
                {label}
                {active && (
                  <motion.span
                    layoutId="tab-underline"
                    className="absolute inset-x-0 -bottom-px h-0.5 bg-primary"
                    transition={{ duration: 0.3, ease: easeOut }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Tab body */}
        <div className="mt-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: easeOut }}
            >
              {tab === "specs" && <SpecTable product={product} />}
              {tab === "features" && <FeatureList product={product} />}
              {tab === "downloads" && <Downloads product={product} />}
              {tab === "faq" && <Faq product={product} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

/* ----- Specs ----- */
function SpecTable({ product }: { product: Product }) {
  const rows = Object.entries(product.specs ?? {});
  if (!rows.length)
    return <p className="text-sm text-text-muted">Detailed specifications available on request.</p>;

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface">
      <table className="w-full text-sm">
        <tbody>
          {rows.map(([k, v], i) => (
            <tr
              key={k}
              className={i % 2 === 0 ? "bg-surface" : "bg-background-secondary/50"}
            >
              <td className="w-1/3 px-5 py-3 font-medium text-text-primary">{k}</td>
              <td className="px-5 py-3 text-text-secondary">{v}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ----- Features ----- */
function FeatureList({ product }: { product: Product }) {
  const features = (product.features ?? []).map((f) =>
    f.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
  );
  if (!features.length)
    return <p className="text-sm text-text-muted">Feature list available on request.</p>;

  return (
    <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {features.map((f) => (
        <li
          key={f}
          className="flex items-start gap-3 rounded-lg border border-border bg-surface p-4 text-sm text-text-secondary"
        >
          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            ✓
          </span>
          {f}
        </li>
      ))}
    </ul>
  );
}

/* ----- Downloads ----- */
function Downloads({ product }: { product: Product }) {
  const files = [
    { label: "Technical datasheet (PDF)", href: `/api/datasheet/${product.slug}` },
    { label: "User manual (PDF)", href: `/api/manual/${product.slug}` },
    { label: "Certificate of calibration", href: `/api/calibration/${product.slug}` },
  ];
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {files.map((f) => (
        <a
          key={f.href}
          href={f.href}
          className="flex items-center gap-3 rounded-lg border border-border bg-surface p-4 text-sm text-text-primary transition-colors hover:border-primary"
        >
          <Download size={16} className="text-primary" />
          {f.label}
        </a>
      ))}
    </div>
  );
}

/* ----- FAQ ----- */
function Faq({ product }: { product: Product }) {
  const faqs = [
    {
      q: "What is the typical lead time?",
      a: product.inStock
        ? "In-stock units ship within 3–5 business days. Made-to-order configurations typically ship in 3–4 weeks."
        : "Made-to-order units typically ship within 3–4 weeks depending on configuration.",
    },
    {
      q: "Do you provide installation and training?",
      a: "Yes. On-site installation and operator training are included for all equipment in India, and available internationally on request.",
    },
    {
      q: "What warranty is included?",
      a: "Every unit ships with a 1-year comprehensive warranty covering parts and labour. Extended warranty and annual maintenance contracts are available.",
    },
  ];
  return (
    <div className="space-y-3">
      {faqs.map((f) => (
        <details
          key={f.q}
          className="group rounded-lg border border-border bg-surface p-4 [&_summary::-webkit-details-marker]:hidden"
        >
          <summary className="flex cursor-pointer items-center justify-between text-sm font-medium text-text-primary">
            {f.q}
            <span className="text-text-muted transition-transform group-open:rotate-45">+</span>
          </summary>
          <p className="mt-3 text-sm leading-relaxed text-text-secondary">{f.a}</p>
        </details>
      ))}
    </div>
  );
}