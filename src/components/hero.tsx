"use client";

import { useLanguage } from "@/components/providers";
import { UI, t } from "@/lib/i18n";

export function Hero() {
  const { lang } = useLanguage();
  return (
    <section className="mb-8 max-w-2xl">
      <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
        {t(UI.hero.title, lang)}
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
        {t(UI.hero.subtitle, lang)}
      </p>
    </section>
  );
}
