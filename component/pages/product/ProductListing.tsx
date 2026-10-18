"use client";

import { useMemo } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import ProductFilterSidebar from "./ProductFilterSidebar";
import ProductItems from "./ProductItems";
import ActiveFilters from "./ActiveFilters";
import { allProducts } from "@/lib/product/ProductItem";
import { accessorMap } from "@/lib/product/FilterProduct";
import type { Product } from "@/lib/product/type";

function parseParams(sp: URLSearchParams) {
  const selected: Record<string, string[]> = {};
  for (const [k, v] of sp.entries()) {
    (selected[k] ??= []).push(v);
  }
  return selected;
}

function matchesAll(product: Product, selected: Record<string, string[]>) {
  for (const [key, values] of Object.entries(selected)) {
    if (!values.length) continue;
    const accessor = accessorMap[key];
    if (!accessor) continue;
    const raw = accessor(product);
    const arr = Array.isArray(raw) ? raw : raw ? [raw] : [];
    if (!values.some((v) => arr.includes(v))) return false;
  }
  return true;
}

export default function ProductListing({ initialProducts }: { initialProducts?: Product[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const selected = useMemo(() => parseParams(new URLSearchParams(searchParams.toString())), [searchParams]);
  const products = initialProducts ?? allProducts;

  const filtered = useMemo(() => products.filter((p) => !p.hidden && matchesAll(p, selected)), [products, selected]);

  const toggle = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams.toString());
    const current = next.getAll(key);
    next.delete(key);
    const updated = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
    updated.forEach((v) => next.append(key, v));
    router.replace(`${pathname}${next.toString() ? `?${next}` : ""}`, { scroll: false });
  };

  const clearAll = () => router.replace(pathname, { scroll: false });

  return (
    <section className=" bg-background py-16">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-6 lg:grid-cols-[280px_1fr] lg:px-8">
        <ProductFilterSidebar selected={selected} onToggle={toggle} onClearAll={clearAll} />
        <div>
          <ActiveFilters selected={selected} onToggle={toggle} onClearAll={clearAll} />
          <ProductItems products={filtered} />
        </div>
      </div>
    </section>
  );
}