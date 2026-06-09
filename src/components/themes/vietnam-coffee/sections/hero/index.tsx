"use client";

import { HeroCentered } from "./HeroCentered";
import { HeroClassic } from "./HeroClassic";
import type { HeroBaseProps } from "./HeroBase";

export type { HeroContent } from "./HeroBase";
export type HeroVariant = "classic" | "centered";

export function HeroVariantSection(props: Omit<HeroBaseProps, "layout">) {
  if (props.content.variant === "centered") {
    return <HeroCentered {...props} />;
  }

  return <HeroClassic {...props} />;
}
