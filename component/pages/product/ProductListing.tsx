import { Suspense } from "react";
import ProductListingInner from "./ProductListingInner";
import type { Product } from "@/lib/product/type";

export default function ProductListing({
  initialProducts,
}: {
  initialProducts?: Product[];
}) {
  return (
    <Suspense fallback={<ProductListingSkeleton />}>
      <ProductListingInner initialProducts={initialProducts} />
    </Suspense>
  );
}

function ProductListingSkeleton() {
  return (
    <section className="bg-background py-16">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-6 lg:grid-cols-[280px_1fr] lg:px-8">
        <div className="h-64 animate-pulse rounded-lg bg-surface" />
        <div className="h-96 animate-pulse rounded-lg bg-surface" />
      </div>
    </section>
  );
}