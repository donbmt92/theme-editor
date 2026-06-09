"use client";

import { ArrowRight } from "lucide-react";
import { Container } from "@/components/Container";
import { EditableImage } from "@/components/EditableImage";
import { SectionHeader } from "@/components/SectionHeader";
import { ProductsData } from "@/data/templateData";

export function ProductFeatured({ data }: { data: ProductsData }) {
  const [featured, ...rest] = data.items;

  return (
    <section id="products" className="section-shell bg-[#F8F8F7]">
      <Container>
        <SectionHeader eyebrow={data.eyebrow} title={data.title} subtitle={data.subtitle} />
        {featured ? (
          <div className="mt-12 grid gap-6 rounded-[24px] border border-[#E5E5E5] bg-white p-5 shadow-sm lg:grid-cols-[1.1fr_0.9fr]">
            <EditableImage
              src={featured.image}
              label={featured.imageLabel}
              placeholderText={`Upload image for ${featured.name}`}
              aspectRatio="4 / 3"
            />
            <div className="p-3 lg:p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#0A66C2]">
                Featured
              </p>
              <h3 className="mt-4 text-4xl font-semibold leading-tight text-[#111111]">
                {featured.name}
              </h3>
              <p className="mt-4 text-lg leading-8 text-[#666666]">{featured.description}</p>
              <div className="mt-6 space-y-3">
                {featured.specs.map((spec) => (
                  <p key={spec} className="rounded-2xl bg-[#F8F8F7] px-4 py-3 text-sm text-[#111111]">
                    {spec}
                  </p>
                ))}
              </div>
              <a
                href="#contact"
                className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#111111] px-6 py-3 text-sm font-semibold text-white"
              >
                {featured.cta}
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        ) : null}
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {rest.map((product) => (
            <div key={product.name} className="rounded-[24px] border border-[#E5E5E5] bg-white p-5">
              <h3 className="text-xl font-semibold text-[#111111]">{product.name}</h3>
              <p className="mt-2 text-sm leading-6 text-[#666666]">{product.description}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
