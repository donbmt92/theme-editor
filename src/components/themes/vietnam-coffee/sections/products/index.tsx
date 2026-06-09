"use client";

import { ProductsAlternating } from "./ProductsAlternating";
import { ProductsFeatured } from "./ProductsFeatured";
import { ProductsGrid } from "./ProductsGrid";
import type { ProductsSectionBaseProps } from "./ProductsSectionBase";

export type { ProductsServicesContent } from "./ProductsSectionBase";
export type ProductsVariant = "alternating" | "grid" | "featured";

export function ProductsVariantSection(props: Omit<ProductsSectionBaseProps, "variant">) {
  switch (props.content.variant) {
    case "grid":
      return <ProductsGrid {...props} />;
    case "featured":
      return <ProductsFeatured {...props} />;
    case "alternating":
    default:
      return <ProductsAlternating {...props} />;
  }
}
