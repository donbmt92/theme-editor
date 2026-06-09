"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { EditableImage } from "@/components/EditableImage";
import { ProofAsset } from "@/data/templateData";
import { cn } from "@/lib/utils";

export function ProofGallery({
  filters,
  items,
}: {
  filters: Array<"All" | ProofAsset["category"]>;
  items: ProofAsset[];
}) {
  const [active, setActive] = useState<(typeof filters)[number]>("All");
  const visibleItems = useMemo(
    () => (active === "All" ? items : items.filter((item) => item.category === active)),
    [active, items],
  );

  return (
    <div>
      <div className="mb-6 flex flex-wrap gap-2">
        {filters.map((filter) => (
          <button
            key={filter}
            type="button"
            onClick={() => setActive(filter)}
            className={cn(
              "rounded-full border px-4 py-2 text-sm font-semibold transition",
              active === filter
                ? "border-[#111111] bg-[#111111] text-white"
                : "border-[#E5E5E5] bg-white text-[#666666] hover:border-[#111111] hover:text-[#111111]",
            )}
          >
            {filter}
          </button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visibleItems.map((item, index) => (
          <motion.article
            key={`${item.category}-${item.caption}`}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.45, delay: index * 0.025 }}
            className="overflow-hidden rounded-[24px] border border-[#E5E5E5] bg-white shadow-sm"
          >
            <EditableImage
              src={item.image}
              label={item.imageLabel}
              placeholderText={item.placeholderText}
              aspectRatio={index % 5 === 1 ? "4 / 5" : "4 / 3"}
              className="rounded-none border-0 shadow-none"
            />
            <div className="p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#0A66C2]">
                {item.category}
              </p>
              <p className="mt-2 text-sm font-semibold text-[#111111]">{item.caption}</p>
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  );
}
