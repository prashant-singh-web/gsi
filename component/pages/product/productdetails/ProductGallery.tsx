"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ZoomIn } from "lucide-react";
import type { Product } from "@/lib/product/type";

const easeOut = [0.16, 1, 0.3, 1] as const;

export default function ProductGallery({ product }: { product: Product }) {
  const images = [product.image, ...(product.gallery ?? [])];
  const [active, setActive] = useState(0);
  const [zoomed, setZoomed] = useState(false);

  return (
    <div className="flex flex-col gap-3">
      {/* Main image */}
      <div className="group relative aspect-square overflow-hidden rounded-2xl border border-border bg-surface shadow-card">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.35, ease: easeOut }}
            className="absolute inset-0"
          >
            <Image
              src={images[active]}
              alt={product.name}
              fill
              priority
              sizes="(max-width: 1024px) 92vw, 45vw"
              className={`object-cover transition-transform duration-700 ${
                zoomed ? "scale-150 cursor-zoom-out" : "cursor-zoom-in"
              }`}
              onClick={() => setZoomed((z) => !z)}
            />
          </motion.div>
        </AnimatePresence>

        <button
          onClick={() => setZoomed((z) => !z)}
          aria-label="Zoom image"
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full border border-white/25 bg-black/45 text-white opacity-0 backdrop-blur-md transition-opacity group-hover:opacity-100"
        >
          <ZoomIn size={15} />
        </button>
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="grid grid-cols-5 gap-2">
          {images.map((img, i) => (
            <button
              key={img + i}
              onClick={() => setActive(i)}
              className={`relative aspect-square overflow-hidden rounded-lg border-2 transition-all ${
                i === active
                  ? "border-primary shadow-glow-sm"
                  : "border-border hover:border-primary/40"
              }`}
            >
              <Image src={img} alt={`${product.name} view ${i + 1}`} fill sizes="15vw" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}