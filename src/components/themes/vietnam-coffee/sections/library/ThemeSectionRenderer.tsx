"use client";

import React from "react";
import type { CustomSectionContent, ThemeParams, ThemeSectionOrderItem } from "@/types";
import HeroSection from "../../HeroSection";
import LeadMagnetSection from "../../LeadMagnetSection";
import ProblemSolution from "../../ProblemSolution";
import ProductsServices from "../../ProductsServices";
import Testimonials from "../../Testimonials";
import WhyChooseUsSection from "../../WhyChooseUsSection";
import {
  BuyerProblemSection,
  FaqSection,
  FinalCtaSection,
  ProcessSection,
  ProofSection,
  SolutionOverviewSection,
  TargetBuyersSection,
  TrustBarSection,
} from "./LibrarySections";
import { getSectionDefinition } from "./registry";

interface ThemeSectionRendererProps {
  section: ThemeSectionOrderItem;
  theme: ThemeParams;
  content: Record<string, any>;
  onHeroContentUpdate?: (content: any) => void;
}

function getCustomContent(section: ThemeSectionOrderItem, content: Record<string, any>): CustomSectionContent {
  const custom = content.customSections?.[section.id] as CustomSectionContent | undefined;
  const definition = getSectionDefinition(section.type);
  return {
    ...(definition?.defaultContent || {}),
    ...(custom || {}),
    type: section.type,
  };
}

export default function ThemeSectionRenderer({ section, theme, content, onHeroContentUpdate }: ThemeSectionRendererProps) {
  if (!section.enabled) return null;

  switch (section.type) {
    case "hero":
      return <HeroSection theme={theme} content={content.hero} onContentUpdate={onHeroContentUpdate} />;
    case "problemSolution":
      return (
        <ProblemSolution
          theme={theme}
          content={{
            about: content.about,
            problems: content.problems,
            solutions: content.solutions,
            cta: content.cta,
          }}
        />
      );
    case "leadMagnet":
      return <LeadMagnetSection theme={theme} content={content.leadMagnet} />;
    case "products":
      return <ProductsServices theme={theme} content={content.products} />;
    case "whyChooseUs":
      return <WhyChooseUsSection theme={theme} content={content.whyChooseUs} />;
    case "testimonials":
      return <Testimonials theme={theme} content={content.testimonials} />;
    case "trustBar":
      return <TrustBarSection theme={theme} content={getCustomContent(section, content)} />;
    case "targetBuyers":
      return <TargetBuyersSection theme={theme} content={getCustomContent(section, content)} />;
    case "buyerProblem":
      return <BuyerProblemSection theme={theme} content={getCustomContent(section, content)} />;
    case "solutionOverview":
      return <SolutionOverviewSection theme={theme} content={getCustomContent(section, content)} />;
    case "process":
      return <ProcessSection theme={theme} content={getCustomContent(section, content)} />;
    case "proof":
      return <ProofSection theme={theme} content={getCustomContent(section, content)} />;
    case "faq":
      return <FaqSection theme={theme} content={getCustomContent(section, content)} />;
    case "finalCta":
      return <FinalCtaSection theme={theme} content={getCustomContent(section, content)} />;
    default:
      return null;
  }
}
