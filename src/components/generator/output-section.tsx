"use client";

import * as React from "react";
import { CopyButton } from "@/components/copy-button";
import { useLanguage } from "@/components/providers";
import { UI, t } from "@/lib/i18n";
import { cn } from "@/lib/utils";

interface OutputSectionProps {
  title: string;
  description?: string;
  copyValue?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function OutputSection({
  title,
  description,
  copyValue,
  icon,
  children,
  className,
}: OutputSectionProps) {
  const { lang } = useLanguage();
  return (
    <section className={cn("rounded-xl border border-border bg-card p-4 sm:p-5", className)}>
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="space-y-0.5">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
            {icon}
            {title}
          </h3>
          {description ? <p className="text-xs text-muted-foreground">{description}</p> : null}
        </div>
        {copyValue ? (
          <CopyButton
            value={copyValue}
            label={t(UI.actions.copy, lang)}
            copiedLabel={t(UI.actions.copied, lang)}
            showLabel={false}
            className="shrink-0"
          />
        ) : null}
      </div>
      {children}
    </section>
  );
}

export function PromptBlock({ text }: { text: string }) {
  return (
    <pre className="max-h-[420px] overflow-auto whitespace-pre-wrap break-words rounded-lg border border-border bg-background/70 p-4 font-mono text-[13px] leading-relaxed text-foreground">
      {text}
    </pre>
  );
}
