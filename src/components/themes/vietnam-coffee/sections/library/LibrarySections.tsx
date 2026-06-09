"use client";

import React from "react";
import {
  ArrowRight,
  Building2,
  CheckCircle,
  HelpCircle,
  PackageCheck,
  SearchCheck,
  ShieldCheck,
  Ship,
  Store,
  type LucideIcon,
} from "lucide-react";
import type { CustomSectionContent, ThemeParams } from "@/types";

interface LibrarySectionProps {
  theme: ThemeParams;
  content: CustomSectionContent;
}

const icons: Record<string, LucideIcon> = {
  Building2,
  CheckCircle,
  HelpCircle,
  PackageCheck,
  SearchCheck,
  ShieldCheck,
  Ship,
  Store,
};

function getIcon(name?: string) {
  return icons[name || "CheckCircle"] || CheckCircle;
}

function sectionStyle(theme: ThemeParams, content: CustomSectionContent, fallback = "#FFFFFF") {
  return {
    backgroundColor: content.backgroundColor || fallback,
    color: content.textColor || theme.colors?.text || "#2D3748",
    fontFamily: theme.typography?.fontFamily || "Inter",
  };
}

function Container({ theme, children }: { theme: ThemeParams; children: React.ReactNode }) {
  return (
    <div
      className="mx-auto px-4"
      style={{ maxWidth: theme.layout?.containerWidth || "1200px" }}
    >
      {children}
    </div>
  );
}

function Badge({ theme, children }: { theme: ThemeParams; children?: React.ReactNode }) {
  if (!children) return null;
  return (
    <div
      className="mb-4 inline-flex rounded-full px-3 py-1 text-sm font-medium"
      style={{
        backgroundColor: `${theme.colors?.primary || "#8B4513"}14`,
        color: theme.colors?.primary || "#8B4513",
      }}
    >
      {children}
    </div>
  );
}

function SectionHeader({ theme, content, centered = true }: LibrarySectionProps & { centered?: boolean }) {
  return (
    <div className={centered ? "mx-auto mb-12 max-w-3xl text-center" : "mb-10 max-w-3xl"}>
      <Badge theme={theme}>{content.badge}</Badge>
      <h2
        className="mb-4 text-3xl font-bold md:text-4xl"
        style={{ color: theme.colors?.primary || "#8B4513" }}
      >
        {content.title}
      </h2>
      {content.description && (
        <p className="text-lg leading-relaxed opacity-80">{content.description}</p>
      )}
    </div>
  );
}

