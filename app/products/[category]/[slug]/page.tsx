import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { allProducts } from "@/lib/product/ProductItem";
import ProductDetail from "@/component/pages/product/productdetails/ProductDetails";
import {
  buildProductSeo,
  ProductJsonLd,
  BreadcrumbJsonLd,
} from "@/lib/product/seo/product-details-seo";

type Params = { params: Promise<{ category: string; slug: string }> };

export async function generateStaticParams() {
  return allProducts
    .filter((p) => !p.hidden)
    .map((p) => ({ category: p.category, slug: p.slug }));
}

export async function generateMetadata({
  params,
}: Params): Promise<Metadata> {
  const { category, slug } = await params;

  const product = allProducts.find(
    (p) => p.category === category && p.slug === slug
  );
  if (!product) return {};
  return buildProductSeo(product);
}

export default async function Page({ params }: Params) {
  const { category, slug } = await params;

  const product = allProducts.find(
    (p) => p.category === category && p.slug === slug
  );
  if (!product) notFound();

  return (
    <>
      <ProductJsonLd product={product} />
      <BreadcrumbJsonLd product={product} />
      <ProductDetail product={product} />
    </>
  );
}