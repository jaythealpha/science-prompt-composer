"use client";

import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  Atom,
  CheckCircle2,
  PenTool,
  Target,
  Workflow,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/components/providers";
import { UI, t } from "@/lib/i18n";
import type { ScienceCategory } from "@/lib/types";

const CATEGORIES: ScienceCategory[] = ["physics", "chemistry", "biology", "earth", "space"];

export function AboutContent() {
  const { lang } = useLanguage();

  const sections = [
    {
      icon: <Target className="h-4 w-4 text-primary" aria-hidden="true" />,
      title: t(UI.about.purposeTitle, lang),
      body: t(UI.about.purpose, lang),
    },
    {
      icon: <Workflow className="h-4 w-4 text-primary" aria-hidden="true" />,
      title: t(UI.about.workflowTitle, lang),
      body: t(UI.about.workflow, lang),
    },
    {
      icon: <AlertTriangle className="h-4 w-4 text-amber-500" aria-hidden="true" />,
      title: t(UI.about.limitsTitle, lang),
      body: t(UI.about.limits, lang),
    },
    {
      icon: <CheckCircle2 className="h-4 w-4 text-primary" aria-hidden="true" />,
      title: t(UI.about.accuracyTitle, lang),
      body: t(UI.about.accuracy, lang),
    },
    {
      icon: <PenTool className="h-4 w-4 text-primary" aria-hidden="true" />,
      title: t(UI.about.correctionTitle, lang),
      body: t(UI.about.correction, lang),
    },
  ];

  return (
    <div className="space-y-6">
      <header className="max-w-2xl">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          {t(UI.about.title, lang)}
        </h1>
      </header>

      {sections.slice(0, 2).map((section) => (
        <Card key={section.title}>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              {section.icon}
              {section.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed text-muted-foreground">{section.body}</p>
          </CardContent>
        </Card>
      ))}

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <Atom className="h-4 w-4 text-primary" aria-hidden="true" />
            {t(UI.about.categoriesTitle, lang)}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <Badge key={c} variant="outline" className="text-sm">
                {t(UI.category[c], lang)}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {sections.slice(2).map((section) => (
        <Card key={section.title}>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              {section.icon}
              {section.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed text-muted-foreground">{section.body}</p>
          </CardContent>
        </Card>
      ))}

      <div className="pt-2">
        <Button asChild>
          <Link href="/">
            {t(UI.about.backToGenerator, lang)}
            <ArrowRight aria-hidden="true" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
