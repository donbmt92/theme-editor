import type { CustomSectionContent, SectionType, ThemeSectionOrderItem } from "@/types";

export interface SectionDefinition {
  type: SectionType;
  label: string;
  description: string;
  defaultContent: CustomSectionContent;
}

export const DEFAULT_BODY_SECTION_ORDER: ThemeSectionOrderItem[] = [
  { id: "hero", type: "hero", enabled: true, core: true },
  { id: "problem-solution", type: "problemSolution", enabled: true, core: true },
  { id: "lead-magnet", type: "leadMagnet", enabled: true, core: true },
  { id: "products", type: "products", enabled: true, core: true },
  { id: "why-choose-us", type: "whyChooseUs", enabled: true, core: true },
  { id: "testimonials", type: "testimonials", enabled: true, core: true },
];

export const CORE_SECTION_TYPES: SectionType[] = [
  "hero",
  "problemSolution",
  "leadMagnet",
  "products",
  "whyChooseUs",
  "testimonials",
];

export function isCoreSection(type: SectionType) {
  return CORE_SECTION_TYPES.includes(type);
}

export const SECTION_LIBRARY: SectionDefinition[] = [
  {
    type: "trustBar",
    label: "Trust Bar",
    description: "Compact credibility strip with stats and trust signals.",
    defaultContent: {
      type: "trustBar",
      title: "Trusted by export-ready businesses",
      items: [
        { value: "15+", label: "Years export experience" },
        { value: "500+", label: "Shipments supported" },
        { value: "98%", label: "On-time documentation" },
      ],
    },
  },
  {
    type: "targetBuyers",
    label: "Target Buyers",
    description: "Show who the offer is built for.",
    defaultContent: {
      type: "targetBuyers",
      title: "Built for serious buyers",
      description: "Clear value for importers, distributors, private-label brands, and sourcing teams.",
      items: [
        { icon: "Store", title: "Importers", description: "Reliable supply and export documentation." },
        { icon: "Building2", title: "Distributors", description: "Consistent quality for repeat orders." },
        { icon: "PackageCheck", title: "Private label", description: "Flexible packaging and OEM support." },
      ],
    },
  },
  {
    type: "buyerProblem",
    label: "Buyer Problem",
    description: "Focused pain-point section before presenting the solution.",
    defaultContent: {
      type: "buyerProblem",
      badge: "Buyer challenge",
      title: "Buying from overseas should not feel risky",
      description: "Most buyers struggle with unclear quality, slow samples, weak documentation, and limited visibility after deposit.",
      items: [
        { title: "Unclear quality", description: "Samples and production batches do not always match." },
        { title: "Slow paperwork", description: "Export documents are often prepared too late." },
        { title: "Low visibility", description: "Buyers need clearer production and shipment updates." },
      ],
    },
  },
  {
    type: "solutionOverview",
    label: "Solution Overview",
    description: "A concise capability overview.",
    defaultContent: {
      type: "solutionOverview",
      badge: "Our approach",
      title: "A cleaner path from sample to shipment",
      description: "We combine sourcing, quality control, documentation, and logistics support into one practical workflow.",
      items: [
        { icon: "SearchCheck", title: "Source", description: "Match products to buyer requirements." },
        { icon: "ShieldCheck", title: "Verify", description: "Check quality before production and shipment." },
        { icon: "Ship", title: "Deliver", description: "Coordinate documents, packing, and export timeline." },
      ],
    },
  },
  {
    type: "process",
    label: "Process",
    description: "Step-by-step buying or export workflow.",
    defaultContent: {
      type: "process",
      title: "Simple export workflow",
      description: "A transparent process from the first brief to the final shipment.",
      items: [
        { value: "01", title: "Brief", description: "Confirm product, specs, target market, and timeline." },
        { value: "02", title: "Sample", description: "Prepare samples and align quality expectations." },
        { value: "03", title: "Produce", description: "Track production, QC, packing, and documentation." },
        { value: "04", title: "Ship", description: "Coordinate export handoff and post-shipment updates." },
      ],
    },
  },
  {
    type: "proof",
    label: "Proof",
    description: "Case study or gallery-first proof section.",
    defaultContent: {
      type: "proof",
      variant: "caseStudyWithGallery",
      badge: "Proof",
      title: "Export-ready results buyers can verify",
      description: "Use this section for factory proof, shipment evidence, certificates, or a compact case study.",
      items: [
        { image: "https://placehold.co/640x420?text=Factory", title: "Factory audit", description: "Verified production capability." },
        { image: "https://placehold.co/640x420?text=QC", title: "Quality check", description: "Documented inspection process." },
        { image: "https://placehold.co/640x420?text=Shipment", title: "Shipment", description: "Export packing and delivery handoff." },
      ],
    },
  },
  {
    type: "faq",
    label: "FAQ",
    description: "Common buyer questions.",
    defaultContent: {
      type: "faq",
      title: "Frequently asked questions",
      description: "Give buyers quick answers before they contact your team.",
      faqs: [
        { question: "What is your minimum order quantity?", answer: "MOQ depends on product type and packaging. We can confirm it after reviewing your brief." },
        { question: "Can you support export documents?", answer: "Yes. We can help prepare commercial documents and coordinate required certificates." },
        { question: "Do you offer samples?", answer: "Yes. Samples can be arranged before production so quality and specs are aligned." },
      ],
    },
  },
  {
    type: "finalCta",
    label: "Final CTA",
    description: "Closing call-to-action with optional form-focused layout.",
    defaultContent: {
      type: "finalCta",
      variant: "formRight",
      title: "Ready to discuss your next order?",
      description: "Share your product requirements and we will help map the next practical step.",
      buttonText: "Request consultation",
      secondaryButtonText: "View products",
    },
  },
];

export function getSectionDefinition(type: SectionType) {
  return SECTION_LIBRARY.find((section) => section.type === type);
}

export function createSectionId(type: SectionType) {
  return `${type}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}
