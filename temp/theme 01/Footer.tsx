"use client";

import { ArrowUp } from "lucide-react";
import { Container } from "@/components/Container";
import { CompanyData, FooterData } from "@/data/templateData";

export function Footer({ company, footer }: { company: CompanyData; footer: FooterData }) {
  return (
    <footer className="border-t border-[#E5E5E5] bg-[#111111] py-12 text-white">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[1.2fr_2fr_0.5fr]">
          <div>
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-sm font-semibold text-[#111111]">
                {company.logoText.slice(0, 2)}
              </span>
              <span className="text-base font-semibold">{company.logoText}</span>
            </div>
            <p className="mt-5 max-w-sm text-sm leading-7 text-white/68">{company.description}</p>
            <div className="mt-5 space-y-2 text-sm leading-6 text-white/72">
              <p>{company.address}</p>
              <a href={company.emailHref} className="block hover:text-white">
                {company.email}
              </a>
              <p>{company.phone}</p>
              <p>{company.certifications.join(" / ")}</p>
            </div>
          </div>

          <div className="grid gap-8 sm:grid-cols-3">
            {footer.columns.map((column) => (
              <div key={column.title}>
                <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-white/48">
                  {column.title}
                </h3>
                <div className="mt-4 grid gap-3">
                  {column.links.map((link) => (
                    <a key={link.label} href={link.href} className="text-sm text-white/72 transition hover:text-white">
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="flex lg:justify-end">
            <a
              href="#top"
              className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/20 text-white transition hover:bg-white hover:text-[#111111]"
              aria-label={footer.backToTopLabel}
            >
              <ArrowUp className="h-5 w-5" />
            </a>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-white/12 pt-6 text-sm text-white/52 sm:flex-row sm:items-center sm:justify-between">
          <p>{footer.copyright}</p>
          <div className="flex gap-5">
            {company.socialLinks.map((link) => (
              <a key={link.label} href={link.href} className="hover:text-white">
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </Container>
    </footer>
  );
}
