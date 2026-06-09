import { FinalCtaData, ProductItem } from "@/data/templateData";
import { CtaCenteredForm } from "@/components/sections/cta/CtaCenteredForm";
import { CtaFormRight } from "@/components/sections/cta/CtaFormRight";

export function FinalCTA({
  data,
  products,
}: {
  data: FinalCtaData;
  products: { items: ProductItem[] };
}) {
  if (data.variant === "centeredForm") return <CtaCenteredForm data={data} products={products} />;
  return <CtaFormRight data={data} products={products} />;
}
