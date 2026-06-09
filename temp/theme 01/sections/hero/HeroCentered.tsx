"use client";

import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Container } from "@/components/Container";
import { EditableImage } from "@/components/EditableImage";
import { HeroData } from "@/data/templateData";

export function HeroCentered({ hero }: { hero: HeroData }) {
  return (
    <section id="top" className="relative overflow-hidden bg-white pt-32">
      <Container className="pb-16 pt-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: "easeOut" }}
          className="mx-auto max-w-4xl"
        >
          <p className="mb-5 text-sm font-semibold uppercase tracking-[0.14em] text-[#0A66C2]">
            {hero.eyebrow}
          </p>
          <h1 className="break-words text-[2.35rem] font-semibold leading-[1.06] text-[#111111] [overflow-wrap:anywhere] sm:text-6xl sm:leading-[1.02] lg:text-7xl">
            {hero.headline}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-[#666666] sm:text-xl">
            {hero.subheadline}
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <a
              href="#contact"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#111111] px-7 py-4 text-base font-semibold text-white transition hover:bg-[#0A66C2] sm:w-auto"
            >
              {hero.primaryCta}
              <ArrowRight className="h-5 w-5" />
            </a>
            <a
              href="#products"
              className="inline-flex w-full items-center justify-center rounded-full border border-[#D8D8D8] bg-white px-7 py-4 text-base font-semibold text-[#111111] sm:w-auto"
            >
              {hero.secondaryCta}
            </a>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: "easeOut", delay: 0.1 }}
          className="mx-auto mt-12 max-w-5xl"
        >
          <EditableImage
            src={hero.image}
            label={hero.visualLabel}
            placeholderText={hero.visualPlaceholder}
            aspectRatio="16 / 8"
          />
        </motion.div>
      </Container>
    </section>
  );
}
