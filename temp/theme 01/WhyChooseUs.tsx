"use client";

import { CheckCircle2, XCircle } from "lucide-react";
import { motion } from "framer-motion";
import { Container } from "@/components/Container";
import { SectionHeader } from "@/components/SectionHeader";
import { WhyChooseUsData } from "@/data/templateData";

export function WhyChooseUs({ data }: { data: WhyChooseUsData }) {
  return (
    <section className="section-shell bg-white">
      <Container>
        <SectionHeader eyebrow={data.eyebrow} title={data.title} subtitle={data.subtitle} align="center" />
        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {data.benefits.map((benefit, index) => (
            <motion.article
              key={benefit.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: index * 0.04 }}
              className="rounded-[24px] border border-[#E5E5E5] bg-white p-6 shadow-sm"
            >
              <h3 className="text-xl font-semibold text-[#111111]">{benefit.title}</h3>
              <p className="mt-4 text-sm leading-7 text-[#666666]">{benefit.businessValue}</p>
            </motion.article>
          ))}
        </div>

        <div className="mt-10 overflow-hidden rounded-[28px] border border-[#E5E5E5] bg-[#F8F8F7]">
          <div className="grid md:grid-cols-2">
            <ComparisonColumn
              title={data.comparison.typicalTitle}
              items={data.comparison.typical}
              tone="muted"
            />
            <ComparisonColumn
              title={data.comparison.ourTitle}
              items={data.comparison.ours}
              tone="strong"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}

function ComparisonColumn({
  title,
  items,
  tone,
}: {
  title: string;
  items: string[];
  tone: "muted" | "strong";
}) {
  const Icon = tone === "strong" ? CheckCircle2 : XCircle;
  return (
    <div className="border-b border-[#E5E5E5] p-6 md:border-b-0 md:border-r last:md:border-r-0">
      <h3 className="text-2xl font-semibold text-[#111111]">{title}</h3>
      <div className="mt-6 space-y-4">
        {items.map((item) => (
          <div key={item} className="flex gap-3">
            <Icon className={tone === "strong" ? "h-5 w-5 text-[#0A66C2]" : "h-5 w-5 text-[#999999]"} />
            <p className="text-sm leading-6 text-[#111111]">{item}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
