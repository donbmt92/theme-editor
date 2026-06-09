"use client";

import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { CompanyData, HeaderData } from "@/data/templateData";
import { cn } from "@/lib/utils";

export function Header({
  company,
  header,
}: {
  company: CompanyData;
  header: HeaderData;
}) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b transition duration-300",
        scrolled
          ? "border-[#E5E5E5] bg-white/82 shadow-sm backdrop-blur-xl"
          : "border-transparent bg-white/70 backdrop-blur-md",
      )}
    >
      <div className="mx-auto flex h-20 max-w-[1200px] items-center justify-between px-5 sm:px-6 lg:px-8">
        <a href="#top" className="flex items-center gap-3" aria-label={company.name}>
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#111111] text-sm font-semibold text-white">
            {company.logoText.slice(0, 2)}
          </span>
          <span className="text-base font-semibold tracking-normal text-[#111111]">
            {company.logoText}
          </span>
        </a>

        <nav className="hidden items-center gap-8 lg:flex">
          {header.navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-[#666666] transition hover:text-[#111111]"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <a
            href="#contact"
            className="rounded-full bg-[#111111] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0A66C2]"
          >
            {header.cta}
          </a>
        </div>

        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#E5E5E5] text-[#111111] lg:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-label="Toggle navigation"
          aria-expanded={open}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open ? (
        <div className="border-t border-[#E5E5E5] bg-white px-5 py-5 lg:hidden">
          <nav className="mx-auto flex max-w-[1200px] flex-col gap-2">
            {header.navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-2xl px-4 py-3 text-base font-medium text-[#111111] transition hover:bg-[#F8F8F7]"
              >
                {item.label}
              </a>
            ))}
            <a
              href="#contact"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-2xl bg-[#111111] px-4 py-3 text-center text-base font-semibold text-white"
            >
              {header.cta}
            </a>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
