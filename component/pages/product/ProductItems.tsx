"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, MessageSquareQuote, Package, Clock } from "lucide-react";
import type { Product } from "@/lib/product/type";

const easeOut = [0.16, 1, 0.3, 1] as const;

export default function ProductItems({ products }: { products: Product[] }) {
  /* ---------------------------- Empty state ---------------------------- */
  if (!products.length) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: easeOut }}
        className="flex flex-col items-center justify-center rounded-2xl border border-border bg-surface px-8 py-16 text-center shadow-card"
      >
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1, ease: easeOut }}
          className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary"
        >
          <Package size={22} />
        </motion.div>
        <p className="text-base font-medium text-text-primary">
          No products match those filters.
        </p>
        <p className="mt-1.5 max-w-sm text-sm text-text-muted">
          Try removing a filter or clearing all to see the full range.
        </p>
      </motion.div>
    );
  }

  /* ------------------------------ Grid ------------------------------ */
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {products.map((p, i) => {
        const madeToOrder = !p.inStock;
        return (
          <motion.article
            key={p.slug}
            initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{
              duration: 0.6,
              delay: Math.min(i * 0.05, 0.4),
              ease: easeOut,
            }}
            className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-card transition-all duration-500 hover:-translate-y-1.5 hover:border-primary/40 hover:shadow-card-elevated"
          >
            {/* ----------------------------- Image ----------------------------- */}
            <Link
              href={`/product/${p.category}/${p.slug}`}
              className="relative block aspect-[4/3] overflow-hidden bg-background-secondary"
            >
              <Image
                src={p.image}
                alt={p.name}
                fill
                sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 32vw"
                className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.06]"
              />

              {/* Bottom gradient for legibility */}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/55 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

              {/* Stock badge — semantic for "made to order", fixed for "in stock" */}
              <span
                className={`absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-medium backdrop-blur-md ${
                  madeToOrder
                    ? "border-warning/40 bg-warning/20 text-warning"
                    : "border-white/25 bg-black/45 text-white"
                }`}
              >
                {madeToOrder ? <Clock size={10} /> : <Package size={10} />}
                {madeToOrder ? "Made to order" : "In stock"}
              </span>

              {/* Quick quote icon (reveals on hover, top-right) */}
              <span className="pointer-events-none absolute right-3 top-3 flex h-8 w-8 translate-y-1 items-center justify-center rounded-full border border-white/25 bg-black/45 text-white opacity-0 backdrop-blur-md transition-all duration-400 group-hover:translate-y-0 group-hover:opacity-100">
                <ArrowUpRight size={13} />
              </span>
            </Link>

            {/* ----------------------------- Body ----------------------------- */}
            <div className="flex flex-1 flex-col p-5">
              {/* Category eyebrow */}
              <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-primary">
                {p.category.replace("-", " ")}
              </p>

              {/* Title */}
              <h3 className="mt-1.5 line-clamp-2 text-base font-semibold leading-snug tracking-tight text-text-primary lg:text-[17px]">
                <Link
                  href={`/products/${p.category}/${p.slug}`}
                  className="transition-colors hover:text-primary"
                >
                  {p.name}
                </Link>
              </h3>

              {/* Description */}
              <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-text-muted">
                {p.description}
              </p>

              {/* Spec strip */}
              {(p.capacityL || p.maxTempC) && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {p.capacityL && (
                    <span className="inline-flex items-center rounded-md border border-border-subtle bg-background-secondary px-2 py-0.5 text-[10px] font-medium tabular-nums text-text-secondary">
                      {p.capacityL} L
                    </span>
                  )}
                  {p.maxTempC && (
                    <span className="inline-flex items-center rounded-md border border-border-subtle bg-background-secondary px-2 py-0.5 text-[10px] font-medium tabular-nums text-text-secondary">
                      {p.maxTempC} °C
                    </span>
                  )}
                  {p.type?.[0] && (
                    <span className="inline-flex items-center rounded-md border border-border-subtle bg-background-secondary px-2 py-0.5 text-[10px] font-medium capitalize text-text-secondary">
                      {p.type[0].replace("-", " ")}
                    </span>
                  )}
                </div>
              )}

              {/* ---------------------------- CTAs ---------------------------- */}
              <div className="mt-auto grid grid-cols-2 gap-2 pt-5">
                {/* View details — primary-ish outline */}
                <Link
                  href={`/products/${p.category}/${p.slug}`}
                  className="group/btn relative inline-flex items-center justify-center gap-1.5 overflow-hidden rounded-md border border-border bg-surface px-3 py-2.5 text-xs font-medium text-text-primary transition-all duration-300 hover:border-primary hover:text-primary active:scale-[0.98]"
                >
                  <span className="relative">View details</span>
                  <ArrowUpRight
                    size={13}
                    className="relative transition-transform duration-300 group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5"
                  />
                </Link>

                {/* Get a quote — filled primary */}
                <Link
                  href={`/contact?product=${p.slug}`}
                  className="group/btn2 relative inline-flex items-center justify-center gap-1.5 overflow-hidden rounded-md border border-primary bg-primary px-3 py-2.5 text-xs font-medium text-white shadow-glow-button transition-all duration-300 hover:bg-primary-hover active:scale-[0.98]"
                >
                  {/* sheen sweep on hover */}
                  <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover/btn2:translate-x-full" />
                  <MessageSquareQuote size={13} className="relative" />
                  <span className="relative">Get quote</span>
                </Link>
              </div>
            </div>
          </motion.article>
        );
      })}
    </div>
  );
}