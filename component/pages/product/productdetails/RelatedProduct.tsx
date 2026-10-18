import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { allProducts } from "@/lib/product/ProductItem";
import type { Product } from "@/lib/product/type";

export default function RelatedProducts({ product }: { product: Product }) {
  const related =
    product.related
      ?.map((slug) => allProducts.find((p) => p.slug === slug))
      .filter(Boolean) ?? [];

  if (!related.length) return null;

  return (
    <section className="border-t border-border-subtle bg-background py-14">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">Related</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-text-primary">
              You might also need
            </h2>
          </div>
          <Link
            href={`/products/${product.category}`}
            className="hidden items-center gap-1 text-sm font-medium text-primary hover:underline sm:inline-flex"
          >
            View all <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {related.map((p) => (
            <Link
              key={p!.slug}
              href={`/products/${p!.category}/${p!.slug}`}
              className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-card transition-all duration-500 hover:-translate-y-1 hover:border-primary/40 hover:shadow-card-elevated"
            >
              <div className="relative aspect-[4/3] bg-background-secondary overflow-hidden">
                <Image
                  src={p!.image}
                  alt={p!.name}
                  fill
                  sizes="(max-width: 640px) 92vw, 32vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="p-4">
                <h3 className="text-sm font-medium text-text-primary group-hover:text-primary">
                  {p!.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}