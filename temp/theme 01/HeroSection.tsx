import { HeroData } from "@/data/templateData";
import { HeroCentered } from "@/components/sections/hero/HeroCentered";
import { HeroClassic } from "@/components/sections/hero/HeroClassic";

export function HeroSection({ hero }: { hero: HeroData }) {
  if (hero.variant === "centered") return <HeroCentered hero={hero} />;
  return <HeroClassic hero={hero} />;
}
