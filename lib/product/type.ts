export type ProductCategory =
  | "autoclave"
  | "incubator"
  | "oven"
  | "cod-digester"
  | "deep-freezer"
  | "colony-counter"
  | "curing-tank"
  | "accessories";

export type ProductType =
  | "vertical"
  | "horizontal"
  | "portable"
  | "benchtop"
  | "double-decker"
  | "jacketed"
  | "semi-automatic"
  | "manual";

export type LoadType = "single-drum" | "radial-locking" | "ss-basket" | "multiport-valve" | "single-lever";

export type FeatureTag =
  | "data-logger"
  | "4-channel-logger"
  | "digital"
  | "thermostat"
  | "gmp"
  | "bod"
  | "memmert"
  | "high-pressure";

export interface Product {
  /** URL slug, kebab-case, unique across all products */
  slug: string;
  /** Display name (used in UI + <title>) */
  name: string;
  /** Short SEO-friendly description */
  description: string;
  category: ProductCategory;
  type: ProductType[];
  load?: LoadType[];
  features: FeatureTag[];
  /** Chamber capacity in liters, if applicable */
  capacityL?: number;
  /** Max temp in °C */
  maxTempC?: number;
  /** Primary image path */
  image: string;
  /** Optional gallery */
  gallery?: string[];
  /** Price in INR, optional */
  price?: number;
  /** Availability */
  inStock: boolean;
  /** Long-form spec sheet for the product detail page */
  specs?: Record<string, string>;
  /** Related slugs for internal linking */
  related?: string[];
  /** Hide from listing but keep detail page reachable */
  hidden?: boolean;
}