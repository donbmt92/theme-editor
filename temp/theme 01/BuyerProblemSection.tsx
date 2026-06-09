"use client";

import { ClipboardList, FileWarning, MessageCircleWarning, ShieldAlert } from "lucide-react";
import { motion } from "framer-motion";
import { Container } from "@/components/Container";
import { SectionHeader } from "@/components/SectionHeader";
import { BuyerProblem } from "@/data/templateData";

const iconMap = {
  quality: ShieldAlert,
  communication: MessageCircleWarning,
  document: FileWarning,
  specification: ClipboardList,
};

export function BuyerProblemSection({
  data,
}: {
  data: {
    eyebrow: string;
    title: string;
    subtitle: string;
    items: BuyerProblem[];
  };
}) {
  return (
    <section className="section-shell bg-[#F8F8F7]">
      <Container>
        <SectionHeader eyebrow={data.eyebrow} title={data.title} subtitle={data.subtitle} />
        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {data.items.map((item, index) => {
            const Icon = iconMap[item.icon];
            return (
              <motion.article
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="rounded-[24px] border border-[#E5E5E5] bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl border border-[#E5E5E5] bg-[#F8F8F7]">
                  <Icon className="h-6 w-6 text-[#111111]" />
                </div>
                <h3 className="text-2xl font-semibold text-[#111111]">{item.title}</h3>
                <p className="mt-4 text-base leading-7 text-[#666666]">{item.description}</p>
                <div className="mt-6 rounded-2xl bg-[#F8F8F7] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#0A66C2]">
                    Business impact
                  </p>
                  <p className="mt-2 text-sm leading-6 text-[#111111]">{item.businessImpact}</p>
                </div>
              </motion.article>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
