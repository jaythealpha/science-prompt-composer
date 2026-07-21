"use client";

import * as React from "react";
import {
  AlertTriangle,
  ArrowUpRight,
  Atom,
  Ban,
  Download,
  FileJson,
  FileText,
  Info,
  Layers,
  Lightbulb,
  ListTree,
  Minimize2,
  RefreshCw,
  Save,
  ScrollText,
  Sparkles,
  Tag,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CopyButton } from "@/components/copy-button";
import { OutputSection, PromptBlock } from "./output-section";
import { VideoPanel } from "./video-panel";
import { useLanguage } from "@/components/providers";
import { UI, t } from "@/lib/i18n";
import {
  buildJson,
  buildMarkdown,
  buildPlainText,
  downloadFile,
  slugifyForFile,
} from "@/lib/export";
import type { GenerationResult, GenerationSettings } from "@/lib/types";
import { getPhenomenonBySlug, PHENOMENA } from "@/lib/phenomena";

interface OutputPanelProps {
  input: string;
  settings: GenerationSettings;
  result: GenerationResult | null;
  onRegenerate: () => void;
  onSave: () => void;
  onOpenSlug: (slug: string) => void;
  saved: boolean;
  isGenerating: boolean;
}

function CategoryBadge({ result }: { result: GenerationResult }) {
  const { lang } = useLanguage();
  const curated = result.matchConfidence === "profile";
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Badge variant="accent" className="gap-1">
        <Atom className="h-3 w-3" aria-hidden="true" />
        {t(UI.output.detected, lang)}: {t(UI.category[result.detectedCategory], lang)}
      </Badge>
      <Badge variant={curated ? "default" : "outline"} className="gap-1">
        {curated ? (
          <Sparkles className="h-3 w-3" aria-hidden="true" />
        ) : (
          <Info className="h-3 w-3" aria-hidden="true" />
        )}
        {curated ? t(UI.output.curated, lang) : t(UI.output.generalTemplate, lang)}
      </Badge>
    </div>
  );
}

