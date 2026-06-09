"use client";

import { ProductsVariantSection } from "./sections/products";
import type { ThemeParams } from "@/types";
import type { ProductsServicesContent } from "./sections/products";

interface ProductsServicesProps {
  theme: ThemeParams;
  content: ProductsServicesContent;
}

const ProductsServices = (props: ProductsServicesProps) => {
  return <ProductsVariantSection {...props} />;
};

export default ProductsServices;
