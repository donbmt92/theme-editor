"use client";

import { PackageCheck } from "lucide-react";
import { motion } from "framer-motion";
import { Container } from "@/components/Container";
import { SectionHeader } from "@/components/SectionHeader";
import { ProcessStep } from "@/data/templateData";

export function ProcessSection({
  data,
}: {
  data: {
    eyebrow: string;
    title: string;
    subtitle: string;
    steps: ProcessStep[];
  };
}) {
  return (
    <section id="process" className="section-shell bg-[#F8F8F7]">
      <Container>
        <SectionHeader eyebrow={data.eyebrow} title={data.title} subtitle={data.subtitle} />
        <div className="mt-12 hidden gap-3 lg:grid lg:grid-cols-7">
          {data.steps.map((step, index) => (
            <motion.article
              key={step.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: index * 0.04 }}
              className="relative rounded-[24px] border border-[#E5E5E5] bg-white p-5 shadow-sm"
            >
              <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-full bg-[#111111] text-sm font-semibold text-white">
                {index + 1}
              </div>
              <PackageCheck className="mb-4 h-5 w-5 text-[#0A66C2]" />
              <h3 className="text-lg font-semibold text-[#111111]">{step.title}</h3>
              <p className="mt-3 text-sm leading-6 text-[#666666]">{step.description}</p>
            </motion.article>
          ))}
        </div>

        <div className="mt-12 space-y-4 lg:hidden">
          {data.steps.map((step, index) => (
            <motion.article
              key={step.title}
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: index * 0.03 }}
              className="flex gap-4 rounded-[24px] border border-[#E5E5E5] bg-white p-5 shadow-sm"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#111111] text-sm font-semibold text-white">
                {index + 1}
              </div>
              <div>
                <h3 className="text-xl font-semibold text-[#111111]">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-[#666666]">{step.description}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </Container>
    </section>
  );
}
