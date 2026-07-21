"use client";

import * as React from "react";
import { ChevronDown, Sparkles, SlidersHorizontal, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { LabeledSelect } from "./labeled-select";
import { ToggleRow } from "./toggle-row";
import { useLanguage } from "@/components/providers";
import { UI, t } from "@/lib/i18n";
import { PHENOMENA } from "@/lib/phenomena";
import type {
  AspectRatio,
  CategorySetting,
  Complexity,
  GenerationSettings,
  LabelDensity,
  Language,
  VisualStyle,
} from "@/lib/types";
import { cn } from "@/lib/utils";

const EXAMPLE_SLUGS = [
  "aurora-borealis",
  "nuclear-fission",
  "lightning-formation",
  "plate-tectonics",
  "photosynthesis",
  "osmosis",
  "electrolysis",
  "dna-replication",
  "superconductivity",
  "black-hole-accretion",
  "greenhouse-effect",
  "volcanic-eruption",
];

interface InputPanelProps {
  input: string;
  setInput: (value: string) => void;
  settings: GenerationSettings;
  updateSetting: <K extends keyof GenerationSettings>(key: K, value: GenerationSettings[K]) => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

export function InputPanel({
  input,
  setInput,
  settings,
  updateSetting,
  onGenerate,
  isGenerating,
}: InputPanelProps) {
  const { lang } = useLanguage();
  const [advancedOpen, setAdvancedOpen] = React.useState(false);

  const examples = React.useMemo(
    () =>
      EXAMPLE_SLUGS.map((slug) => PHENOMENA.find((p) => p.slug === slug)).filter(
        (p): p is NonNullable<typeof p> => Boolean(p),
      ),
    [],
  );

  const categoryOptions = (["auto", "physics", "chemistry", "biology", "earth", "space"] as CategorySetting[]).map(
    (value) => ({ value, label: t(UI.category[value], lang) }),
  );
  const styleOptions = (["infographic", "cinematic", "photorealistic", "textbook", "futuristic"] as VisualStyle[]).map(
    (value) => ({ value, label: t(UI.style[value], lang) }),
  );
  const aspectOptions = (["16:9", "4:5", "1:1", "9:16"] as AspectRatio[]).map((value) => ({
    value,
    label: value,
  }));
  const complexityOptions = (["general", "student", "advanced"] as Complexity[]).map((value) => ({
    value,
    label: t(UI.complexity[value], lang),
  }));
  const densityOptions = (["minimal", "standard", "detailed"] as LabelDensity[]).map((value) => ({
    value,
    label: t(UI.density[value], lang),
  }));
  const languageOptions = (["en", "ko", "ja"] as Language[]).map((value) => ({
    value,
    label: t(UI.language[value], lang),
  }));

  const canGenerate = input.trim().length > 0 && !isGenerating;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter" && canGenerate) {
      e.preventDefault();
      onGenerate();
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="space-y-5 p-5">
        <div className="space-y-2">
          <Label htmlFor="phenomenon-input" className="text-sm font-semibold">
            {t(UI.input.label, lang)}
          </Label>
          <Textarea
            id="phenomenon-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t(UI.input.placeholder, lang)}
            className="min-h-[120px]"
            maxLength={600}
            aria-describedby="input-count"
          />
          <p id="input-count" className="text-right text-xs text-muted-foreground">
            {input.length} / 600 {t(UI.input.charCount, lang)}
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            {t(UI.input.examples, lang)}
          </div>
          <div className="flex flex-wrap gap-2">
            {examples.map((ex) => (
              <button
                key={ex.slug}
                type="button"
                onClick={() => setInput(t(ex.exampleInput, lang))}
                className="rounded-full border border-border bg-secondary/60 px-3 py-1 text-xs text-secondary-foreground transition-colors hover:border-primary/40 hover:bg-primary/10 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
              >
                {t(ex.title, lang)}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {t(UI.input.basicControls, lang)}
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <LabeledSelect
              id="category"
              label={t(UI.controls.category, lang)}
              value={settings.category}
              options={categoryOptions}
              onChange={(v) => updateSetting("category", v as CategorySetting)}
            />
            <LabeledSelect
              id="style"
              label={t(UI.controls.style, lang)}
              value={settings.style}
              options={styleOptions}
              onChange={(v) => updateSetting("style", v as VisualStyle)}
            />
            <LabeledSelect
              id="aspect"
              label={t(UI.controls.aspectRatio, lang)}
              value={settings.aspectRatio}
              options={aspectOptions}
              onChange={(v) => updateSetting("aspectRatio", v as AspectRatio)}
            />
            <LabeledSelect
              id="language"
              label={t(UI.controls.language, lang)}
              value={settings.language}
              options={languageOptions}
              onChange={(v) => updateSetting("language", v as Language)}
            />
          </div>
        </div>

        <Collapsible open={advancedOpen} onOpenChange={setAdvancedOpen}>
          <CollapsibleTrigger asChild>
            <button
              type="button"
              className="flex w-full items-center justify-between rounded-md border border-border bg-secondary/40 px-3 py-2 text-sm font-medium transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
              aria-expanded={advancedOpen}
            >
              <span className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                {t(UI.input.advancedControls, lang)}
              </span>
              <ChevronDown
                className={cn("h-4 w-4 text-muted-foreground transition-transform", advancedOpen && "rotate-180")}
                aria-hidden="true"
              />
            </button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-4 pt-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <LabeledSelect
                id="complexity"
                label={t(UI.controls.complexity, lang)}
                value={settings.complexity}
                options={complexityOptions}
                onChange={(v) => updateSetting("complexity", v as Complexity)}
              />
              <LabeledSelect
                id="density"
                label={t(UI.controls.labelDensity, lang)}
                value={settings.labelDensity}
                options={densityOptions}
                onChange={(v) => updateSetting("labelDensity", v as LabelDensity)}
              />
            </div>
            <div className="space-y-0.5 rounded-lg border border-border bg-background/60 p-3">
              <ToggleRow
                id="include-labels"
                label={t(UI.controls.includeLabels, lang)}
                checked={settings.includeLabels}
                onChange={(v) => updateSetting("includeLabels", v)}
              />
              <ToggleRow
                id="include-explanation"
                label={t(UI.controls.includeExplanation, lang)}
                checked={settings.includeExplanation}
                onChange={(v) => updateSetting("includeExplanation", v)}
              />
              <ToggleRow
                id="include-negative"
                label={t(UI.controls.includeNegativePrompt, lang)}
                checked={settings.includeNegativePrompt}
                onChange={(v) => updateSetting("includeNegativePrompt", v)}
              />
              <ToggleRow
                id="include-simplified"
                label={t(UI.controls.includeSimplifiedPrompt, lang)}
                checked={settings.includeSimplifiedPrompt}
                onChange={(v) => updateSetting("includeSimplifiedPrompt", v)}
              />
              <ToggleRow
                id="include-infographic"
                label={t(UI.controls.includeInfographicPrompt, lang)}
                checked={settings.includeInfographicPrompt}
                onChange={(v) => updateSetting("includeInfographicPrompt", v)}
              />
            </div>
          </CollapsibleContent>
        </Collapsible>

        <Button
          type="button"
          size="lg"
          className="w-full"
          onClick={onGenerate}
          disabled={!canGenerate}
        >
          <Wand2 aria-hidden="true" />
          {isGenerating ? t(UI.input.generating, lang) : t(UI.input.generate, lang)}
        </Button>
        {input.trim().length === 0 && (
          <p className="text-center text-xs text-muted-foreground">{t(UI.input.emptyInput, lang)}</p>
        )}
      </CardContent>
    </Card>
  );
}
