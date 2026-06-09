"use client";

import { Download } from "lucide-react";
import { motion } from "framer-motion";
import { Container } from "@/components/Container";
import { EditableImage } from "@/components/EditableImage";
import { SectionHeader } from "@/components/SectionHeader";
import { LeadMagnetsData } from "@/data/templateData";

export function LeadMagnet({ data }: { data: LeadMagnetsData }) {
  return (
    <section id="lead-magnet" className="section-shell bg-white">
      <Container>
        <SectionHeader eyebrow={data.eyebrow} title={data.title} subtitle={data.subtitle} align="center" />
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {data.items.map((item, index) => (
            <motion.article
              key={item.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: index * 0.05 }}
              className="rounded-[24px] border border-[#E5E5E5] bg-white p-5 shadow-sm"
            >
              <EditableImage
                src={item.image}
                label={item.imageLabel}
                placeholderText={item.placeholderText}
                aspectRatio="4 / 3"
              />
              <h3 className="mt-6 text-2xl font-semibold leading-tight text-[#111111]">{item.title}</h3>
              <p className="mt-4 text-base leading-7 text-[#666666]">{item.description}</p>
              <a
                href="#contact"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#111111] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0A66C2]"
              >
                <Download className="h-4 w-4" />
                {item.cta}
              </a>
            </motion.article>
          ))}
        </div>
      </Container>
    </section>
  );
}
