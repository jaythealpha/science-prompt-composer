"use client";

import * as React from "react";
import { History, Star, Trash2, Undo2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/components/providers";
import { UI, t } from "@/lib/i18n";
import type { HistoryEntry } from "@/lib/types";
import { cn } from "@/lib/utils";

interface HistoryPanelProps {
  entries: HistoryEntry[];
  onReopen: (entry: HistoryEntry) => void;
  onToggleFavorite: (id: string) => void;
  onDelete: (id: string) => void;
  onClear: () => void;
}

export function HistoryPanel({
  entries,
  onReopen,
  onToggleFavorite,
  onDelete,
  onClear,
}: HistoryPanelProps) {
  const { lang } = useLanguage();

  const sorted = React.useMemo(() => {
    return [...entries].sort((a, b) => {
      if (a.favorite !== b.favorite) return a.favorite ? -1 : 1;
      return b.createdAt - a.createdAt;
    });
  }, [entries]);

  const handleClear = () => {
    if (window.confirm(t(UI.history.confirmClear, lang))) {
      onClear();
    }
  };

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle className="flex items-center gap-2">
          <History className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          {t(UI.history.title, lang)}
          {entries.length > 0 && (
            <span className="text-xs font-normal text-muted-foreground">({entries.length})</span>
          )}
        </CardTitle>
        {entries.length > 0 && (
          <Button variant="ghost" size="sm" onClick={handleClear} aria-label={t(UI.history.clear, lang)}>
            <Trash2 aria-hidden="true" />
            <span className="hidden sm:inline">{t(UI.history.clear, lang)}</span>
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {sorted.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">{t(UI.history.empty, lang)}</p>
        ) : (
          <ul className="grid gap-2 sm:grid-cols-2">
            {sorted.map((entry) => (
              <li
                key={entry.id}
                className="flex items-center justify-between gap-2 rounded-lg border border-border bg-background/60 p-3"
              >
                <button
                  type="button"
                  onClick={() => onReopen(entry)}
                  className="min-w-0 flex-1 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md cursor-pointer"
                >
                  <div className="flex items-center gap-1.5">
                    {entry.favorite && (
                      <Star className="h-3 w-3 shrink-0 fill-amber-400 text-amber-400" aria-hidden="true" />
                    )}
                    <span className="truncate text-sm font-medium text-foreground">
                      {entry.result.title}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center gap-1.5">
                    <Badge variant="outline" className="text-[10px]">
                      {t(UI.category[entry.result.detectedCategory], lang)}
                    </Badge>
                    <span className="truncate text-xs text-muted-foreground">{entry.input}</span>
                  </div>
                </button>
                <div className="flex shrink-0 items-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => onToggleFavorite(entry.id)}
                    aria-label={entry.favorite ? t(UI.history.unfavorite, lang) : t(UI.history.favorite, lang)}
                  >
                    <Star
                      className={cn(
                        "h-4 w-4",
                        entry.favorite ? "fill-amber-400 text-amber-400" : "text-muted-foreground",
                      )}
                      aria-hidden="true"
                    />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => onReopen(entry)}
                    aria-label={t(UI.history.reopen, lang)}
                  >
                    <Undo2 className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => onDelete(entry.id)}
                    aria-label={t(UI.history.delete, lang)}
                  >
                    <Trash2 className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
