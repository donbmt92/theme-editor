"use client";

import { Award, BadgeCheck, Globe2, Handshake, Timer } from "lucide-react";
import { motion } from "framer-motion";
import { Container } from "@/components/Container";
import { TrustItem } from "@/data/templateData";

const icons = [Timer, Award, BadgeCheck, Globe2, Handshake];

export function TrustBar({ items }: { items: TrustItem[] }) {
  return (
    <section className="border-y border-[#E5E5E5] bg-white">
      <Container className="py-6">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {items.map((item, index) => {
            const Icon = icons[index % icons.length];
            return (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: index * 0.04 }}
                className="rounded-[22px] border border-[#E5E5E5] bg-[#F8F8F7] p-5 lg:border-transparent lg:bg-white"
              >
                <Icon className="mb-4 h-5 w-5 text-[#0A66C2]" />
                <p className="text-xl font-semibold text-[#111111]">{item.value}</p>
                <p className="mt-1 text-sm leading-6 text-[#666666]">{item.label}</p>
              </motion.div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
