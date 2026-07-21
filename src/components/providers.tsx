"use client";

import * as React from "react";
import { ThemeProvider } from "next-themes";
import type { Language } from "@/lib/types";

const LANG_KEY = "spc.lang.v1";
const LANG_COOKIE = "spc-lang";

interface LanguageContextValue {
  lang: Language;
  setLang: (lang: Language) => void;
  toggleLang: () => void;
}

const LanguageContext = React.createContext<LanguageContextValue | null>(null);

export function useLanguage(): LanguageContextValue {
  const ctx = React.useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within Providers");
  return ctx;
}

function persistLang(next: Language) {
  try {
    window.localStorage.setItem(LANG_KEY, next);
  } catch {
    /* ignore */
  }
  try {
    document.cookie = `${LANG_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`;
  } catch {
    /* ignore */
  }
}

function LanguageProvider({
  children,
  initialLang,
}: {
  children: React.ReactNode;
  initialLang: Language;
}) {
  // Server and first client render both use `initialLang` (from the cookie),
  // so hydration always matches — no language flash, no mismatch.
  const [lang, setLangState] = React.useState<Language>(initialLang);

  const setLang = React.useCallback((next: Language) => {
    setLangState(next);
    persistLang(next);
  }, []);

  const toggleLang = React.useCallback(() => {
    const order: Language[] = ["en", "ko", "ja"];
    const next = order[(order.indexOf(lang) + 1) % order.length];
    setLang(next);
  }, [lang, setLang]);

  const value = React.useMemo(
    () => ({ lang, setLang, toggleLang }),
    [lang, setLang, toggleLang],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function Providers({
  children,
  initialLang,
}: {
  children: React.ReactNode;
  initialLang: Language;
}) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
      <LanguageProvider initialLang={initialLang}>{children}</LanguageProvider>
    </ThemeProvider>
  );
}
