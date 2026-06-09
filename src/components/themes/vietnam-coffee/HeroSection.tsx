"use client";

import { HeroVariantSection } from "./sections/hero";
import type { ThemeParams } from "@/types";
import type { HeroContent } from "./sections/hero";

interface HeroSectionProps {
  theme: ThemeParams;
  content: HeroContent;
  onContentUpdate?: (content: HeroContent) => void;
}

const HeroSection = (props: HeroSectionProps) => {
  return <HeroVariantSection {...props} />;
};

export default HeroSection;
