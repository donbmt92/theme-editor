import { ProductsData } from "@/data/templateData";
import { ProductFeatured } from "@/components/sections/products/ProductFeatured";
import { ProductGrid } from "@/components/sections/products/ProductGrid";

export function ProductShowcase({ data }: { data: ProductsData }) {
  if (data.variant === "featured") return <ProductFeatured data={data} />;
  return <ProductGrid data={data} />;
}
