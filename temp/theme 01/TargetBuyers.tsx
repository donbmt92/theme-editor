"use client";

import { ArrowRight, Check, Minus } from "lucide-react";
import { motion } from "framer-motion";
import { Container } from "@/components/Container";
import { SectionHeader } from "@/components/SectionHeader";
import { TargetBuyersData } from "@/data/templateData";

export function TargetBuyers({ data }: { data: TargetBuyersData }) {
  return (
    <section className="section-shell bg-[#F8F8F7]">
      <Container>
        <SectionHeader eyebrow={data.eyebrow} title={data.title} subtitle={data.subtitle} />
        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-5">
          {data.buyers.map((buyer, index) => (
            <motion.article
              key={buyer.type}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: index * 0.04 }}
              className="rounded-[24px] border border-[#E5E5E5] bg-white p-5 shadow-sm"
            >
              <h3 className="text-xl font-semibold text-[#111111]">{buyer.type}</h3>
              <p className="mt-4 text-xs font-semibold uppercase tracking-[0.12em] text-[#666666]">
                Need
              </p>
              <p className="mt-2 text-sm leading-6 text-[#111111]">{buyer.need}</p>
              <p className="mt-4 text-xs font-semibold uppercase tracking-[0.12em] text-[#666666]">
                Best fit
              </p>
              <p className="mt-2 text-sm leading-6 text-[#111111]">{buyer.bestFit}</p>
              <a
                href="#contact"
                className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#0A66C2]"
              >
                {buyer.cta}
                <ArrowRight className="h-4 w-4" />
              </a>
            </motion.article>
          ))}
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          <FitBlock title="Best for" items={data.bestFor} icon="check" />
          <FitBlock title="Not ideal for" items={data.notIdealFor} icon="minus" />
        </div>
      </Container>
    </section>
  );
}

function FitBlock({ title, items, icon }: { title: string; items: string[]; icon: "check" | "minus" }) {
  const Icon = icon === "check" ? Check : Minus;
  return (
    <div className="rounded-[24px] border border-[#E5E5E5] bg-white p-6 shadow-sm">
      <h3 className="text-2xl font-semibold text-[#111111]">{title}</h3>
      <div className="mt-5 grid gap-3">
        {items.map((item) => (
          <div key={item} className="flex gap-3">
            <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#F8F8F7]">
              <Icon className="h-4 w-4 text-[#111111]" />
            </span>
            <p className="text-sm leading-6 text-[#666666]">{item}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
