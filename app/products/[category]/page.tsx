import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { allProducts } from "@/lib/product/ProductItem";
import { buildCategorySeo, CategoryJsonLd, BreadcrumbJsonLd } from "@/lib/product/seo/category-seo";
import ProductItems from "@/component/pages/product/ProductItems";
import { ChevronRight } from "lucide-react";

type Params = { params: Promise<{ category: string }> };

/* Only these categories get a page — anything else 404s */
const KNOWN_CATEGORIES = new Set(allProducts.map((p) => p.category));

export async function generateStaticParams() {
  const cats = new Set(
    allProducts.filter((p) => !p.hidden).map((p) => p.category)
  );
  return Array.from(cats).map((category) => ({ category }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { category } = await params;
  if (!KNOWN_CATEGORIES.has(category as any)) return {};
  return buildCategorySeo(category);
}

export default async function Page({ params }: Params) {
  const { category } = await params;

  if (!KNOWN_CATEGORIES.has(category as any)) notFound();

  const products = allProducts.filter(
    (p) => p.category === category && !p.hidden
  );
  if (!products.length) notFound();

  return (
    <>
      <CategoryJsonLd category={category} products={products} />
      <BreadcrumbJsonLd category={category} />

      <main className="bg-background">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="mx-auto flex max-w-7xl items-center gap-1.5 px-6 pt-8 text-xs text-text-muted lg:px-8"
        >
          <Link href="/" className="hover:text-primary">Home</Link>
          <ChevronRight size={12} />
          <Link href="/products" className="hover:text-primary">Products</Link>
          <ChevronRight size={12} />
          <span className="capitalize text-text-secondary">
            {category.replace(/-/g, " ")}
          </span>
        </nav>

        {/* Hero */}
        <section className="mx-auto max-w-7xl px-6 pb-10 pt-8 lg:px-8 lg:pb-14">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">
            Category
          </p>
          <h1 className="mt-3 max-w-3xl text-3xl font-semibold leading-[1.1] tracking-tight text-text-primary sm:text-4xl lg:text-5xl">
            <span className="capitalize">{category.replace(/-/g, " ")}</span>
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-text-secondary sm:text-base">
            Browse our complete range of {category.replace(/-/g, " ")} — precision-engineered
            lab equipment with validated performance, data logging, and ISO 9001 manufacturing.
            Every unit ships with installation support and a 1-year warranty.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3 text-xs text-text-muted">
            <span className="rounded-full border border-border bg-surface px-2.5 py-1">
              {products.length} products
            </span>
            <span className="rounded-full border border-border bg-surface px-2.5 py-1">
              ISO 9001:2015 certified
            </span>
            <span className="rounded-full border border-border bg-surface px-2.5 py-1">
              Free technical consultation
            </span>
          </div>
        </section>

        {/* Product grid */}
        <section className="mx-auto max-w-7xl px-6 pb-20 lg:px-8">
          <ProductItems products={products} />
        </section>

        {/* CTA band */}
        <section className="border-t border-border-subtle bg-background-secondary">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-12 text-center sm:flex-row sm:text-left lg:px-8">
            <div>
              <h2 className="text-lg font-semibold text-text-primary">
                Need help choosing the right {category.replace(/-/g, " ")}?
              </h2>
              <p className="mt-1 text-sm text-text-secondary">
                Our engineering team can recommend a configuration for your lab.
              </p>
            </div>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-lg border border-primary bg-primary px-6 py-3 text-sm font-medium text-white shadow-glow-button transition-colors hover:bg-primary-hover"
            >
              Request a quote
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}