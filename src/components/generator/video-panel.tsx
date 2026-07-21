"use client";

import * as React from "react";
import {
  Clapperboard,
  Clock,
  Download,
  Hash,
  Info,
  ListChecks,
  Sparkles,
  Type,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/copy-button";
import { OutputSection, PromptBlock } from "./output-section";
import { useLanguage } from "@/components/providers";
import { UI, t } from "@/lib/i18n";
import { downloadFile, slugifyForFile } from "@/lib/export";
import {
  buildVideoBrief,
  buildVideoBriefJson,
  PLATFORM_META,
  type Platform,
  type ShotRole,
} from "@/lib/video/brief";
import type { GenerationResult, GenerationSettings } from "@/lib/types";
import { cn } from "@/lib/utils";

const PLATFORMS: Platform[] = ["shorts", "reels", "tiktok"];

const ROLE_TONE: Record<ShotRole, string> = {
  hook: "text-accent",
  cause: "text-primary",
  mechanism: "text-primary",
  result: "text-primary",
  payoff: "text-accent",
};

function timecode(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = Math.round(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

interface VideoPanelProps {
  input: string;
  result: GenerationResult;
  settings: GenerationSettings;
}

export function VideoPanel({ input, result, settings }: VideoPanelProps) {
  const { lang } = useLanguage();
  const [platform, setPlatform] = React.useState<Platform>("shorts");

  const brief = React.useMemo(
    () => buildVideoBrief(result, settings, platform, lang),
    [result, settings, platform, lang],
  );

  const copyLabel = t(UI.actions.copy, lang);
  const copiedLabel = t(UI.actions.copied, lang);

  // Full narration script with cumulative timecodes.
  const script = React.useMemo(() => {
    let acc = 0;
    return brief.shots
      .map((shot) => {
        const line = `[${timecode(acc)}] ${shot.narration}`;
        acc += shot.durationSec;
        return line;
      })
      .join("\n\n");
  }, [brief]);

  const retentionItems = [
    UI.video.retentionItems.hook,
    UI.video.retentionItems.captions,
    UI.video.retentionItems.length,
    UI.video.retentionItems.oneIdea,
    UI.video.retentionItems.loop,
  ];

  const handleExport = () => {
    downloadFile(
      `${slugifyForFile(result.title)}-video-brief.json`,
      buildVideoBriefJson(brief, input, result),
      "application/json;charset=utf-8",
    );
  };

  let acc = 0;

  return (
    <div className="space-y-4">
      <p className="px-1 text-sm text-muted-foreground">{t(UI.video.intro, lang)}</p>

      {/* Platform + duration */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card p-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-muted-foreground">
            {t(UI.video.platform, lang)}
          </span>
          <div className="inline-flex rounded-lg bg-secondary p-1" role="tablist">
            {PLATFORMS.map((p) => (
              <button
                key={p}
                type="button"
                role="tab"
                aria-selected={platform === p}
                onClick={() => setPlatform(p)}
                className={cn(
                  "rounded-md px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  platform === p
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {PLATFORM_META[p].label}
              </button>
            ))}
          </div>
        </div>
        <Badge variant="outline" className="gap-1">
          <Clock className="h-3 w-3" aria-hidden="true" />
          {t(UI.video.duration, lang)}: ~{brief.totalDurationSec}s · {brief.aspectRatio}
        </Badge>
      </div>

      {/* CJK / caption policy note */}
      <p className="flex items-start gap-2 rounded-lg border border-border bg-secondary/40 p-3 text-xs leading-relaxed text-muted-foreground">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
        <span>{t(UI.video.captionNote, lang)}</span>
      </p>

      {/* Hooks */}
      <OutputSection
        title={t(UI.video.hooks, lang)}
        description={t(UI.video.hookHint, lang)}
        icon={<Sparkles className="h-4 w-4 text-accent" aria-hidden="true" />}
        copyValue={brief.hooks.join("\n")}
      >
        <ul className="space-y-2">
          {brief.hooks.map((hook, i) => (
            <li
              key={i}
              className="flex items-center justify-between gap-2 rounded-lg border border-border bg-background/60 p-2.5 pl-3 text-sm text-foreground"
            >
              <span>{hook}</span>
              <CopyButton
                value={hook}
                label={copyLabel}
                copiedLabel={copiedLabel}
                showLabel={false}
                className="shrink-0"
              />
            </li>
          ))}
        </ul>
      </OutputSection>

      {/* Storyboard */}
      <OutputSection
        title={t(UI.video.storyboard, lang)}
        icon={<Clapperboard className="h-4 w-4 text-primary" aria-hidden="true" />}
      >
        <ol className="space-y-3">
          {brief.shots.map((shot) => {
            const start = timecode(acc);
            acc += shot.durationSec;
            return (
              <li
                key={shot.index}
                className="rounded-lg border border-border bg-background/60 p-3"
              >
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/12 text-[11px] font-semibold text-primary">
                    {shot.index}
                  </span>
                  <span className={cn("text-xs font-semibold uppercase tracking-wide", ROLE_TONE[shot.role])}>
                    {shot.role}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {start} · {shot.durationSec}s
                  </span>
                </div>

                <div className="space-y-2 text-sm">
                  <FieldRow label={t(UI.video.caption, lang)} value={shot.caption} copyLabel={copyLabel} copiedLabel={copiedLabel} />
                  <FieldRow label={t(UI.video.narration, lang)} value={shot.narration} copyLabel={copyLabel} copiedLabel={copiedLabel} />
                  <FieldRow label={t(UI.video.imagePrompt, lang)} value={shot.imagePrompt} mono copyLabel={copyLabel} copiedLabel={copiedLabel} />
                  <FieldRow label={t(UI.video.motionPrompt, lang)} value={shot.motionPrompt} mono copyLabel={copyLabel} copiedLabel={copiedLabel} />
                </div>
              </li>
            );
          })}
        </ol>
      </OutputSection>

      {/* Full script */}
      <OutputSection
        title={t(UI.video.scriptTitle, lang)}
        copyValue={script}
      >
        <PromptBlock text={script} />
      </OutputSection>

      {/* Packaging */}
      <OutputSection
        title={t(UI.video.packaging, lang)}
        icon={<Type className="h-4 w-4 text-primary" aria-hidden="true" />}
      >
        <div className="space-y-3">
          <div>
            <div className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {t(UI.video.titleOptions, lang)}
            </div>
            <ul className="space-y-1.5">
              {brief.titleOptions.map((title, i) => (
                <li
                  key={i}
                  className="flex items-center justify-between gap-2 rounded-md border border-border bg-background/60 px-3 py-1.5 text-sm"
                >
                  <span>{title}</span>
                  <CopyButton value={title} label={copyLabel} copiedLabel={copiedLabel} showLabel={false} className="shrink-0" />
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              <Hash className="h-3 w-3" aria-hidden="true" />
              {t(UI.video.hashtags, lang)}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {brief.hashtags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-[12px]">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          <FieldRow label={t(UI.video.thumbnail, lang)} value={brief.thumbnailText} copyLabel={copyLabel} copiedLabel={copiedLabel} />
        </div>
      </OutputSection>

      {/* Retention checklist */}
      <OutputSection
        title={t(UI.video.retention, lang)}
        icon={<ListChecks className="h-4 w-4 text-primary" aria-hidden="true" />}
      >
        <ul className="space-y-1.5">
          {retentionItems.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-foreground">
              <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-[4px] border border-primary/50 text-primary">
                <span className="h-1.5 w-1.5 rounded-[1px] bg-primary" aria-hidden="true" />
              </span>
              {t(item, lang)}
            </li>
          ))}
        </ul>
      </OutputSection>

      <Button variant="outline" size="sm" onClick={handleExport}>
        <Download aria-hidden="true" />
        {t(UI.video.exportBrief, lang)}
      </Button>
    </div>
  );
}

function FieldRow({
  label,
  value,
  mono,
  copyLabel,
  copiedLabel,
}: {
  label: string;
  value: string;
  mono?: boolean;
  copyLabel: string;
  copiedLabel: string;
}) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between gap-2">
        <span className="text-xs font-medium text-muted-foreground">{label}</span>
        <CopyButton value={value} label={copyLabel} copiedLabel={copiedLabel} showLabel={false} size="sm" className="h-6 w-6" />
      </div>
      <p className={cn("leading-relaxed text-foreground", mono && "font-mono text-[13px]")}>{value}</p>
    </div>
  );
}
