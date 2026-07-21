"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/components/providers";
import { UI, t } from "@/lib/i18n";
import { PHENOMENA } from "@/lib/phenomena";

export function ExamplesGallery() {
  const { lang } = useLanguage();

  return (
    <div>
      <header className="mb-8 max-w-2xl">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          {t(UI.examples.title, lang)}
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
          {t(UI.examples.subtitle, lang)}
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {PHENOMENA.map((p) => (
          <Card key={p.slug} className="flex flex-col">
            <CardHeader className="pb-3">
              <div className="mb-1.5">
                <Badge>{t(UI.category[p.category], lang)}</Badge>
              </div>
              <CardTitle className="text-base">{t(p.title, lang)}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col gap-4">
              <p className="text-sm leading-relaxed text-muted-foreground">
                {t(p.shortExplanation, lang)}
              </p>
              <div className="mt-auto space-y-3">
                <div className="rounded-lg border border-border bg-secondary/40 px-3 py-2">
                  <div className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                    {t(UI.examples.exampleInput, lang)}
                  </div>
                  <p className="mt-0.5 text-sm text-foreground">{t(p.exampleInput, lang)}</p>
                </div>
                <Button asChild variant="outline" size="sm" className="w-full">
                  <Link href={`/?slug=${p.slug}`}>
                    {t(UI.examples.open, lang)}
                    <ArrowRight aria-hidden="true" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
