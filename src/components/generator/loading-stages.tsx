"use client";

import * as React from "react";
import { Check, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/components/providers";
import { UI, t } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const STAGES = [UI.loading.step1, UI.loading.step2, UI.loading.step3, UI.loading.step4];

export function LoadingStages({ activeStage }: { activeStage: number }) {
  const { lang } = useLanguage();
  return (
    <Card>
      <CardContent className="space-y-3 p-6">
        <div className="mb-1 flex items-center gap-2 text-sm font-medium text-primary">
          <span className="flex gap-1" aria-hidden="true">
            <span className="spc-dot h-1.5 w-1.5 rounded-full bg-primary" style={{ animationDelay: "0ms" }} />
            <span className="spc-dot h-1.5 w-1.5 rounded-full bg-primary" style={{ animationDelay: "150ms" }} />
            <span className="spc-dot h-1.5 w-1.5 rounded-full bg-primary" style={{ animationDelay: "300ms" }} />
          </span>
          {t(UI.input.generating, lang)}
        </div>
        <ol className="space-y-2.5" aria-live="polite">
          {STAGES.map((stage, index) => {
            const done = index < activeStage;
            const active = index === activeStage;
            return (
              <li
                key={index}
                className={cn(
                  "flex items-center gap-3 text-sm transition-colors",
                  done && "text-foreground",
                  active && "text-foreground",
                  !done && !active && "text-muted-foreground/60",
                )}
              >
                <span
                  className={cn(
                    "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border",
                    done && "border-primary bg-primary text-primary-foreground",
                    active && "border-primary text-primary",
                    !done && !active && "border-border",
                  )}
                >
                  {done ? (
                    <Check className="h-3 w-3" aria-hidden="true" />
                  ) : active ? (
                    <Loader2 className="h-3 w-3 animate-spin" aria-hidden="true" />
                  ) : (
                    <span className="h-1.5 w-1.5 rounded-full bg-current opacity-40" aria-hidden="true" />
                  )}
                </span>
                {t(stage, lang)}
              </li>
            );
          })}
        </ol>
      </CardContent>
    </Card>
  );
}
