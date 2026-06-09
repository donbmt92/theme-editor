"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useMemo, useState } from "react";
import { Container } from "@/components/Container";
import { SectionHeader } from "@/components/SectionHeader";
import { FaqData } from "@/data/templateData";
import { cn } from "@/lib/utils";

export function FAQSection({ data }: { data: FaqData }) {
  const categories = useMemo(
    () => ["All", ...Array.from(new Set(data.items.map((item) => item.category)))] as const,
    [data.items],
  );
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [openIndex, setOpenIndex] = useState(0);
  const visibleItems =
    activeCategory === "All"
      ? data.items
      : data.items.filter((item) => item.category === activeCategory);

  return (
    <section id="faq" className="section-shell bg-[#F8F8F7]">
      <Container>
        <SectionHeader eyebrow={data.eyebrow} title={data.title} subtitle={data.subtitle} align="center" />
        <div className="mt-10 flex flex-wrap justify-center gap-2">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => {
                setActiveCategory(category);
                setOpenIndex(0);
              }}
              className={cn(
                "rounded-full border px-4 py-2 text-sm font-semibold transition",
                activeCategory === category
                  ? "border-[#111111] bg-[#111111] text-white"
                  : "border-[#E5E5E5] bg-white text-[#666666] hover:border-[#111111]",
              )}
            >
              {category}
            </button>
          ))}
        </div>
        <div className="mx-auto mt-8 max-w-3xl space-y-3">
          {visibleItems.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={item.question} className="rounded-[22px] border border-[#E5E5E5] bg-white shadow-sm">
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? -1 : index)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="text-base font-semibold text-[#111111]">{item.question}</span>
                  <ChevronDown
                    className={cn("h-5 w-5 shrink-0 text-[#666666] transition", isOpen && "rotate-180")}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen ? (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <p className="px-6 pb-6 text-base leading-7 text-[#666666]">{item.answer}</p>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
