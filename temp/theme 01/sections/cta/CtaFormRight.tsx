"use client";

import { Mail, MessageCircle, PhoneCall } from "lucide-react";
import { FormEvent } from "react";
import { Container } from "@/components/Container";
import { EditableImage } from "@/components/EditableImage";
import { SectionHeader } from "@/components/SectionHeader";
import { FinalCtaData, ProductItem } from "@/data/templateData";

export function CtaFormRight({
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
        <div className="grid gap-8 rounded-[32px] border border-[#E5E5E5] bg-[#F8F8F7] p-5 shadow-sm lg:grid-cols-[0.9fr_1.1fr] lg:p-8">
          <div className="flex flex-col justify-between gap-8 rounded-[26px] bg-white p-6 shadow-sm lg:p-8">
            <div>
              <SectionHeader eyebrow={data.eyebrow} title={data.title} subtitle={data.subtitle} />
              <p className="mt-6 rounded-2xl bg-[#F8F8F7] px-5 py-4 text-sm font-semibold text-[#111111]">
                {data.trustNote}
              </p>
              <div className="mt-6 grid gap-3">
                {data.contactOptions.map((option, index) => {
                  const Icon = [MessageCircle, Mail, PhoneCall][index] ?? MessageCircle;
                  return (
                    <a
                      key={option.label}
                      href={option.href}
                      className="flex items-center gap-4 rounded-2xl border border-[#E5E5E5] p-4 transition hover:border-[#111111]"
                    >
                      <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#111111] text-white">
                        <Icon className="h-5 w-5" />
                      </span>
                      <span>
                        <span className="block text-sm font-semibold text-[#111111]">{option.label}</span>
                        <span className="mt-1 block text-sm text-[#666666]">{option.value}</span>
                      </span>
                    </a>
                  );
                })}
              </div>
            </div>
            <EditableImage
              src={data.visual.image}
              label={data.visual.imageLabel}
              placeholderText={data.visual.placeholderText}
              aspectRatio="16 / 10"
            />
          </div>

          <InquiryForm data={data} products={products} onSubmit={handleSubmit} />
        </div>
      </Container>
    </section>
  );
}

export function InquiryForm({
  data,
  products,
  onSubmit,
}: {
  data: FinalCtaData;
  products: { items: ProductItem[] };
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <form onSubmit={onSubmit} className="rounded-[26px] border border-[#E5E5E5] bg-white p-5 shadow-sm lg:p-8">
      <div className="grid gap-4 md:grid-cols-2">
        {data.formFields.map((field) => {
          if (field.type === "textarea") {
            return (
              <label key={field.name} className="md:col-span-2">
                <FieldLabel label={field.label} required={field.required} />
                <textarea
                  name={field.name}
                  placeholder={field.placeholder}
                  required={field.required}
                  rows={5}
                  className="mt-2 w-full resize-none rounded-2xl border border-[#E5E5E5] bg-[#F8F8F7] px-4 py-3 text-sm text-[#111111] outline-none transition focus:border-[#0A66C2]"
                />
              </label>
            );
          }

          if (field.type === "select") {
            return (
              <label key={field.name}>
                <FieldLabel label={field.label} required={field.required} />
                <select
                  name={field.name}
                  required={field.required}
                  className="mt-2 h-12 w-full rounded-2xl border border-[#E5E5E5] bg-[#F8F8F7] px-4 text-sm text-[#111111] outline-none transition focus:border-[#0A66C2]"
                >
                  <option value="">{field.placeholder}</option>
                  {products.items.map((product) => (
                    <option key={product.name} value={product.name}>
                      {product.name}
                    </option>
                  ))}
                </select>
              </label>
            );
          }

          return (
            <label key={field.name} className={field.type === "file" ? "md:col-span-2" : undefined}>
              <FieldLabel label={field.label} required={field.required} />
              <input
                name={field.name}
                type={field.type}
                placeholder={field.placeholder}
                required={field.required}
                className="mt-2 h-12 w-full rounded-2xl border border-[#E5E5E5] bg-[#F8F8F7] px-4 text-sm text-[#111111] outline-none transition file:mr-4 file:rounded-full file:border-0 file:bg-[#111111] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white focus:border-[#0A66C2]"
              />
            </label>
          );
        })}
      </div>
      <button
        type="submit"
        className="mt-6 w-full rounded-full bg-[#111111] px-6 py-4 text-base font-semibold text-white transition hover:bg-[#0A66C2]"
      >
        {data.submitLabel}
      </button>
    </form>
  );
}

function FieldLabel({ label, required }: { label: string; required?: boolean }) {
  return (
    <span className="text-sm font-semibold text-[#111111]">
      {label}
      {required ? <span className="text-[#0A66C2]"> *</span> : null}
    </span>
  );
}
