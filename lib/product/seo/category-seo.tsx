import type { Metadata } from "next";
import type { Product } from "@/lib/product/type";

const BASE = "https://yourbrand.com";

const CATEGORY_COPY: Record<string, { title: string; description: string }> = {
  autoclave: {
    title: "Autoclaves — Vertical, Horizontal & Portable Steam Sterilizers",
    description:
      "Browse ISO 9001-certified autoclaves: vertical, horizontal, portable, jacketed, and data-logger models for validated sterilization in labs, clinics, and pharma.",
  },
  incubator: {
    title: "Incubators — BOD, Bacteriological & Memmert Type",
    description:
      "BOD incubators, bacteriological incubators, memmert-type, double decker, and data-logger models with precision temperature control.",
  },
  oven: {
    title: "Hot Air Ovens — Lab, BOD & GMP Models",
    description:
      "Laboratory hot air ovens with digital and thermostat control, including BOD, memmert-type, and GMP models.",
  },
  "cod-digester": {
    title: "COD Digesters — Block Digesters & Accessories",
    description:
      "COD digesters, condenser tubes, and tube stands for reliable COD analysis.",
  },
  "deep-freezer": {
    title: "Deep Freezers & Ultra Low Freezers",
    description:
      "Lab deep freezers and ultra-low temperature freezers for sample storage.",
  },
  "colony-counter": {
    title: "Colony Counters — Digital & Manual",
    description: "Digital and manual colony counters for microbiological enumeration.",
  },
  "curing-tank": {
    title: "Curing Tanks — Concrete & Sample Curing",
    description: "Curing tanks for construction testing and material sample conditioning.",
  },
  accessories: {
    title: "Lab Equipment Accessories",
    description: "SS baskets, trays, stands, and accessories for your lab equipment.",
  },
};

export function buildCategorySeo(category: string): Metadata {
  const copy = CATEGORY_COPY[category] ?? {
    title: `${category.replace(/-/g, " ")} — YourBrand`,
    description: `Browse our ${category.replace(/-/g, " ")} range from YourBrand. ISO 9001-certified laboratory equipment.`,
  };
  const url = `${BASE}/products/${category}`;
  return {
    title: copy.title,
    description: copy.description,
    alternates: { canonical: url },
    openGraph: {
      title: copy.title,
      description: copy.description,
      url,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: copy.title,
      description: copy.description,
    },
  };
}

export function CategoryJsonLd({
  category,
  products,
}: {
  category: string;
  products: Product[];
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${category.replace(/-/g, " ")} — YourBrand`,
    url: `${BASE}/products/${category}`,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: products.map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `${BASE}/products/${p.category}/${p.slug}`,
        name: p.name,
      })),
    },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function BreadcrumbJsonLd({ category }: { category: string }) {
  const items = [
    { name: "Home", url: BASE },
    { name: "Products", url: `${BASE}/products` },
    { name: category.replace(/-/g, " "), url: `${BASE}/products/${category}` },
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
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}