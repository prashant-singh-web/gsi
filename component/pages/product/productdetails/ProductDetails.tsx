"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import ProductGallery from "./ProductGallery";
import ProductInfo from "./ProductInfo";
import ProductTabs from "./ProductTabs";
import RelatedProducts from "./RelatedProduct";
import type { Product } from "@/lib/product/type";

const easeOut = [0.16, 1, 0.3, 1] as const;

export default function ProductDetail({ product }: { product: Product }) {
  return (
    <main className="bg-background mt-20 ">
      {/* Breadcrumb */}
      <div
        aria-label="Breadcrumb"
        className="mx-auto flex max-w-7xl items-center gap-1.5 px-6 pt-8 text-xs text-text-muted lg:px-8"
      >
        <Link href="/" className="hover:text-primary">Home</Link>
        <ChevronRight size={12} />
        <Link href="/products" className="hover:text-primary">Products</Link>
        <ChevronRight size={12} />
        <Link href={`/products/${product.category}`} className="capitalize hover:text-primary">
          {product.category.replace("-", " ")}
        </Link>
        <ChevronRight size={12} />
        <span className="truncate text-text-secondary">{product.name}</span>
      </div>

      {/* Hero: gallery + info */}
      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 py-10 lg:grid-cols-2 lg:gap-14 lg:px-8 lg:py-14">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: easeOut }}
        >
          <ProductGallery product={product} />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: easeOut }}
        >
          <ProductInfo product={product} />
        </motion.div>
      </section>

      {/* Tabs: specs / features / downloads / faq */}
      <ProductTabs product={product} />

      {/* Related */}
      {product.related?.length ? <RelatedProducts product={product} /> : null}
    </main>
  );
};

