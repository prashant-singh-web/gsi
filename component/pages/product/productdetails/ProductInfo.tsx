"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ShieldCheck, Package, Clock, MessageSquareQuote, Download,
  Phone, CheckCircle2, Star,
} from "lucide-react";
import type { Product } from "@/lib/product/type";

const easeOut = [0.16, 1, 0.3, 1] as const;

const TRUST = [
  { Icon: ShieldCheck, text: "ISO 9001:2015 certified" },
  { Icon: CheckCircle2, text: "1-year warranty included" },
  { Icon: Phone, text: "Free technical consultation" },
];

export default function ProductInfo({ product }: { product: Product }) {
  const madeToOrder = !product.inStock;

  return (
    <div className="flex flex-col">
      {/* Status + rating */}
      <div className="flex flex-wrap items-center gap-2">
        <span
          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium ${
            madeToOrder
              ? "border-warning/40 bg-warning/10 text-warning"
              : "border-success/40 bg-success/10 text-success"
          }`}
        >
          {madeToOrder ? <Clock size={11} /> : <Package size={11} />}
          {madeToOrder ? "Made to order" : "In stock"}
        </span>
        <span className="inline-flex items-center gap-1 text-[11px] text-text-muted">
          <Star size={11} className="fill-warning text-warning" />
          4.8 · 120+ labs
        </span>
      </div>

      {/* Title */}
      <h1 className="mt-4 text-3xl font-semibold leading-[1.15] tracking-tight text-text-primary sm:text-4xl lg:text-[2.6rem]">
        {product.name}
      </h1>

      {/* Description */}
      <p className="mt-4 max-w-xl text-sm leading-relaxed text-text-secondary sm:text-base">
        {product.description}
      </p>

      {/* Key spec chips */}
      <div className="mt-5 flex flex-wrap gap-2">
        {product.capacityL && (
          <span className="rounded-lg border border-border-subtle bg-background-secondary px-3 py-1.5 text-xs font-medium tabular-nums text-text-secondary">
            {product.capacityL} L chamber
          </span>
        )}
        {product.maxTempC && (
          <span className="rounded-lg border border-border-subtle bg-background-secondary px-3 py-1.5 text-xs font-medium tabular-nums text-text-secondary">
            up to {product.maxTempC} °C
          </span>
        )}
        {product.type?.[0] && (
          <span className="rounded-lg border border-border-subtle bg-background-secondary px-3 py-1.5 text-xs font-medium capitalize text-text-secondary">
            {product.type[0].replace("-", " ")}
          </span>
        )}
      </div>

      {/* Price (if any) */}
      {product.price && (
        <div className="mt-6">
          <p className="text-xs uppercase tracking-wider text-text-muted">Starting at</p>
          <p className="mt-1 text-2xl font-semibold text-text-primary">
            ₹{product.price.toLocaleString("en-IN")}
            <span className="ml-1 text-sm font-normal text-text-muted">/ unit</span>
          </p>
        </div>
      )}

      {/* CTAs */}
      <div className="mt-7 flex flex-col gap-3 sm:flex-row">
        <motion.div whileHover="hover" initial="rest" animate="rest" className="flex-1">
          <Link
            href={`/contact?product=${product.slug}`}
            className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-lg border border-primary bg-primary px-6 py-3.5 text-sm font-medium text-white shadow-glow-button transition-colors hover:bg-primary-hover"
          >
            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
            <MessageSquareQuote size={16} className="relative" />
            <span className="relative">Request a quote</span>
          </Link>
        </motion.div>

        <Link
          href={`/api/datasheet/${product.slug}`}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-surface px-6 py-3.5 text-sm font-medium text-text-primary transition-colors hover:border-primary hover:text-primary"
        >
          <Download size={16} />
          Datasheet
        </Link>
      </div>

      {/* Trust row */}
      <ul className="mt-7 space-y-2.5 border-t border-border-subtle pt-6">
        {TRUST.map(({ Icon, text }) => (
          <li key={text} className="flex items-center gap-2.5 text-sm text-text-secondary">
            <Icon size={15} className="shrink-0 text-primary" />
            {text}
          </li>
        ))}
      </ul>

      {/* Quick contact line */}
      <p className="mt-6 text-xs text-text-muted">
        Need help deciding?{" "}
        <a href="tel:+910000000000" className="font-medium text-primary hover:underline">
          Call +91 00000 00000
        </a>{" "}
        · Mon–Sat, 9am–6pm IST
      </p>
    </div>
  );
}