export function TrustBarSection({ theme, content }: LibrarySectionProps) {
  const items = content.items || [];
  return (
    <section className="border-y py-8" style={sectionStyle(theme, content, "#FFFFFF")}>
      <Container theme={theme}>
        <div className="grid gap-6 md:grid-cols-[1.4fr_repeat(3,1fr)] md:items-center">
          <h2 className="text-xl font-semibold" style={{ color: theme.colors?.primary || "#8B4513" }}>
            {content.title}
          </h2>
          {items.map((item, index) => (
            <div key={item.id || index} className="text-left md:text-center">
              <div className="text-3xl font-bold" style={{ color: theme.colors?.accent || "#CD853F" }}>
                {item.value}
              </div>
              <div className="text-sm opacity-75">{item.label}</div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

export function TargetBuyersSection({ theme, content }: LibrarySectionProps) {
  return (
    <section className="py-20" style={sectionStyle(theme, content, "#F8F9FA")}>
      <Container theme={theme}>
        <SectionHeader theme={theme} content={content} />
        <div className="grid gap-6 md:grid-cols-3">
          {(content.items || []).map((item, index) => {
            const Icon = getIcon(item.icon);
            return (
              <div key={item.id || index} className="rounded-lg border bg-white p-6 shadow-sm">
                <Icon className="mb-5 h-9 w-9" style={{ color: theme.colors?.primary || "#8B4513" }} />
                <h3 className="mb-2 text-xl font-semibold">{item.title}</h3>
                <p className="leading-relaxed opacity-75">{item.description}</p>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

export function BuyerProblemSection({ theme, content }: LibrarySectionProps) {
  return (
    <section className="py-20" style={sectionStyle(theme, content, "#FFFFFF")}>
      <Container theme={theme}>
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <SectionHeader theme={theme} content={content} centered={false} />
          <div className="space-y-4">
            {(content.items || []).map((item, index) => (
              <div key={item.id || index} className="rounded-lg border p-5">
                <h3 className="mb-2 text-lg font-semibold">{item.title}</h3>
                <p className="opacity-75">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

export function SolutionOverviewSection({ theme, content }: LibrarySectionProps) {
  return (
    <section className="py-20" style={sectionStyle(theme, content, "#F8F9FA")}>
      <Container theme={theme}>
        <SectionHeader theme={theme} content={content} />
        <div className="grid gap-6 md:grid-cols-3">
          {(content.items || []).map((item, index) => {
            const Icon = getIcon(item.icon);
            return (
              <div key={item.id || index} className="rounded-lg bg-white p-7 shadow-sm">
                <Icon className="mb-5 h-10 w-10" style={{ color: theme.colors?.accent || "#CD853F" }} />
                <h3 className="mb-3 text-xl font-semibold">{item.title}</h3>
                <p className="leading-relaxed opacity-75">{item.description}</p>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

export function ProcessSection({ theme, content }: LibrarySectionProps) {
  return (
    <section className="py-20" style={sectionStyle(theme, content, "#FFFFFF")}>
      <Container theme={theme}>
        <SectionHeader theme={theme} content={content} />
        <div className="grid gap-5 md:grid-cols-4">
          {(content.items || []).map((item, index) => (
            <div key={item.id || index} className="rounded-lg border p-6">
              <div className="mb-5 text-4xl font-bold" style={{ color: theme.colors?.primary || "#8B4513" }}>
                {item.value || String(index + 1).padStart(2, "0")}
              </div>
              <h3 className="mb-2 text-lg font-semibold">{item.title}</h3>
              <p className="text-sm leading-relaxed opacity-75">{item.description}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

export function ProofSection({ theme, content }: LibrarySectionProps) {
  const galleryFirst = content.variant === "galleryFirst";
  const gallery = (
    <div className="grid gap-4 sm:grid-cols-3">
      {(content.items || []).map((item, index) => (
        <div key={item.id || index} className="overflow-hidden rounded-lg border bg-white">
          <img src={item.image || "https://placehold.co/640x420?text=Proof"} alt={item.title || "Proof"} className="h-44 w-full object-cover" />
          <div className="p-4">
            <h3 className="font-semibold">{item.title}</h3>
            <p className="mt-1 text-sm opacity-70">{item.description}</p>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <section className="py-20" style={sectionStyle(theme, content, "#F8F9FA")}>
      <Container theme={theme}>
        {galleryFirst ? gallery : <SectionHeader theme={theme} content={content} />}
        {galleryFirst ? <SectionHeader theme={theme} content={content} /> : gallery}
      </Container>
    </section>
  );
}

export function FaqSection({ theme, content }: LibrarySectionProps) {
  return (
    <section className="py-20" style={sectionStyle(theme, content, "#FFFFFF")}>
      <Container theme={theme}>
        <SectionHeader theme={theme} content={content} />
        <div className="mx-auto max-w-3xl space-y-4">
          {(content.faqs || []).map((faq, index) => (
            <div key={faq.id || index} className="rounded-lg border p-5">
              <h3 className="mb-2 flex items-center gap-2 font-semibold">
                <HelpCircle className="h-5 w-5" style={{ color: theme.colors?.primary || "#8B4513" }} />
                {faq.question}
              </h3>
              <p className="leading-relaxed opacity-75">{faq.answer}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

export function FinalCtaSection({ theme, content }: LibrarySectionProps) {
  const centered = content.variant === "centeredForm";
  return (
    <section className="py-20" style={sectionStyle(theme, content, theme.colors?.primary || "#8B4513")}>
      <Container theme={theme}>
        <div className={`grid gap-8 ${centered ? "text-center" : "lg:grid-cols-[1fr_420px] lg:items-center"}`}>
          <div className={centered ? "mx-auto max-w-3xl" : ""}>
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">{content.title}</h2>
            <p className="mb-7 text-lg opacity-85">{content.description}</p>
            <div className="flex flex-wrap gap-3">
              <a className="inline-flex items-center rounded-md bg-white px-5 py-3 font-semibold text-gray-900" href="#contact">
                {content.buttonText || "Contact us"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
              {content.secondaryButtonText && (
                <a className="inline-flex items-center rounded-md border border-white/50 px-5 py-3 font-semibold" href="#products">
                  {content.secondaryButtonText}
                </a>
              )}
            </div>
          </div>
          {!centered && (
            <div className="rounded-lg bg-white p-6 text-gray-900 shadow-lg">
              <div className="mb-3 text-lg font-semibold">Quick request</div>
              <div className="space-y-3">
                <div className="h-11 rounded-md bg-gray-100 px-3 py-3 text-sm text-gray-500">Name / company</div>
                <div className="h-11 rounded-md bg-gray-100 px-3 py-3 text-sm text-gray-500">Email / phone</div>
                <div className="h-24 rounded-md bg-gray-100 px-3 py-3 text-sm text-gray-500">Product requirements</div>
              </div>
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
