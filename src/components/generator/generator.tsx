"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { InputPanel } from "./input-panel";
import { OutputPanel } from "./output-panel";
import { LoadingStages } from "./loading-stages";
import { HistoryPanel } from "./history-panel";
import { useLanguage } from "@/components/providers";
import { UI, t } from "@/lib/i18n";
import { generationService } from "@/lib/generation/local-service";
import {
  addHistoryEntry,
  clearHistory,
  deleteHistoryEntry,
  loadHistory,
  loadSettings,
  saveSettings,
  toggleFavorite,
} from "@/lib/storage";
import { DEFAULT_SETTINGS } from "@/lib/types";
import type { GenerationResult, GenerationSettings, HistoryEntry } from "@/lib/types";
import { getPhenomenonBySlug } from "@/lib/phenomena";

const STAGE_COUNT = 4;

export function Generator() {
  const searchParams = useSearchParams();
  const { lang, setLang } = useLanguage();

  const [input, setInput] = React.useState("");
  const [settings, setSettings] = React.useState<GenerationSettings>(DEFAULT_SETTINGS);
  const [result, setResult] = React.useState<GenerationResult | null>(null);
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [activeStage, setActiveStage] = React.useState(0);
  const [history, setHistory] = React.useState<HistoryEntry[]>([]);
  const [saved, setSaved] = React.useState(false);
  const hydrated = React.useRef(false);
  const stageTimers = React.useRef<ReturnType<typeof setTimeout>[]>([]);

  // Hydrate from storage once.
  React.useEffect(() => {
    setHistory(loadHistory());
    const stored = loadSettings();
    if (stored) {
      setSettings((prev) => ({ ...prev, ...stored }));
    }
    hydrated.current = true;
  }, []);

  // Keep output language aligned with the global toggle.
  React.useEffect(() => {
    setSettings((prev) => (prev.language === lang ? prev : { ...prev, language: lang }));
  }, [lang]);

  // Prefill from ?input= or ?slug= (examples deep-link).
  React.useEffect(() => {
    const slug = searchParams.get("slug");
    const rawInput = searchParams.get("input");
    if (slug) {
      const profile = getPhenomenonBySlug(slug);
      if (profile) {
        setInput(t(profile.exampleInput, lang));
        return;
      }
    }
    if (rawInput) {
      setInput(rawInput);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  React.useEffect(() => {
    if (hydrated.current) saveSettings(settings);
  }, [settings]);

  React.useEffect(() => {
    return () => stageTimers.current.forEach(clearTimeout);
  }, []);

  const updateSetting = React.useCallback(
    <K extends keyof GenerationSettings>(key: K, value: GenerationSettings[K]) => {
      setSettings((prev) => ({ ...prev, [key]: value }));
      if (key === "language") {
        setLang(value as GenerationSettings["language"]);
      }
    },
    [setLang],
  );

  const runGeneration = React.useCallback(
    async (nextInput: string, nextSettings: GenerationSettings) => {
      if (nextInput.trim().length === 0) return;
      setIsGenerating(true);
      setSaved(false);
      setActiveStage(0);
      stageTimers.current.forEach(clearTimeout);
      stageTimers.current = [];

      // Staged progress feedback (short, non-blocking).
      for (let i = 1; i < STAGE_COUNT; i += 1) {
        stageTimers.current.push(
          setTimeout(() => setActiveStage(i), i * 180),
        );
      }

      const [generated] = await Promise.all([
        generationService.generate({ input: nextInput, settings: nextSettings }),
        new Promise((resolve) => setTimeout(resolve, 720)),
      ]);

      setActiveStage(STAGE_COUNT);
      setResult(generated);
      setIsGenerating(false);
    },
    [],
  );

  const handleGenerate = React.useCallback(() => {
    runGeneration(input, settings);
  }, [input, settings, runGeneration]);

  const handleRegenerate = React.useCallback(() => {
    runGeneration(input, settings);
  }, [input, settings, runGeneration]);

  const handleSave = React.useCallback(() => {
    if (!result) return;
    const updated = addHistoryEntry(input, settings, result);
    setHistory(updated);
    setSaved(true);
  }, [input, settings, result]);

  const handleReopen = React.useCallback(
    (entry: HistoryEntry) => {
      setInput(entry.input);
      setSettings(entry.settings);
      setResult(entry.result);
      setLang(entry.settings.language);
      setSaved(true);
      if (typeof window !== "undefined") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    },
    [setLang],
  );

  const handleOpenSlug = React.useCallback(
    (slug: string) => {
      const profile = getPhenomenonBySlug(slug);
      if (!profile) return;
      const example = t(profile.exampleInput, lang);
      setInput(example);
      runGeneration(example, settings);
      if (typeof window !== "undefined") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    },
    [lang, settings, runGeneration],
  );

  const handleToggleFavorite = React.useCallback((id: string) => {
    setHistory(toggleFavorite(id));
  }, []);

  const handleDelete = React.useCallback((id: string) => {
    setHistory(deleteHistoryEntry(id));
  }, []);

  const handleClear = React.useCallback(() => {
    setHistory(clearHistory());
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,0.62fr)_minmax(0,1fr)]">
        <div className="lg:sticky lg:top-20 lg:self-start">
          <InputPanel
            input={input}
            setInput={setInput}
            settings={settings}
            updateSetting={updateSetting}
            onGenerate={handleGenerate}
            isGenerating={isGenerating}
          />
        </div>

        <div id="output-region" aria-live="polite">
          {isGenerating && !result ? (
            <LoadingStages activeStage={activeStage} />
          ) : (
            <OutputPanel
              input={input}
              settings={settings}
              result={result}
              onRegenerate={handleRegenerate}
              onSave={handleSave}
              onOpenSlug={handleOpenSlug}
              saved={saved}
              isGenerating={isGenerating}
            />
          )}
          {isGenerating && result && (
            <div className="mt-4">
              <LoadingStages activeStage={activeStage} />
            </div>
          )}
        </div>
      </div>

      <HistoryPanel
        entries={history}
        onReopen={handleReopen}
        onToggleFavorite={handleToggleFavorite}
        onDelete={handleDelete}
        onClear={handleClear}
      />

      <p className="pb-4 text-center text-xs text-muted-foreground">
        {t(UI.about.limits, lang)}
      </p>
    </div>
  );
}