function GeneralTemplateNote({
  result,
  onOpenSlug,
}: {
  result: GenerationResult;
  onOpenSlug: (slug: string) => void;
}) {
  const { lang } = useLanguage();
  const related = result.relatedSlugs
    .map((slug) => getPhenomenonBySlug(slug))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  return (
    <div className="rounded-xl border border-border bg-secondary/40 p-4">
      <p className="flex items-start gap-2 text-sm leading-relaxed text-muted-foreground">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
        <span>{t(UI.output.fallbackNote, lang)}</span>
      </p>
      {related.length > 0 && (
        <div className="mt-3.5">
          <div className="mb-2 text-xs font-medium text-foreground">
            {t(UI.output.relatedTitle, lang)}
          </div>
          <div className="flex flex-wrap gap-2">
            {related.map((p) => (
              <button
                key={p.slug}
                type="button"
                onClick={() => onOpenSlug(p.slug)}
                className="inline-flex items-center gap-1 rounded-full border border-border bg-background/70 px-3 py-1 text-xs font-medium text-foreground transition-colors hover:border-primary/40 hover:bg-primary/10 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
              >
                {t(p.title, lang)}
                <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function EmptyState() {
  const { lang } = useLanguage();
  const capabilities = [
    { icon: <ScrollText className="h-4 w-4" aria-hidden="true" />, label: t(UI.output.cap1, lang) },
    { icon: <ListTree className="h-4 w-4" aria-hidden="true" />, label: t(UI.output.cap2, lang) },
    { icon: <Layers className="h-4 w-4" aria-hidden="true" />, label: t(UI.output.cap3, lang) },
  ];
  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center justify-center gap-6 px-6 py-16 text-center">
        <div className="relative flex h-20 w-20 items-center justify-center">
          <span className="absolute inset-0 rounded-full bg-primary/10 blur-xl" aria-hidden="true" />
          <span className="absolute inset-0 animate-[spin_12s_linear_infinite] rounded-full border border-dashed border-primary/30" aria-hidden="true" />
          <Atom className="relative h-9 w-9 text-primary" aria-hidden="true" />
        </div>
        <div className="space-y-1.5">
          <p className="text-base font-medium text-foreground">{t(UI.output.emptyTitle, lang)}</p>
          <p className="text-sm text-muted-foreground">{t(UI.output.emptySubtitle, lang)}</p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2">
          {capabilities.map((cap) => (
            <span
              key={cap.label}
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary/50 px-3 py-1.5 text-xs font-medium text-muted-foreground"
            >
              <span className="text-primary">{cap.icon}</span>
              {cap.label}
            </span>
          ))}
        </div>
        <p className="max-w-md text-balance text-xs leading-relaxed text-muted-foreground/80">
          {t(UI.output.coverage, lang).replace("{n}", String(PHENOMENA.length))}
        </p>
      </CardContent>
    </Card>
  );
}

function CauseChain({ result }: { result: GenerationResult }) {
  const { lang } = useLanguage();
  const rows = [
    { label: t(UI.output.cause, lang), value: result.cause },
    { label: t(UI.output.mechanism, lang), value: result.mechanism },
    { label: t(UI.output.result, lang), value: result.result },
  ];
  return (
    <div className="grid gap-2.5">
      {rows.map((row) => (
        <div key={row.label} className="rounded-lg border border-border bg-background/60 p-3">
          <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-primary">{row.label}</div>
          <p className="text-sm leading-relaxed text-foreground">{row.value}</p>
        </div>
      ))}
    </div>
  );
}

export function OutputPanel({
  input,
  settings,
  result,
  onRegenerate,
  onSave,
  onOpenSlug,
  saved,
  isGenerating,
}: OutputPanelProps) {
  const { lang } = useLanguage();

  if (!result) {
    return <EmptyState />;
  }

  const payload = { input, settings, result };
  const fileBase = slugifyForFile(result.title);

  const allText = buildPlainText(payload);

  const exportActions = [
    {
      key: "txt",
      icon: <FileText aria-hidden="true" />,
      label: t(UI.actions.exportTxt, lang),
      run: () => downloadFile(`${fileBase}.txt`, buildPlainText(payload), "text/plain;charset=utf-8"),
    },
    {
      key: "md",
      icon: <ScrollText aria-hidden="true" />,
      label: t(UI.actions.exportMd, lang),
      run: () => downloadFile(`${fileBase}.md`, buildMarkdown(payload), "text/markdown;charset=utf-8"),
    },
    {
      key: "json",
      icon: <FileJson aria-hidden="true" />,
      label: t(UI.actions.exportJson, lang),
      run: () => downloadFile(`${fileBase}.json`, buildJson(payload), "application/json;charset=utf-8"),
    },
  ];

  return (
    <div className="space-y-4">
      {/* Sticky action toolbar */}
      <div className="sticky top-16 z-20 rounded-xl border border-border bg-card/95 p-2.5 shadow-sm backdrop-blur">
        <div className="flex flex-wrap items-center gap-2">
          <CopyButton
            value={allText}
            label={t(UI.actions.copyAll, lang)}
            copiedLabel={t(UI.actions.copied, lang)}
            variant="secondary"
          />
          <CopyButton
            value={result.finalPrompt}
            label={t(UI.actions.copyFinal, lang)}
            copiedLabel={t(UI.actions.copied, lang)}
            variant="secondary"
          />
          <div className="mx-0.5 hidden h-6 w-px bg-border sm:block" aria-hidden="true" />
          <Button variant="ghost" size="sm" onClick={onSave} aria-label={t(UI.actions.save, lang)}>
            <Save aria-hidden="true" />
            <span>{saved ? t(UI.actions.saved, lang) : t(UI.actions.save, lang)}</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onRegenerate}
            disabled={isGenerating}
            aria-label={t(UI.actions.regenerate, lang)}
          >
            <RefreshCw aria-hidden="true" />
            <span>{t(UI.actions.regenerate, lang)}</span>
          </Button>
          <div className="ml-auto flex flex-wrap items-center gap-1">
            {exportActions.map((action) => (
              <Button
                key={action.key}
                variant="ghost"
                size="sm"
                onClick={action.run}
                aria-label={action.label}
              >
                {action.icon}
                <span className="hidden md:inline">{action.label}</span>
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-1 px-1">
        <h2 className="text-xl font-semibold tracking-tight">{result.title}</h2>
        <CategoryBadge result={result} />
      </div>

      {result.matchConfidence === "fallback" && (
        <GeneralTemplateNote result={result} onOpenSlug={onOpenSlug} />
      )}

      <Tabs defaultValue="overview" className="spc-fade-up">
        <TabsList className="flex w-full flex-wrap">
          <TabsTrigger value="overview" className="flex-1">
            {t(UI.tabs.overview, lang)}
          </TabsTrigger>
          <TabsTrigger value="prompt" className="flex-1">
            {t(UI.tabs.prompt, lang)}
          </TabsTrigger>
          <TabsTrigger value="infographic" className="flex-1">
            {t(UI.tabs.infographic, lang)}
          </TabsTrigger>
          <TabsTrigger value="simplified" className="flex-1">
            {t(UI.tabs.simplified, lang)}
          </TabsTrigger>
          <TabsTrigger value="video" className="flex-1">
            {t(UI.tabs.video, lang)}
          </TabsTrigger>
        </TabsList>

        {/* Overview */}
        <TabsContent value="overview" className="space-y-4">
          <OutputSection
            title={t(UI.output.overviewTitle, lang)}
            copyValue={result.overview}
            icon={<Lightbulb className="h-4 w-4 text-primary" aria-hidden="true" />}
          >
            <p className="text-sm leading-relaxed text-foreground">{result.overview}</p>
          </OutputSection>

          <OutputSection title={`${t(UI.output.cause, lang)} · ${t(UI.output.mechanism, lang)} · ${t(UI.output.result, lang)}`}>
            <CauseChain result={result} />
          </OutputSection>

          <OutputSection
            title={t(UI.output.strategy, lang)}
            copyValue={result.visualizationStrategy}
          >
            <p className="text-sm leading-relaxed text-foreground">{result.visualizationStrategy}</p>
          </OutputSection>

          <OutputSection
            title={t(UI.output.visualElements, lang)}
            copyValue={result.visualElements.join("\n")}
            icon={<Layers className="h-4 w-4 text-primary" aria-hidden="true" />}
          >
            <ul className="grid gap-2 sm:grid-cols-2">
              {result.visualElements.map((el, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 rounded-lg border border-border bg-background/60 p-2.5 text-sm text-foreground"
                >
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/12 text-[11px] font-semibold text-primary">
                    {i + 1}
                  </span>
                  {el}
                </li>
              ))}
            </ul>
          </OutputSection>

          {settings.includeLabels && (
            <OutputSection
              title={t(UI.output.labels, lang)}
              copyValue={result.labels.join("\n")}
              icon={<Tag className="h-4 w-4 text-primary" aria-hidden="true" />}
            >
              <div className="flex flex-wrap gap-2">
                {result.labels.map((label, i) => (
                  <Badge key={i} variant="outline" className="text-[13px]">
                    {label}
                  </Badge>
                ))}
              </div>
            </OutputSection>
          )}

          {settings.includeExplanation && (
            <OutputSection
              title={t(UI.output.explanation, lang)}
              copyValue={result.explanationParagraph}
            >
              <p className="text-sm leading-relaxed text-foreground">{result.explanationParagraph}</p>
            </OutputSection>
          )}

          <OutputSection
            title={t(UI.output.cautions, lang)}
            icon={<AlertTriangle className="h-4 w-4 text-amber-500" aria-hidden="true" />}
            className="border-amber-500/25 bg-amber-500/5"
          >
            <p className="text-sm leading-relaxed text-foreground">{result.cautions}</p>
          </OutputSection>
        </TabsContent>

        {/* Final prompt */}
        <TabsContent value="prompt" className="space-y-4">
          <OutputSection
            title={t(UI.output.finalPrompt, lang)}
            copyValue={result.finalPrompt}
            icon={<ScrollText className="h-4 w-4 text-primary" aria-hidden="true" />}
          >
            <PromptBlock text={result.finalPrompt} />
          </OutputSection>

          {settings.includeNegativePrompt && (
            <OutputSection
              title={t(UI.output.negativePrompt, lang)}
              copyValue={result.negativePrompt}
              icon={<Ban className="h-4 w-4 text-destructive" aria-hidden="true" />}
            >
              <PromptBlock text={result.negativePrompt} />
            </OutputSection>
          )}
        </TabsContent>

        {/* Infographic */}
        <TabsContent value="infographic" className="space-y-4">
          {settings.includeInfographicPrompt ? (
            <OutputSection
              title={t(UI.output.infographicPrompt, lang)}
              copyValue={result.infographicPrompt}
              icon={<Layers className="h-4 w-4 text-primary" aria-hidden="true" />}
            >
              <PromptBlock text={result.infographicPrompt} />
            </OutputSection>
          ) : (
            <OutputSection title={t(UI.output.infographicPrompt, lang)}>
              <p className="text-sm text-muted-foreground">
                {t(UI.controls.includeInfographicPrompt, lang)} — {t(UI.controls.includeLabels, lang)}.
              </p>
            </OutputSection>
          )}
          <OutputSection
            title={t(UI.output.annotations, lang)}
            copyValue={result.annotations.join("\n")}
          >
            <ol className="space-y-2">
              {result.annotations.map((a, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-foreground">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/15 text-[11px] font-semibold text-accent">
                    {i + 1}
                  </span>
                  {a}
                </li>
              ))}
            </ol>
          </OutputSection>
        </TabsContent>

        {/* Simplified */}
        <TabsContent value="simplified" className="space-y-4">
          {settings.includeSimplifiedPrompt ? (
            <OutputSection
              title={t(UI.output.simplifiedPrompt, lang)}
              copyValue={result.simplifiedPrompt}
              icon={<Minimize2 className="h-4 w-4 text-primary" aria-hidden="true" />}
            >
              <PromptBlock text={result.simplifiedPrompt} />
            </OutputSection>
          ) : (
            <OutputSection title={t(UI.output.simplifiedPrompt, lang)}>
              <p className="text-sm text-muted-foreground">
                {t(UI.controls.includeSimplifiedPrompt, lang)}.
              </p>
            </OutputSection>
          )}
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={exportActions[0].run}>
              <Download aria-hidden="true" />
              {t(UI.actions.exportTxt, lang)}
            </Button>
            <Button variant="outline" size="sm" onClick={exportActions[1].run}>
              <Download aria-hidden="true" />
              {t(UI.actions.exportMd, lang)}
            </Button>
          </div>
        </TabsContent>

        {/* Video */}
        <TabsContent value="video">
          <VideoPanel input={input} result={result} settings={settings} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
