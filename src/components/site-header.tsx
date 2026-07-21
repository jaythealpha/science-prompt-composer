"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Atom, Languages, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLanguage } from "@/components/providers";
import { UI, t } from "@/lib/i18n";
import type { Language } from "@/lib/types";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/", key: "generator" as const },
  { href: "/examples", key: "examples" as const },
  { href: "/about", key: "about" as const },
];

const LANGUAGES: { value: Language; label: string }[] = [
  { value: "en", label: "English" },
  { value: "ko", label: "한국어" },
  { value: "ja", label: "日本語" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const { lang, setLang } = useLanguage();
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2" aria-label={t(UI.brand, lang)}>
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/12 text-primary">
            <Atom className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="hidden text-sm font-semibold tracking-tight sm:inline">
            {t(UI.brand, lang)}
          </span>
        </Link>

        <nav className="flex items-center gap-1" aria-label="Primary">
          {NAV.map((item) => {
            const active = pathname === item.href;
            return (
              <Button
                key={item.href}
                asChild
                variant="ghost"
                size="sm"
                className={cn(
                  "text-muted-foreground",
                  active && "bg-secondary text-foreground",
                )}
              >
                <Link href={item.href} aria-current={active ? "page" : undefined}>
                  {t(UI.nav[item.key], lang)}
                </Link>
              </Button>
            );
          })}

          <div className="mx-1 h-5 w-px bg-border" aria-hidden="true" />

          <Select value={lang} onValueChange={(v) => setLang(v as Language)}>
            <SelectTrigger
              aria-label={t(UI.nav.language, lang)}
              className="h-9 w-auto gap-1.5 border-0 bg-transparent px-2 font-medium shadow-none hover:bg-secondary focus:ring-0 focus:ring-offset-0"
            >
              <Languages className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent align="end" className="min-w-[8rem]">
              {LANGUAGES.map((l) => (
                <SelectItem key={l.value} value={l.value}>
                  {l.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            aria-label={t(UI.nav.theme, lang)}
          >
            {mounted && resolvedTheme === "dark" ? (
              <Sun className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Moon className="h-4 w-4" aria-hidden="true" />
            )}
          </Button>
        </nav>
      </div>
    </header>
  );
}
