"use client";

import { ArrowRight, Quote } from "lucide-react";
import { motion } from "framer-motion";
import { Container } from "@/components/Container";
import { EditableImage } from "@/components/EditableImage";
import { ProofGallery } from "@/components/ProofGallery";
import { SectionHeader } from "@/components/SectionHeader";
import { CaseStudy, ProofAsset } from "@/data/templateData";

export function ProofCaseStudyWithGallery({
  proofAssets,
  caseStudies,
}: {
  proofAssets: {
    eyebrow: string;
    title: string;
    subtitle: string;
    filters: Array<"All" | ProofAsset["category"]>;
    items: ProofAsset[];
  };
  caseStudies: CaseStudy[];
}) {
  const caseStudy = caseStudies[0];

  return (
    <section id="case-studies" className="section-shell bg-white">
      <Container>
        <SectionHeader
          eyebrow={proofAssets.eyebrow}
          title={proofAssets.title}
          subtitle={proofAssets.subtitle}
          align="center"
        />

        {caseStudy ? (
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.55 }}
            className="mt-12 grid gap-6 rounded-[28px] border border-[#E5E5E5] bg-[#F8F8F7] p-5 lg:grid-cols-[0.95fr_1.05fr]"
          >
            <div className="rounded-[24px] bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#0A66C2]">
                {caseStudy.buyerType}
              </p>
              <h3 className="mt-4 text-3xl font-semibold leading-tight text-[#111111]">
                {caseStudy.title}
              </h3>
              <div className="mt-6 space-y-5">
                <CaseRow label="Problem" value={caseStudy.problem} />
                <CaseRow label="Solution" value={caseStudy.solution} />
                <CaseRow label="Result" value={caseStudy.result} />
              </div>
              <a
                href="#contact"
                className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#111111] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0A66C2]"
              >
                {caseStudy.cta}
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>

            <div className="grid gap-4 md:grid-cols-[1fr_0.72fr]">
              <EditableImage
                src={caseStudy.image}
                label={caseStudy.imageLabel}
                placeholderText="Upload distributor, buyer visit, shipment, or project photo"
                aspectRatio="4 / 3"
              />
              <div className="rounded-[24px] border border-[#E5E5E5] bg-white p-5 shadow-sm">
                <Quote className="h-7 w-7 text-[#0A66C2]" />
                <p className="mt-4 text-base leading-7 text-[#111111]">
                  {caseStudy.testimonial.quote}
                </p>
                <div className="mt-6 flex items-center gap-3">
                  <EditableImage
                    src={caseStudy.testimonial.avatar}
                    label={caseStudy.testimonial.avatarLabel}
                    placeholderText="Upload buyer logo or avatar"
                    aspectRatio="1 / 1"
                    className="h-14 w-14 rounded-full shadow-none"
                  />
                  <p className="text-sm font-semibold leading-6 text-[#666666]">
                    {caseStudy.testimonial.buyer}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        ) : null}

        <div className="mt-10">
          <ProofGallery filters={proofAssets.filters} items={proofAssets.items} />
        </div>
      </Container>
    </section>
  );
}

function CaseRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#666666]">{label}</p>
      <p className="mt-2 text-base leading-7 text-[#111111]">{value}</p>
    </div>
  );
}
