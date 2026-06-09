"use client";

import HeroBase from "./HeroBase";
import type { HeroBaseProps } from "./HeroBase";

export function HeroCentered(props: Omit<HeroBaseProps, "layout">) {
  return <HeroBase {...props} layout="centered" />;
}
