"use client";

import HeroBase from "./HeroBase";
import type { HeroBaseProps } from "./HeroBase";

export function HeroClassic(props: Omit<HeroBaseProps, "layout">) {
  return <HeroBase {...props} layout="classic" />;
}
