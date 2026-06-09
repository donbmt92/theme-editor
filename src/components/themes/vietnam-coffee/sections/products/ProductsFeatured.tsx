"use client";

import ProductsSectionBase from "./ProductsSectionBase";
import type { ProductsSectionBaseProps } from "./ProductsSectionBase";

export function ProductsFeatured(props: Omit<ProductsSectionBaseProps, "variant">) {
  return <ProductsSectionBase {...props} variant="featured" />;
}
