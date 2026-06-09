"use client";

import { Container } from "@/components/Container";
import { ProofGallery } from "@/components/ProofGallery";
import { SectionHeader } from "@/components/SectionHeader";
import { CaseStudy, ProofAsset } from "@/data/templateData";

export function ProofGalleryFirst({
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
  return (
    <section id="case-studies" className="section-shell bg-white">
      <Container>
        <SectionHeader
          eyebrow={proofAssets.eyebrow}
          title={proofAssets.title}
          subtitle={proofAssets.subtitle}
          align="center"
        />
        <div className="mt-12">
          <ProofGallery filters={proofAssets.filters} items={proofAssets.items} />
        </div>
        {caseStudies[0] ? (
          <div className="mt-8 rounded-[24px] border border-[#E5E5E5] bg-[#F8F8F7] p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#0A66C2]">
              {caseStudies[0].buyerType}
            </p>
            <h3 className="mt-3 text-3xl font-semibold text-[#111111]">{caseStudies[0].title}</h3>
            <p className="mt-4 text-base leading-7 text-[#666666]">{caseStudies[0].result}</p>
          </div>
        ) : null}
      </Container>
    </section>
  );
}
