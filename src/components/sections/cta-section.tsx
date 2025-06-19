import Link from "next/link";
import { motion } from "motion/react";
import { siteConfig } from "@/lib/config";

export function CTASection() {
  const { ctaSection } = siteConfig;

  return (
    <section
      id="cta"
      className="flex flex-col items-center justify-center w-full"
    >
      <div className="w-full">
        <div className="h-[400px] md:h-[400px] overflow-hidden shadow-xl w-full border border-border rounded-xl bg-gradient-to-r from-[#FF9966] to-[#FF7722] dark:from-[#662900] dark:to-[#FF5500] relative z-20">
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-center opacity-20"></div>
          <div className="absolute inset-0 -top-32 md:-top-40 flex flex-col items-center justify-center">
            <h1 className="text-white text-4xl md:text-7xl font-medium tracking-tighter max-w-xs md:max-w-xl text-center">
              {ctaSection.title}
            </h1>
            <div className="absolute bottom-10 flex flex-col items-center justify-center gap-2">
              <Link
                href={ctaSection.button.href}
                className="bg-white text-[#FF5500] font-semibold text-sm h-10 w-fit px-6 rounded-full flex items-center justify-center shadow-md hover:bg-[#FFF0E6] transition-colors"
              >
                {ctaSection.button.text}
              </Link>
              <span className="text-white/90 text-sm">{ctaSection.subtext}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
