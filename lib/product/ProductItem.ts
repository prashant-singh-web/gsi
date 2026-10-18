// lib/products/index.ts

import { autoclave } from "./item/autoclave/autoclave";



export const ProductItem = [
  { url: "/autoclave", item: autoclave },
  
];

export const allProducts = ProductItem.flatMap((p) => p.item);