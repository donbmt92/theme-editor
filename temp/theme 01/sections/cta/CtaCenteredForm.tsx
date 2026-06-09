"use client";

import { FormEvent } from "react";
import { Container } from "@/components/Container";
import { SectionHeader } from "@/components/SectionHeader";
import { FinalCtaData, ProductItem } from "@/data/templateData";
import { InquiryForm } from "./CtaFormRight";

export function CtaCenteredForm({
  data,
  products,
}: {
  data: FinalCtaData;
  products: { items: ProductItem[] };
}) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    alert(data.successMessage);
  }

  return (
    <section id="contact" className="section-shell bg-white">
      <Container>
        <div className="mx-auto max-w-3xl">
          <SectionHeader eyebrow={data.eyebrow} title={data.title} subtitle={data.subtitle} align="center" />
          <p className="mx-auto mt-6 max-w-md rounded-2xl bg-[#F8F8F7] px-5 py-4 text-center text-sm font-semibold text-[#111111]">
            {data.trustNote}
          </p>
          <div className="mt-8">
            <InquiryForm data={data} products={products} onSubmit={handleSubmit} />
          </div>
        </div>
      </Container>
    </section>
  );
}
