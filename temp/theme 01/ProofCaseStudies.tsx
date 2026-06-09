import { CaseStudy, ProofAsset } from "@/data/templateData";
import { ProofCaseStudyWithGallery } from "@/components/sections/proof/ProofCaseStudyWithGallery";
import { ProofGalleryFirst } from "@/components/sections/proof/ProofGalleryFirst";

export function ProofCaseStudies({
  proofAssets,
  caseStudies,
}: {
  proofAssets: {
    variant: "caseStudyWithGallery" | "galleryFirst";
    eyebrow: string;
    title: string;
    subtitle: string;
    filters: Array<"All" | ProofAsset["category"]>;
    items: ProofAsset[];
  };
  caseStudies: CaseStudy[];
}) {
  if (proofAssets.variant === "galleryFirst") {
    return <ProofGalleryFirst proofAssets={proofAssets} caseStudies={caseStudies} />;
  }
  return <ProofCaseStudyWithGallery proofAssets={proofAssets} caseStudies={caseStudies} />;
}
