"use client";

import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Container } from "@/components/Container";
import { EditableImage } from "@/components/EditableImage";
import { SectionHeader } from "@/components/SectionHeader";
import { ProductsData } from "@/data/templateData";

export function ProductGrid({ data }: { data: ProductsData }) {
  return (
    <section id="products" className="section-shell bg-[#F8F8F7]">
      <Container>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeader eyebrow={data.eyebrow} title={data.title} subtitle={data.subtitle} />
        </div>
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {data.items.map((product, index) => (
            <motion.article
              key={product.name}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: index * 0.06 }}
              className="flex h-full flex-col overflow-hidden rounded-[24px] border border-[#E5E5E5] bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <EditableImage
                src={product.image}
                label={product.imageLabel}
                placeholderText={`Upload image for ${product.name}`}
                aspectRatio="4 / 3"
                className="rounded-none border-0 shadow-none"
              />
              <div className="flex flex-1 flex-col p-6">
                <h3 className="text-2xl font-semibold text-[#111111]">{product.name}</h3>
                <p className="mt-3 text-base leading-7 text-[#666666]">{product.description}</p>
                <ul className="mt-5 space-y-2">
                  {product.specs.map((spec) => (
                    <li key={spec} className="text-sm leading-6 text-[#111111]">
                      {spec}
                    </li>
                  ))}
                </ul>
                <div className="mt-6 grid gap-2">
                  <Tag label="MOQ" value={product.moq} />
                  <Tag label="Packaging" value={product.packaging} />
                  <Tag label="Use case" value={product.useCase} />
                </div>
                <a
                  href="#contact"
                  className="mt-7 inline-flex items-center justify-center gap-2 rounded-full bg-[#111111] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0A66C2]"
                >
                  {product.cta}
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </motion.article>
          ))}
        </div>
      </Container>
    </section>
  );
}

function Tag({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-[#F8F8F7] px-4 py-3">
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#666666]">{label}</p>
      <p className="mt-1 text-sm font-semibold text-[#111111]">{value}</p>
    </div>
  );
}
