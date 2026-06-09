"use client";

import { ArrowRight, Check } from "lucide-react";
import { motion } from "framer-motion";
import { Container } from "@/components/Container";
import { SectionHeader } from "@/components/SectionHeader";
import { SolutionCapability } from "@/data/templateData";

export function SolutionOverview({
  data,
}: {
  data: {
    eyebrow: string;
    title: string;
    subtitle: string;
    systemFlow: string[];
    capabilities: SolutionCapability[];
  };
}) {
  return (
    <section id="capabilities" className="section-shell bg-white">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[0.92fr_1.08fr]">
          <div>
            <SectionHeader eyebrow={data.eyebrow} title={data.title} subtitle={data.subtitle} />
            <div className="mt-10 rounded-[24px] border border-[#E5E5E5] bg-[#F8F8F7] p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                {data.systemFlow.map((step, index) => (
                  <div key={step} className="flex items-center gap-3">
                    <span className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#111111] shadow-sm">
                      {step}
                    </span>
                    {index < data.systemFlow.length - 1 ? (
                      <ArrowRight className="hidden h-4 w-4 text-[#666666] sm:block" />
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid gap-4">
            {data.capabilities.map((item, index) => (
              <motion.article
                key={item.title}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: index * 0.04 }}
                className="rounded-[24px] border border-[#E5E5E5] bg-white p-6 shadow-sm"
              >
                <div className="flex gap-4">
                  <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#111111] text-white">
                    <Check className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-[#111111]">{item.title}</h3>
                    <p className="mt-3 text-base leading-7 text-[#666666]">{item.description}</p>
                    <p className="mt-4 text-sm font-semibold leading-6 text-[#0A66C2]">
                      {item.buyerValue}
                    </p>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
