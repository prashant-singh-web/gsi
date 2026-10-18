import type { Metadata } from "next";
import type { Product } from "@/lib/product/type";
import Script from "next/script";

const BASE = "https://yourbrand.com";

export function buildProductSeo(p: Product): Metadata {
  const title = `${p.name} — Specs, Price & Quote`;
  const description =
    p.description ||
    `${p.name} from YourBrand. ISO 9001-certified lab equipment with validated cycles, data logging, and full technical support. Request a quote.`;
  const url = `${BASE}/products/${p.category}/${p.slug}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "website",
      images: [{ url: p.image, width: 1200, height: 900, alt: p.name }],
    },
    twitter: { card: "summary_large_image", title, description, images: [p.image] },
  };
}

export function ProductJsonLd({ product }: { product: Product }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: [`${BASE}${product.image}`],
    sku: product.slug,
    brand: { "@type": "Brand", name: "YourBrand" },
    category: product.category,
    offers: {
      "@type": "Offer",
      url: `${BASE}/products/${product.category}/${product.slug}`,
      priceCurrency: "INR",
      price: product.price ?? 0,
      availability: product.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/PreOrder",
      itemCondition: "https://schema.org/NewCondition",
      seller: { "@type": "Organization", name: "YourBrand" },
    },
    additionalProperty: Object.entries(product.specs ?? {}).map(([name, value]) => ({
      "@type": "PropertyValue",
      name,
      value,
    })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function BreadcrumbJsonLd({ product }: { product: Product }) {
  const items = [
    { name: "Home", url: BASE },
    { name: "Products", url: `${BASE}/products` },
    { name: product.category, url: `${BASE}/products/${product.category}` },
    { name: product.name, url: `${BASE}/products/${product.category}/${product.slug}` },
  ];
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: it.url,
    })),
  };
  return (
    <Script
    id="seoper"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}