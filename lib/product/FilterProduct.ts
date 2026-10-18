import { allProducts } from "./ProductItem";
import type { ProductCategory, ProductType, FeatureTag, LoadType } from "./type";

export interface FilterGroup {
  key: string;
  label: string;
  /** inner filter groups → recursive, supports arbitrary nesting */
  children?: FilterGroup[];
  /** read a value off a Product for matching */
  accessor: (p: any) => string | string[] | undefined;
  /** when true, matches if ANY selected value is present */
  multi?: boolean;
}

/**
 * FILTER TREE — top-level category → type → features/load.
 * Handles all inner levels. Add new groups here; UI + URL + SEO all follow.
 */
export const FilterProduct: FilterGroup[] = [
  {
    key: "category",
    label: "Category",
    accessor: (p) => p.category,
    children: [
      {
        key: "type",
        label: "Type",
        accessor: (p) => p.type,
        multi: true,
        children: [
          { key: "load", label: "Load / Door", accessor: (p) => p.load, multi: true },
          { key: "features", label: "Features", accessor: (p) => p.features, multi: true },
        ],
      },
    ],
  },
];

/** Flatten tree to a key→accessor map for easy filtering */
export const accessorMap: Record<string, FilterGroup["accessor"]> = (() => {
  const map: Record<string, FilterGroup["accessor"]> = {};
  const walk = (groups: FilterGroup[]) =>
    groups.forEach((g) => {
      map[g.key] = g.accessor;
      if (g.children) walk(g.children);
    });
  walk(FilterProduct);
  return map;
})();

/** Human-readable value maps — used for labels + SEO metadata */
export const valueLabels: Record<string, Record<string, string>> = {
  category: {
    autoclave: "Autoclave",
    incubator: "Incubator",
    oven: "Hot Air Oven",
    "cod-digester": "COD Digester",
    "deep-freezer": "Deep Freezer",
    "colony-counter": "Colony Counter",
    "curing-tank": "Curing Tank",
    accessories: "Accessories",
  },
  type: {
    vertical: "Vertical",
    horizontal: "Horizontal",
    portable: "Portable",
    benchtop: "Benchtop",
    "double-decker": "Double Decker",
    jacketed: "Jacketed",
    "semi-automatic": "Semi Automatic",
    manual: "Manual",
  },
  load: {
    "single-drum": "Single Drum",
    "radial-locking": "Radial Locking",
    "ss-basket": "SS Basket",
    "multiport-valve": "Multiport Valve",
    "single-lever": "Single Lever",
  },
  features: {
    "data-logger": "Data Logger",
    "4-channel-logger": "4-Channel Logger",
    digital: "Digital",
    thermostat: "Thermostat",
    gmp: "GMP",
    bod: "BOD",
    memmert: "Memmert Type",
    "high-pressure": "High Pressure",
  },
};

/** Count products per filter value — for sidebar badges + SEO */
export function buildFilterCounts() {
  const counts: Record<string, Record<string, number>> = {};
  for (const [key, accessor] of Object.entries(accessorMap)) {
    counts[key] = {};
    for (const p of allProducts) {
      const v = accessor(p);
      const arr = Array.isArray(v) ? v : v ? [v] : [];
      for (const val of arr) counts[key][val] = (counts[key][val] || 0) + 1;
    }
  }
  return counts;
}