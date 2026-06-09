"use client";

import { ArrowRight, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { Container } from "@/components/Container";
import { EditableImage } from "@/components/EditableImage";
import { HeroData } from "@/data/templateData";

export function HeroClassic({ hero }: { hero: HeroData }) {
  return (
    <section id="top" className="relative overflow-hidden bg-white pt-32">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[680px] bg-[radial-gradient(circle_at_72%_22%,rgba(10,102,194,0.12),transparent_34%),linear-gradient(180deg,#F8F8F7_0%,#FFFFFF_72%)]" />
      <Container className="relative grid items-center gap-12 pb-12 pt-8 lg:grid-cols-[1fr_0.95fr] lg:pb-20">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: "easeOut" }}
          className="min-w-0"
        >
          <p className="mb-5 text-sm font-semibold uppercase tracking-[0.14em] text-[#0A66C2]">
            {hero.eyebrow}
          </p>
          <h1 className="max-w-3xl break-words text-[2.35rem] font-semibold leading-[1.06] text-[#111111] [overflow-wrap:anywhere] sm:text-6xl sm:leading-[1.02] lg:text-7xl">
            {hero.headline}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-[#666666] sm:text-xl">
            {hero.subheadline}
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a
              href="#contact"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#111111] px-7 py-4 text-base font-semibold text-white transition hover:bg-[#0A66C2] sm:w-auto"
            >
              {hero.primaryCta}
              <ArrowRight className="h-5 w-5" />
            </a>
            <a
              href="#products"
              className="inline-flex w-full items-center justify-center rounded-full border border-[#D8D8D8] bg-white px-7 py-4 text-base font-semibold text-[#111111] transition hover:border-[#111111] sm:w-auto"
            >
              {hero.secondaryCta}
            </a>
          </div>

          <div className="mt-9 grid gap-3 sm:grid-cols-2">
            {hero.trustBullets.map((item) => (
              <div key={item} className="flex items-center gap-3 text-sm font-medium text-[#111111]">
                <CheckCircle2 className="h-5 w-5 text-[#0A66C2]" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.65, ease: "easeOut", delay: 0.1 }}
          className="relative min-w-0"
        >
          <EditableImage
            src={hero.image}
            label={hero.visualLabel}
            placeholderText={hero.visualPlaceholder}
            aspectRatio="4 / 3"
            className="min-h-[380px]"
          />
          <div className="absolute -left-4 bottom-8 hidden rounded-[22px] border border-[#E5E5E5] bg-white/92 p-4 shadow-xl backdrop-blur sm:block">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#666666]">
              Buyer ready
            </p>
            <div className="mt-3 flex gap-4">
              {hero.proofCards.map((card) => (
                <div key={card.label}>
                  <p className="text-2xl font-semibold text-[#111111]">{card.value}</p>
                  <p className="mt-1 text-xs text-[#666666]">{card.label}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
